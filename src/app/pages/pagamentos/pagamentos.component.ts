import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-pagamentos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Pagamentos</h2>
    <!--
    <div *ngIf="loading">Carregando...</div>
    <div *ngIf="error" class="text-danger">{{ error }}</div>
    <table class="table" *ngIf="!loading && !error">
      <thead>
        <tr>
          <th>ID</th>
          <th>Pedido</th>
          <th>Valor</th>
          <th>Status</th>
          <th>Método</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let payment of payments">
          <td>{{ payment.id }}</td>
          <td>{{ payment.orderId }}</td>
          <td>R$ {{ payment.amount | number:'1.2-2' }}</td>
          <td>{{ payment.status }}</td>
          <td>{{ payment.paymentMethod }}</td>
        </tr>
      </tbody>
    </table>
    -->
    <div class="alert alert-info mt-3">Funcionalidade de pagamentos será implementada em breve.</div>
  `
})
export class PagamentosComponent {
  // payments: any[] = [];
  // loading = false;
  // error = '';

  // constructor(private paymentService: PaymentService) {}

  // ngOnInit() {
  //   this.loadPayments();
  // }

  // loadPayments() {
  //   this.loading = true;
  //   // Supondo que existe endpoint /payments para listar todos
  //   this.paymentService.getAllPayments?.().subscribe({
  //     next: (res: any) => {
  //       this.payments = res.content || res;
  //       this.loading = false;
  //     },
  //     error: () => {
  //       this.error = 'Erro ao carregar pagamentos';
  //       this.loading = false;
  //     }
  //   });
  // }
}