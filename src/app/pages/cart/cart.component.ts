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
  private cartSubscription: any;

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to cart observable for reactive updates
    this.cartSubscription = this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cart = cart;
        this.loading = false;
      });
    // Initial load
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
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

  getMainImage(game: any): string {
    if (!game || !game.imagens) return 'assets/images/placeholder-game.jpg';
    const mainImage = game.imagens.find((img: any) => img.isMainImage);
    return mainImage?.url || game.imagens[0]?.url || 'assets/images/placeholder-game.jpg';
  }


  getItemPrice(cartGame: CartGame): number {
    const game = cartGame.jogo;
    if (!game) return 0;
    return game.valor;
  }

  getItemTotal(cartGame: CartGame): number {
    return this.getItemPrice(cartGame) * cartGame.quantidade;
  }

  getSubtotal(): number {
    if (!this.cart?.carrinhoJogos) return 0;
    return this.cart.carrinhoJogos.reduce((total, item) => total + this.getItemTotal(item), 0);
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


  // Desconto removido, não existe mais no model Game


  updateQuantity(cartGame: CartGame, quantidade: number): void {
    if (quantidade < 1) return;
    this.updatingItems.add(cartGame.jogoId);
    this.cartService.updateCartItem(cartGame.jogoId, { quantidade })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.updatingItems.delete(cartGame.jogoId);
        },
        error: (error) => {
          console.error('Error updating cart item:', error);
          this.updatingItems.delete(cartGame.jogoId);
        }
      });
  }


  removeItem(cartGame: CartGame): void {
    this.updatingItems.add(cartGame.jogoId);
    this.cartService.removeFromCart(cartGame.jogoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.updatingItems.delete(cartGame.jogoId);
        },
        error: (error) => {
          console.error('Error removing cart item:', error);
          this.updatingItems.delete(cartGame.jogoId);
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

    if (!this.cart?.carrinhoJogos?.length) {
      return;
    }

    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/catalogo']);
  }


  isEmpty(): boolean {
    return !this.cart?.carrinhoJogos?.length;
  }


  isUpdating(jogoId: number): boolean {
    return this.updatingItems.has(jogoId);
  }
}
