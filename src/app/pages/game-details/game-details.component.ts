import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GameService, CartService } from '../../services';
import { Game } from '../../models';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss']
})
export class GameDetailsComponent implements OnInit, OnDestroy {
  game: Game | null = null;
  relatedGames: Game[] = [];
  loading = true;
  error: string | null = null;
  selectedImageIndex = 0;
  quantity = 1;

  private destroy$ = new Subject<void>();

  constructor(
    private gameService: GameService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const gameId = +params['id'];
        if (gameId) {
          this.loadGame(gameId);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadGame(gameId: number): void {
    this.loading = true;
    this.error = null;

    this.gameService.getGameById(gameId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (game) => {
          this.game = game;
          this.loadRelatedGames(gameId);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading game:', error);
          this.error = 'Jogo não encontrado';
          this.loading = false;
        }
      });
  }

  private loadRelatedGames(gameId: number): void {
    this.gameService.getRelatedGames(gameId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (games) => {
          this.relatedGames = games;
        },
        error: (error) => {
          console.error('Error loading related games:', error);
        }
      });
  }

  getMainImage(): string {
    if (!this.game?.images?.length) {
      return 'assets/images/placeholder-game.jpg';
    }
    return this.game.images[this.selectedImageIndex]?.url || this.game.images[0].url;
  }

  getCurrentPrice(): number {
    return this.game?.discountPrice || this.game?.price || 0;
  }

  hasDiscount(): boolean {
    return !!(this.game?.discountPrice && this.game.discountPrice < this.game.price);
  }

  getDiscountPercentage(): number {
    if (!this.hasDiscount() || !this.game) return 0;
    return Math.round(((this.game.price - this.game.discountPrice!) / this.game.price) * 100);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onQuantityChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    if (value && value > 0) {
      this.quantity = value;
    }
  }

  addToCart(): void {
    if (!this.game) return;

    this.cartService.addToCart({ gameId: this.game.id, quantity: this.quantity })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Show success message
          console.log('Added to cart:', this.game!.title);
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
        }
      });
  }

  buyNow(): void {
    if (!this.game) return;

    this.addToCart();
    this.router.navigate(['/checkout']);
  }

  onRelatedGameClick(game: Game): void {
    this.router.navigate(['/jogo', game.id]);
  }
}
