import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services';
import { GameService } from '../../services/game.service';
import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';
import { CategoryService } from '../../services/category.service';
import { CartGame } from '../../models/cart.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  totalGames: number = 0;
  totalUsers: number = 0; // total registered users
  activeUsers: number = 0; // users with role USER
  totalOrders: number = 0;
  totalRevenue: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private gameService: GameService,
    private userService: UserService,
    private orderService: OrderService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated() || !this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    this.loadStats();
  }

  loadStats(): void {
    this.gameService.getAllGames({ page: 0, size: 1 }).subscribe(res => {
      this.totalGames = res.totalElements;
    });
    // Total registered users (use dedicated count endpoint)
    this.userService.getUserCount().subscribe(count => {
      this.totalUsers = count;
    }, (err) => {
      console.error('getUserCount failed, falling back to getAllUsers()', err);
      // fallback: if count endpoint fails, try pageable call or handle array response
      this.userService.getAllUsers({ page: 0, size: 1 }).subscribe((res: any) => {
        // res can be either a paged response { totalElements } or a plain array of users
        if (res && typeof res.totalElements === 'number') {
          this.totalUsers = res.totalElements;
        } else if (Array.isArray(res)) {
          this.totalUsers = res.length;
        } else {
          // defensive: try to read totalElements anyway or set 0
          this.totalUsers = (res && res.totalElements) ? res.totalElements : 0;
        }
      }, (err2) => {
        console.error('Fallback getAllUsers also failed', err2);
        this.totalUsers = 0;
      });
    });

    // Active users (only role = 'USER')
    this.userService.getAllUsers({ page: 0, size: 1, role: 'USER' }).subscribe(res => {
      this.activeUsers = res.totalElements;
    });
    // Fetch a larger page (or adjust server-side) to compute revenue client-side.
    // If you have many orders consider providing an aggregation endpoint on the backend.
    this.orderService.getAllOrders({ page: 0, size: 1000 }).subscribe(res => {
      // Support paged response or plain array
      let orders: any[] = [];
      if (!res) {
        orders = [];
      } else if (Array.isArray(res)) {
        orders = res as any[];
      } else if (res.content && Array.isArray(res.content)) {
        orders = res.content;
      }

      // Normalize status and filter only approved orders
      const approvedOrders = orders.filter((order: any) => {
        const s = (order && (order.status || order.data?.status || order.statuS || order.state)) || '';
        return String(s).toUpperCase() === 'APROVADO' || String(s).toUpperCase() === 'APPROVED';
      });

      // Total orders = only approved ones
      this.totalOrders = approvedOrders.length;

      // Sum revenue from approved orders only
      this.totalRevenue = approvedOrders.reduce((sum: number, order: any) => {
        const items = (order as any)?.carrinho?.carrinhoJogos ?? (order as any)?.carrinho?.cartGames ?? (order as any)?.itens ?? [];
        if (!Array.isArray(items)) return sum;
        const orderTotal = items.reduce((s: number, it: any) => {
          if (!it) return s;
          if (it.jogo && (it.quantidade !== undefined)) return s + ((it.jogo?.valor ?? it.jogo?.price ?? 0) * it.quantidade);
          if (it.game && (it.quantity !== undefined)) return s + ((it.game?.valor ?? it.game?.price ?? 0) * it.quantity);
          const valor = it.valor ?? it.price ?? 0;
          const quantidade = it.quantidade ?? it.quantity ?? 0;
          return s + (valor * quantidade);
        }, 0);
        return sum + orderTotal;
      }, 0);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Navegação dos botões
  goToAddGame() { this.router.navigate(['/admin/jogos/adicionar']); }
  goToListGames() { this.router.navigate(['/admin/jogos']); }
  goToManageCategories() { this.router.navigate(['/admin/categorias']); }
  goToListUsers() { this.router.navigate(['/admin/usuarios']); }
  goToOrders() { this.router.navigate(['/admin/pedidos']); }
  goToReports() { this.router.navigate(['/admin/relatorios']); }
  goToPayments() { this.router.navigate(['/admin/pagamentos']); }
}
