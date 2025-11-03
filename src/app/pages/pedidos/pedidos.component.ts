import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
    selector: 'app-pedidos',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <h2>Pedidos</h2>
  <!-- Busca removida pois não há suporte no endpoint -->
      <div class="list-admin-container">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <div class="text-center mb-4">
                <h2 class="fw-bold">
                  <i class="fas fa-shopping-bag text-primary me-2"></i>
                  Listar Pedidos
                </h2>
                <p class="text-muted">Veja todos os pedidos cadastrados na plataforma</p>
              </div>
              <div class="card p-4 shadow-sm mb-4" style="background: linear-gradient(135deg, #e2e6ea 0%, #bfc8d1 100%); border-radius: 18px;">
                <div class="row justify-content-center mb-4">
                  <div class="col-12">
                    <div class="d-flex" style="width: 100%;">
                      <div class="input-group" style="width: 100%;">
                        <span class="input-group-text d-flex align-items-center" style="height: 48px; min-width: 56px; padding: 0 18px; font-size: 1.3rem; background: linear-gradient(135deg, #6a82fb 0%, #5f6caf 100%); color: #fff; border: none; box-shadow: none;">
                          <i class="fas fa-search"></i>
                        </span>
                        <input type="text" [(ngModel)]="busca" placeholder="Buscar pedido..." class="form-control" style="border-radius: 0 8px 8px 0; height: 48px; font-size: 1.1rem; border: none; box-shadow: none; background: #3c4251; color: #222; margin-left: -1px;" />
                        <div style="width: 16px;"></div>
                        <button (click)="carregarPedidos()" class="btn btn-primary" style="border-radius: 8px; font-weight: 500; height: 48px; min-width: 120px; font-size: 1.1rem;">
                          Buscar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <table class="table table-hover" style="border-radius: 16px; overflow: hidden; background: #dee2e6;">
                  <thead style="background: #343a40; color: #fff;">
                    <tr>
                      <th class="align-middle"><i class="fas fa-hashtag"></i> ID</th>
                      <th class="align-middle"><i class="fas fa-user"></i> Usuário</th>
                      <th class="align-middle"><i class="fas fa-info-circle"></i> Status</th>
                      <th class="align-middle"><i class="fas fa-dollar-sign"></i> Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let pedido of pedidos">
                      <td class="align-middle">{{ pedido.id }}</td>
                      <td class="align-middle">{{ pedido.usuario.nome }}</td>
                      <td class="align-middle">{{ pedido.status }}</td>
                      <td class="align-middle">R$ {{ getOrderTotal(pedido) | number:'1.2-2' }}</td>
                    </tr>
                  </tbody>
                </table>
                <div *ngIf="carregando" class="text-center py-3">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                  </div>
                </div>
                <div *ngIf="erro" class="alert alert-danger mt-3">
                  <i class="fas fa-exclamation-triangle me-2"></i>{{ erro }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  `
})
export class PedidosComponent implements OnInit {
    pedidos: Order[] = [];
    busca: string = '';
    carregando = false;
    erro = '';

    constructor(private pedidoService: OrderService) { }

    ngOnInit() {
        this.carregarPedidos();
    }

    getOrderTotal(order: Order): number {
        if (!order.carrinho || !order.carrinho.cartGames) return 0;
        return order.carrinho.cartGames.reduce((sum: number, cg: any) => sum + (cg.game?.valor || 0) * cg.quantity, 0);
    }

    carregarPedidos() {
        this.carregando = true;
        this.erro = '';
        this.pedidoService.getAllOrders().subscribe({
            next: res => {
                let pedidos = res.content; // extrai o array
                if (this.busca && this.busca.trim() !== '') {
                    const termo = this.busca.trim().toLowerCase();
                    pedidos = pedidos.filter((ped: any) =>
                        ped.id.toString().includes(termo) ||
                        (ped.status && ped.status.toLowerCase().includes(termo))
                    );
                }
                this.pedidos = pedidos;
                this.carregando = false;
            },
            error: () => {
                this.erro = 'Erro ao carregar pedidos';
                this.carregando = false;
            }
        });
    }
}