import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CartService, PaymentService, OrderService } from '../../services';
import { Cart, PaymentRequest, CreateOrderRequest, Order } from '../../models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  checkoutForm: FormGroup;
  paymentForm: FormGroup;
  loading = false;
  processingPayment = false;
  paymentSuccess = false;
  paymentError: string | null = null;
  paymentErrorClass: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.checkoutForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]]
    });

    this.paymentForm = this.formBuilder.group({
      paymentMethod: ['CREDIT_CARD', [Validators.required]],
      cardNumber: [''],
      cardHolderName: [''],
      cardExpiryMonth: [''],
      cardExpiryYear: [''],
      cardCvv: ['']
    });
  }

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCart(): void {
    this.cartService.getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cart) => {
          this.cart = cart;
          if (!cart?.carrinhoJogos?.length) {
            this.router.navigate(['/catalogo']);
          }
        },
        error: (error) => {
          console.error('Error loading cart:', error);
          this.router.navigate(['/catalogo']);
        }
      });
  }

  getTotal(): number {
    if (!this.cart?.carrinhoJogos) return 0;
    return this.cart.carrinhoJogos.reduce((total, item) => {
      const price =  item.jogo?.valor || 0;
      return total + (price * item.quantidade);
    }, 0);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  processPayment(): void {
    if (this.checkoutForm.valid && this.paymentForm.valid && this.cart) {
      this.processingPayment = true;
      this.paymentError = null;
      this.paymentErrorClass = '';

      // 1. Montar o payload do pedido conforme backend
      const orderRequest: CreateOrderRequest = {
        usuarioId: this.cart.usuarioId,
        itens: this.cart.carrinhoJogos.map(item => ({
          jogoId: item.jogoId,
          quantidade: item.quantidade
        }))
      };

      // 2. Criar pedido no backend
      this.orderService.createOrder(orderRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (order: Order) => {
            // 3. Montar dados do pagamento para o backend (intent)
            const paymentData: any = {
              orderId: String(order.id),
              amount: this.getTotal(),
              paymentMethod: 'credit_card',
              cardNumber: this.paymentForm.value.cardNumber,
              cardHolderName: this.paymentForm.value.cardHolderName,
              cardExpiryMonth: +this.paymentForm.value.cardExpiryMonth,
              cardExpiryYear: +this.paymentForm.value.cardExpiryYear,
              cardCvv: this.paymentForm.value.cardCvv
            };
            // 4. Criar intent de pagamento
            this.paymentService.createPaymentIntent(paymentData)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (intentResponse) => {
                  console.log('Resposta da criação da intent:', intentResponse);
                  const intentId = intentResponse.intentId || intentResponse.id;
                  if (!intentId) {
                    this.processingPayment = false;
                    this.paymentError = 'Erro: intentId não retornado.';
                    this.paymentErrorClass = 'text-danger';
                    return;
                  }
                  // Captura o pagamento
                  const captureData = {
                    orderId: String(order.id),
                    amount: this.getTotal(),
                    cardNumber: String(this.paymentForm.value.cardNumber),
                    cardHolderName: String(this.paymentForm.value.cardHolderName),
                    expirationMonth: String(this.paymentForm.value.cardExpiryMonth),
                    expirationYear: String(this.paymentForm.value.cardExpiryYear),
                    cvv: String(this.paymentForm.value.cardCvv)
                  };
                  this.paymentService.capturePayment(intentId, captureData)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                      next: (captureResponse) => {
                        // Log completo para depuração
                        console.log('Resposta da captura (raw):', captureResponse);
                        this.processingPayment = false;

                        // Tentar extrair status de várias formas
                        const rawStatus = (
                          (captureResponse && (captureResponse.status || captureResponse.data?.status || captureResponse.payment?.status)) ||
                          ''
                        );
                        const status = String(rawStatus).toUpperCase();

                        // Fallbacks: quando proxy retorna success:true ou flow=CREDIT_AUTHORIZATION
                        const successFlag = Boolean(captureResponse && (captureResponse.success === true || captureResponse.data?.success === true));
                        const flow = (captureResponse && (captureResponse.flow || captureResponse.data?.flow)) || '';

                        const accepted = ['SUCCESS', 'APPROVED', 'AUTHORIZED'].includes(status) || successFlag || String(flow).toUpperCase().includes('AUTHORIZATION');

                        if (accepted) {
                                this.paymentSuccess = true;
                                this.paymentError = null;
                                this.paymentErrorClass = '';
                                // Informar backend para marcar o pedido como aprovado
                                this.paymentService.finalizeOrder(order.id).pipe(takeUntil(this.destroy$)).subscribe({
                                  next: () => {
                                    // Limpar carrinho e garantir navegação para a página de agradecimento
                                    this.cartService.clearCart().subscribe({ next: () => {
                                      // Navegar explicitamente com replaceUrl para evitar voltar para checkout
                                      this.router.navigate(['/thank-you'], { queryParams: { orderId: order.id }, replaceUrl: true });
                                    }, error: (e) => {
                                      console.warn('Erro ao limpar carrinho, mas continuará com redirecionamento:', e);
                                      this.router.navigate(['/thank-you'], { queryParams: { orderId: order.id }, replaceUrl: true });
                                    }});
                                  },
                                  error: (err) => {
                                    console.error('Erro ao finalizar pedido no backend:', err);
                                    // Mesmo que finalização falhe, prossiga com limpeza do carrinho e redirecionamento
                                    this.cartService.clearCart().subscribe({ next: () => {
                                      this.router.navigate(['/thank-you'], { queryParams: { orderId: order.id }, replaceUrl: true });
                                    }, error: (e) => {
                                      console.warn('Erro ao limpar carrinho, mas continuará com redirecionamento:', e);
                                      this.router.navigate(['/thank-you'], { queryParams: { orderId: order.id }, replaceUrl: true });
                                    }});
                                  }
                                });
                        } else {
                          this.paymentSuccess = false;
                          this.paymentError = captureResponse.mensagem || captureResponse.message || 'Pagamento não aprovado.';
                          this.paymentErrorClass = 'text-danger';
                          console.error('Erro na captura do pagamento:', captureResponse);
                        }
                      },
                      error: (err) => {
                        this.processingPayment = false;
                        this.paymentSuccess = false;
                        console.error('Erro HTTP ao capturar pagamento:', err);
                        const msg = err?.error?.error?.message || err?.error?.message || JSON.stringify(err) || 'Erro ao capturar pagamento.';
                        if (msg.includes('Limite insuficiente')) {
                          this.paymentError = 'Pagamento negado! Limite insuficiente.';
                          this.paymentErrorClass = 'text-primary';
                        } else if (msg.includes('Cartão não encontrado')) {
                          this.paymentError = 'Pagamento negado! Cartão inválido.';
                          this.paymentErrorClass = 'text-danger';
                        } else {
                          this.paymentError = msg;
                          this.paymentErrorClass = 'text-danger';
                        }
                      }
                    });
                },
                error: (err) => {
                  this.processingPayment = false;
                  this.paymentSuccess = false;
                  console.error('Erro HTTP ao criar intent:', err);
                  const msg = err?.error?.error?.message || err?.error?.message || JSON.stringify(err) || 'Erro ao criar intent de pagamento.';
                  this.paymentError = msg;
                  this.paymentErrorClass = 'text-danger';
                }
              });
          },
          error: (error) => {
            this.processingPayment = false;
            this.paymentError = 'Erro ao criar pedido. Tente novamente.';
            this.paymentErrorClass = 'text-danger';
          }
        });
    }
  }
}
