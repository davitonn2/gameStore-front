import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CartService, PaymentService } from '../../services';
import { Cart, PaymentRequest } from '../../models';

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

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
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
          if (!cart?.cartGames?.length) {
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
    if (!this.cart?.cartGames) return 0;
    return this.cart.cartGames.reduce((total, item) => {
      const price =  item.game?.valor || 0;
      return total + (price * item.quantity);
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

      const paymentData: PaymentRequest = {
        orderId: this.cart.id,
        amount: this.getTotal(),
        paymentMethod: this.paymentForm.value.paymentMethod,
        cardNumber: this.paymentForm.value.cardNumber,
        cardHolderName: this.paymentForm.value.cardHolderName,
        cardExpiryMonth: +this.paymentForm.value.cardExpiryMonth,
        cardExpiryYear: +this.paymentForm.value.cardExpiryYear,
        cardCvv: this.paymentForm.value.cardCvv
      };

      // For demo purposes, using mock payment
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
}
