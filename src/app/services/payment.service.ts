import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentRequest, PaymentResponse, PaymentStatus } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // TrustPay: criar intent de pagamento
  createPaymentIntent(intentData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/pagamentos/merchant/v1/payment-intents`, intentData);
  }

  // TrustPay: capturar pagamento
  capturePayment(intentId: string, payload: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/pagamentos/merchant/v1/payment-intents/${intentId}/capture`, payload);
  }

  processPayment(paymentData: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.API_URL}/payments`, paymentData);
  }

  getPaymentStatus(paymentId: string): Observable<PaymentStatus> {
    return this.http.get<PaymentStatus>(`${this.API_URL}/payments/${paymentId}/status`);
  }

  getPaymentByOrderId(orderId: number): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.API_URL}/payments/order/${orderId}`);
  }

  // Finaliza pedido no backend marcando como aprovado
  finalizeOrder(pedidoId: number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/pagamentos/finalizar/${pedidoId}`, {});
  }

  // Mock payment processing for development
  processMockPayment(paymentData: PaymentRequest): Observable<PaymentResponse> {
    // Simulate API delay
    return new Observable(observer => {
      setTimeout(() => {
        const mockResponse: PaymentResponse = {
          id: `mock_${Date.now()}`,
          orderId: paymentData.orderId,
          amount: paymentData.amount,
          status: Math.random() > 0.1 ? 'SUCCESS' : 'FAILED', // 90% success rate for mock
          paymentMethod: paymentData.paymentMethod,
          transactionId: `txn_${Date.now()}`,
          mensagem: Math.random() > 0.1 ? 'Pagamento processado com sucesso' : 'Pagamento falhou por saldo insuficiente',
          dataCriacao: new Date().toISOString()
        };
        observer.next(mockResponse);
        observer.complete();
      }, 2000);
    });
  }
}
