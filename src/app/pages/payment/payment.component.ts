import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CartService, PaymentService } from '../../services';
import { Cart, PaymentRequest } from '../../models';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  paymentForm: FormGroup;
  processingPayment = false;
  paymentSuccess = false;

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.paymentForm = this.formBuilder.group({
      paymentMethod: ['CREDIT_CARD', [Validators.required]],
      cardNumber: [''],
      cardHolderName: [''],
      cardExpiryMonth: [''],
      cardExpiryYear: [''],
      cardCvv: [''],
      pixKey: ['']
    });
  }

  ngOnInit(): void {
    // Adicionar classe ao body para ocultar footer
    document.body.classList.add('payment-page');
    
    this.loadCart();
    this.setupPaymentMethodValidation();
  }

  ngOnDestroy(): void {
    // Remover classe do body
    document.body.classList.remove('payment-page');
    
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCart(): void {
    this.cartService.getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cart) => {
          this.cart = cart;
          // Não redirecionar automaticamente - deixar o usuário decidir
        },
        error: (error) => {
          console.error('Error loading cart:', error);
          // Não redirecionar automaticamente - mostrar mensagem de erro
        }
      });
  }

  private setupPaymentMethodValidation(): void {
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      const cardNumber = this.paymentForm.get('cardNumber');
      const cardHolderName = this.paymentForm.get('cardHolderName');
      const cardExpiryMonth = this.paymentForm.get('cardExpiryMonth');
      const cardExpiryYear = this.paymentForm.get('cardExpiryYear');
      const cardCvv = this.paymentForm.get('cardCvv');
      const pixKey = this.paymentForm.get('pixKey');

      if (method === 'CREDIT_CARD') {
        cardNumber?.setValidators([Validators.required]);
        cardHolderName?.setValidators([Validators.required]);
        cardExpiryMonth?.setValidators([Validators.required, Validators.min(1), Validators.max(12)]);
        cardExpiryYear?.setValidators([Validators.required, Validators.min(2024)]);
        cardCvv?.setValidators([Validators.required]);
        pixKey?.clearValidators();
      } else if (method === 'PIX') {
        cardNumber?.clearValidators();
        cardHolderName?.clearValidators();
        cardExpiryMonth?.clearValidators();
        cardExpiryYear?.clearValidators();
        cardCvv?.clearValidators();
        pixKey?.setValidators([Validators.required]);
      }

      cardNumber?.updateValueAndValidity();
      cardHolderName?.updateValueAndValidity();
      cardExpiryMonth?.updateValueAndValidity();
      cardExpiryYear?.updateValueAndValidity();
      cardCvv?.updateValueAndValidity();
      pixKey?.updateValueAndValidity();
    });
  }

  getTotal(): number {
    if (!this.cart?.cartGames) return 0;
    return this.cart.cartGames.reduce((total, item) => {
      const price = item.game?.discountPrice || item.game?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    event.target.value = value;
    this.paymentForm.patchValue({ cardNumber: value });
  }

  processPayment(): void {
    if (this.paymentForm.valid && this.cart) {
      this.processingPayment = true;

      const paymentData: PaymentRequest = {
        orderId: this.cart.id,
        amount: this.getTotal(),
        paymentMethod: this.paymentForm.value.paymentMethod,
        cardNumber: this.paymentForm.value.cardNumber,
        cardHolderName: this.paymentForm.value.cardHolderName,
        cardExpiryMonth: +this.paymentForm.value.cardExpiryMonth,
        cardExpiryYear: +this.paymentForm.value.cardExpiryYear,
        cardCvv: this.paymentForm.value.cardCvv,
        pixKey: this.paymentForm.value.pixKey
      };

      this.paymentService.processMockPayment(paymentData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.processingPayment = false;
            if (response.status === 'SUCCESS') {
              this.paymentSuccess = true;
              this.cartService.clearCart().subscribe();
            } else {
              alert('Pagamento falhou: ' + response.message);
            }
          },
          error: (error) => {
            this.processingPayment = false;
            console.error('Payment error:', error);
            alert('Erro no processamento do pagamento');
          }
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/carrinho']);
  }
}

