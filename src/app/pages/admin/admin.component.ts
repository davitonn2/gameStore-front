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
    }, () => {
      // fallback: if count endpoint fails, try pageable call
      this.userService.getAllUsers({ page: 0, size: 1 }).subscribe(res => {
        this.totalUsers = res.totalElements;
      });
    });

    // Active users (only role = 'USER')
    this.userService.getAllUsers({ page: 0, size: 1, role: 'USER' }).subscribe(res => {
      this.activeUsers = res.totalElements;
    });
    // Fetch a larger page (or adjust server-side) to compute revenue client-side.
    // If you have many orders consider providing an aggregation endpoint on the backend.
    this.orderService.getAllOrders({ page: 0, size: 1000 }).subscribe(res => {
      this.totalOrders = res.totalElements;
      // Corrige receita total somando os valores dos jogos em cada pedido
      this.totalRevenue = res.content.reduce((sum, order) => {
        if (order.carrinho && order.carrinho.carrinhoJogos) {
          return sum + order.carrinho.carrinhoJogos.reduce((subSum: number, cartGame: CartGame) => {
            const price = cartGame.jogo?.valor || 0;
            return subSum + (price * cartGame.quantidade);
          }, 0);
        }
        return sum;
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
