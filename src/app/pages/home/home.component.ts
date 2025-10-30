import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from '../../services';
import { Game } from '../../models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredGames: Game[] = [];
  newGames: Game[] = [];
  gamesOnSale: Game[] = [];
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadHomeData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadHomeData(): void {
    this.loading = true;
    this.error = null;

    // Load featured games
    this.gameService.getFeaturedGames()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (games) => {
          this.featuredGames = games;
          this.checkLoadingComplete();
        },
        error: (error) => {
          console.error('Error loading featured games:', error);
          this.handleError('Erro ao carregar jogos em destaque');
        }
      });

    // Load new games
    this.gameService.getNewGames()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (games) => {
          this.newGames = games;
          this.checkLoadingComplete();
        },
        error: (error) => {
          console.error('Error loading new games:', error);
          this.handleError('Erro ao carregar novos jogos');
        }
      });

    // Load games on sale
    this.gameService.getGamesOnSale()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (games) => {
          this.gamesOnSale = games;
          this.checkLoadingComplete();
        },
        error: (error) => {
          console.error('Error loading games on sale:', error);
          this.handleError('Erro ao carregar jogos em promoção');
        }
      });
  }

  private checkLoadingComplete(): void {
    if (this.featuredGames.length >= 0 && 
        this.newGames.length >= 0 && 
        this.gamesOnSale.length >= 0) {
      this.loading = false;
    }
  }

  private handleError(message: string): void {
    this.error = message;
    this.loading = false;
  }

  onAddToCart(game: Game): void {
    // This will be handled by the product card component
    console.log('Adding to cart:', game.nome);
  }

  onQuickView(game: Game): void {
    // Navigate to game details
    console.log('Quick view:', game.nome);
  }
}
