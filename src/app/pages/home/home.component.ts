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
  allGames: Game[] = [];
  loading = true;
  error: string | null = null;
  

  currentPage = 1;
  totalPages = 1;
  totalElements = 0;
  pageSize = 12;


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
    const params = {
      page: this.currentPage - 1, 
      size: this.pageSize,
    };

    this.gameService.getAllGames(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.allGames = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.currentPage = response.number + 1;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading games:', error);
          this.error = 'Erro ao carregar jogos';
          this.loading = false;
        }
      });
}

  private checkLoadingComplete(): void {
    if (this.allGames.length >= 0) {
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
