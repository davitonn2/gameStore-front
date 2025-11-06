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
  minValor = 0;
  maxValor = 1000;
  sortBy = 'nome';
  sortDirection: 'ASC' | 'DESC' = 'ASC';
  
  // UI State
  showFilters = false;
  viewMode: 'grid' | 'list' = 'grid';
  valorRange = { min: 0, max: 1000 };

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
        const search = params['search'] || '';
        if (search !== this.searchQuery) {
          this.searchQuery = search;
        }
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
    page: this.currentPage - 1, 
    size: this.pageSize,
    categoria: this.selectedCategory || undefined,
    search: this.searchQuery,  
    minValor: this.minValor,
    maxValor: this.maxValor,
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
  this.minValor = this.valorRange.min;
  this.maxValor = this.valorRange.max;
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
  this.minValor = 0;
  this.maxValor = 1000;
  this.valorRange = { min: 0, max: 1000 };
  this.sortBy = 'nome';
  this.sortDirection = 'ASC';
  this.currentPage = 1;
  this.updateUrl();
  this.loadGames();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  onAddToCart(game: Game): void {
    this.cartService.addToCart({ gameId: game.id, quantity: 1, game })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Added to cart:', game.nome);
          // Atualiza o carrinho visualmente
          this.cartService.getCart().subscribe();
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
  if (this.minValor > 0) queryParams.minValor = this.minValor;
  if (this.maxValor < 1000) queryParams.maxValor = this.maxValor;
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
      { value: 'nome', label: 'Nome' },
      { value: 'valor', label: 'Preço' },
      { value: 'dataLancamento', label: 'Data de Lançamento' },
      { value: 'dataCriacao', label: 'Mais Recentes' }
    ];
  }
}
