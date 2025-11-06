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
    if (!this.game?.imagens?.length) {
      return 'assets/images/placeholder-game.jpg';
    }
    return this.game.imagens[this.selectedImageIndex]?.url || this.game.imagens[0].url;
  }

  getCurrentPrice(): number {
    return this.game?.valor || 0;
  }

  // Desconto removido, pois não existe mais no model Game

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(d);
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
          console.log('Added to cart:', this.game!.nome);
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
        }
      });
  }

  buyNow(): void {
    if (!this.game) return;

    // Ensure the game is added (and fetched/populated) before navigating to checkout
    this.cartService.addToCart({ gameId: this.game.id, quantity: this.quantity })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Added to cart (buy now):', this.game!.nome);
          this.router.navigate(['/checkout']);
        },
        error: (error) => {
          console.error('Error adding to cart (buy now):', error);
          // still navigate to checkout so user can retry
          this.router.navigate(['/checkout']);
        }
      });
  }

  onRelatedGameClick(game: Game): void {
    this.router.navigate(['/jogo', game.id]);
  }
}
