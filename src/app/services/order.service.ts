import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest, OrderStatusUpdateRequest, PaymentStatusUpdateRequest } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createOrder(orderData: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.API_URL}/pedidos`, orderData);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/pedidos/${id}`);
  }

  getUserOrders(params?: {
    page?: number;
    size?: number;
    status?: string;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
  }): Observable<{ content: Order[]; totalElements: number; totalPages: number; number: number; size: number }> {
    let httpParams = new HttpParams();
    
    if (params?.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
    if (params?.size !== undefined) httpParams = httpParams.set('size', params.size.toString());
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params?.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);

  return this.http.get<{ content: Order[]; totalElements: number; totalPages: number; number: number; size: number }>(`${this.API_URL}/pedidos`, { params: httpParams });
  }

  // Admin methods
  getAllOrders(params?: {
    page?: number;
    size?: number;
    status?: string;
    paymentStatus?: string;
    userId?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
  }): Observable<{ content: Order[]; totalElements: number; totalPages: number; number: number; size: number }> {
    let httpParams = new HttpParams();
    
    if (params?.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
    if (params?.size !== undefined) httpParams = httpParams.set('size', params.size.toString());
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.paymentStatus) httpParams = httpParams.set('paymentStatus', params.paymentStatus);
    if (params?.userId) httpParams = httpParams.set('userId', params.userId.toString());
    if (params?.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params?.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);

    return this.http.get<{ content: Order[]; totalElements: number; totalPages: number; number: number; size: number }>(`${this.API_URL}/admin/orders`, { params: httpParams });
  }

  updateOrderStatus(id: number, statusData: OrderStatusUpdateRequest): Observable<Order> {
    return this.http.put<Order>(`${this.API_URL}/admin/orders/${id}/status`, statusData);
  }

  updatePaymentStatus(id: number, paymentStatusData: PaymentStatusUpdateRequest): Observable<Order> {
    return this.http.put<Order>(`${this.API_URL}/admin/orders/${id}/payment-status`, paymentStatusData);
  }
}
