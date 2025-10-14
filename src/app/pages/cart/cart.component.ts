import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services';
import { Cart, CartGame } from '../../models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  loading = true;
  error: string | null = null;
  updatingItems: Set<number> = new Set();

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCart(): void {
    this.loading = true;
    this.error = null;

    this.cartService.getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cart) => {
          this.cart = cart;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading cart:', error);
          this.error = 'Erro ao carregar carrinho';
          this.loading = false;
        }
      });
  }

  getItemPrice(cartGame: CartGame): number {
    const game = cartGame.game;
    if (!game) return 0;
    return game.discountPrice || game.price;
  }

  getItemTotal(cartGame: CartGame): number {
    return this.getItemPrice(cartGame) * cartGame.quantity;
  }

  getSubtotal(): number {
    if (!this.cart?.cartGames) return 0;
    return this.cart.cartGames.reduce((total, item) => total + this.getItemTotal(item), 0);
  }

  getTotal(): number {
    return this.getSubtotal(); // No tax or shipping for digital games
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  hasDiscount(cartGame: any): boolean {
    return !!(cartGame.game?.discountPrice && 
              cartGame.game?.price && 
              cartGame.game.discountPrice < cartGame.game.price);
  }

  updateQuantity(cartGameId: number, quantity: number): void {
    if (quantity < 1) return;

    this.updatingItems.add(cartGameId);

    this.cartService.updateCartItem(cartGameId, { quantity })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.updatingItems.delete(cartGameId);
        },
        error: (error) => {
          console.error('Error updating cart item:', error);
          this.updatingItems.delete(cartGameId);
        }
      });
  }

  removeItem(cartGameId: number): void {
    this.updatingItems.add(cartGameId);

    this.cartService.removeFromCart(cartGameId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.updatingItems.delete(cartGameId);
        },
        error: (error) => {
          console.error('Error removing cart item:', error);
          this.updatingItems.delete(cartGameId);
        }
      });
  }

  clearCart(): void {
    if (!confirm('Tem certeza que deseja esvaziar o carrinho?')) {
      return;
    }

    this.cartService.clearCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Cart will be updated via the observable
        },
        error: (error) => {
          console.error('Error clearing cart:', error);
        }
      });
  }

  proceedToCheckout(): void {
    if (!this.cart?.cartGames?.length) {
      return;
    }

    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/catalogo']);
  }

  isEmpty(): boolean {
    return !this.cart?.cartGames?.length;
  }

  isUpdating(cartGameId: number): boolean {
    return this.updatingItems.has(cartGameId);
  }
}
