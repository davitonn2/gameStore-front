import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="list-admin-container">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="text-center mb-4">
              <h2 class="fw-bold">
                <i class="fas fa-chart-line text-primary me-2"></i>
                Listar Relatórios
              </h2>
              <p class="text-muted">Veja todos os relatórios cadastrados na plataforma</p>
            </div>
            <div class="card p-4 shadow-sm mb-4" style="background: linear-gradient(135deg, #e2e6ea 0%, #bfc8d1 100%); border-radius: 18px;">
              <div class="row justify-content-center mb-4">
                <div class="col-12">
                  <div class="d-flex" style="width: 100%;">
                    <div class="input-group" style="width: 100%;">
                      <span class="input-group-text d-flex align-items-center" style="height: 48px; min-width: 56px; padding: 0 18px; font-size: 1.3rem; background: linear-gradient(135deg, #6a82fb 0%, #5f6caf 100%); color: #fff; border: none; box-shadow: none;">
                        <i class="fas fa-search"></i>
                      </span>
                      <input type="text" [(ngModel)]="busca" placeholder="Buscar relatório..." class="form-control" style="border-radius: 0 8px 8px 0; height: 48px; font-size: 1.1rem; border: none; box-shadow: none; background: #3c4251; color: #222; margin-left: -1px;" />
                      <div style="width: 16px;"></div>
                      <button (click)="carregarRelatorios()" class="btn btn-primary" style="border-radius: 8px; font-weight: 500; height: 48px; min-width: 120px; font-size: 1.1rem;">
                        Buscar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <table class="table table-hover" style="border-radius: 16px; overflow: hidden; background: #dee2e6;">
                <thead style="background: #343a40; color: #fff;">
                  <tr>
                    <th class="align-middle"><i class="fas fa-file-alt"></i> Título</th>
                    <th class="align-middle"><i class="fas fa-info-circle"></i> Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let rel of relatorios">
                    <td class="align-middle">{{ rel.titulo }}</td>
                    <td class="align-middle">{{ rel.status }}</td>
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
    <div *ngIf="carregando">Carregando...</div>
    <div *ngIf="erro" class="text-danger">{{ erro }}</div>
  `
})
export class RelatoriosComponent implements OnInit {
  relatorios: any[] = [];
  busca: string = '';
  carregando = false;
  erro = '';

  constructor(private pedidoService: OrderService) {}

  ngOnInit() {
    this.carregarRelatorios();
  }

  carregarRelatorios() {
    this.carregando = true;
    this.erro = '';
    // Simulação: buscar "relatórios" usando pedidos como base
    this.pedidoService.getAllOrders({ page: 0, size: 100 }).subscribe({
      next: res => {
        let relatorios = res.content.map((ped: any) => ({
          titulo: `Pedido #${ped.id}`,
          status: ped.status
        }));
        if (this.busca && this.busca.trim() !== '') {
          const termo = this.busca.trim().toLowerCase();
          relatorios = relatorios.filter((rel: any) =>
            rel.titulo.toLowerCase().includes(termo) ||
            (rel.status && rel.status.toLowerCase().includes(termo))
          );
        }
        this.relatorios = relatorios;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar relatórios';
        this.carregando = false;
      }
    });
  }
}