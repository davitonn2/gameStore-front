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
                        this.processingPayment = false;
                        if (captureResponse.status === 'SUCCESS' || captureResponse.status === 'APPROVED') {
                          this.paymentSuccess = true;
                          this.paymentError = null;
                          this.paymentErrorClass = '';
                          this.cartService.clearCart().subscribe();
                        } else {
                          this.paymentSuccess = false;
                          this.paymentError = captureResponse.mensagem || 'Pagamento não aprovado.';
                          this.paymentErrorClass = 'text-danger';
                        }
                      },
                      error: (err) => {
                        this.processingPayment = false;
                        this.paymentSuccess = false;
                        const msg = err?.error?.error?.message || err?.error?.message || 'Erro ao capturar pagamento.';
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
                  const msg = err?.error?.error?.message || err?.error?.message || 'Erro ao criar intent de pagamento.';
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
