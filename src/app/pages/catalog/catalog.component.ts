import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { GameService, CategoryService, CartService } from '../../services';
import { Game, Category } from '../../models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent, PaginationComponent],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit, OnDestroy {
  games: Game[] = [];
  categories: Category[] = [];
  loading = true;
  error: string | null = null;
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalElements = 0;
  pageSize = 12;
  
  // Filters
  selectedCategory: number | null = null;
  searchQuery = '';
  minPrice = 0;
  maxPrice = 1000;
  sortBy = 'title';
  sortDirection: 'ASC' | 'DESC' = 'ASC';
  
  // UI State
  showFilters = false;
  priceRange = { min: 0, max: 1000 };

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private gameService: GameService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.setupSearchDebounce();
    this.loadGames();
    this.loadRouteParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadGames();
      });
  }

  private loadRouteParams(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.searchQuery = params['search'] || '';
        this.selectedCategory = params['category'] ? +params['category'] : null;
        this.currentPage = params['page'] ? +params['page'] : 1;
        this.loadGames();
      });
  }

  private loadCategories(): void {
    this.categoryService.getActiveCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        }
      });
  }

  loadGames(): void {
    this.loading = true;
    this.error = null;

    const params = {
      page: this.currentPage - 1, // API uses 0-based pagination
      size: this.pageSize,
      categoryId: this.selectedCategory || undefined,
      search: this.searchQuery,
      minPrice: this.minPrice > 0 ? this.minPrice : undefined,
      maxPrice: this.maxPrice < 1000 ? this.maxPrice : undefined,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection
    };

    this.gameService.getAllGames(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.games = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.currentPage = response.number + 1; // Convert back to 1-based
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading games:', error);
          this.error = 'Erro ao carregar jogos';
          this.loading = false;
        }
      });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onCategoryChange(): void {
    this.currentPage = 1;
    this.updateUrl();
    this.loadGames();
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.updateUrl();
    this.loadGames();
  }

  onPriceRangeChange(): void {
    this.minPrice = this.priceRange.min;
    this.maxPrice = this.priceRange.max;
    this.currentPage = 1;
    this.updateUrl();
    this.loadGames();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateUrl();
    this.loadGames();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.updateUrl();
    this.loadGames();
  }

  clearFilters(): void {
    this.selectedCategory = null;
    this.searchQuery = '';
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.priceRange = { min: 0, max: 1000 };
    this.sortBy = 'title';
    this.sortDirection = 'ASC';
    this.currentPage = 1;
    this.updateUrl();
    this.loadGames();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onAddToCart(game: Game): void {
    this.cartService.addToCart({ gameId: game.id, quantity: 1 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Show success message or update UI
          console.log('Added to cart:', game.title);
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
        }
      });
  }

  onQuickView(game: Game): void {
    this.router.navigate(['/jogo', game.id]);
  }

  private updateUrl(): void {
    const queryParams: any = {};
    
    if (this.searchQuery) queryParams.search = this.searchQuery;
    if (this.selectedCategory) queryParams.category = this.selectedCategory;
    if (this.currentPage > 1) queryParams.page = this.currentPage;
    if (this.minPrice > 0) queryParams.minPrice = this.minPrice;
    if (this.maxPrice < 1000) queryParams.maxPrice = this.maxPrice;
    if (this.sortBy !== 'title') queryParams.sortBy = this.sortBy;
    if (this.sortDirection !== 'ASC') queryParams.sortDirection = this.sortDirection;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  getSortOptions(): { value: string; label: string }[] {
    return [
      { value: 'title', label: 'Nome' },
      { value: 'price', label: 'Preço' },
      { value: 'releaseDate', label: 'Data de Lançamento' },
      { value: 'createdAt', label: 'Mais Recentes' }
    ];
  }
}
