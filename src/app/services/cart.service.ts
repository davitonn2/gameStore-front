import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart, CartGame, AddToCartRequest, UpdateCartItemRequest } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly API_URL = environment.apiUrl;
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.API_URL}/cart`).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  addToCart(request: AddToCartRequest): Observable<Cart> {
    return this.http.post<Cart>(`${this.API_URL}/cart/items`, request).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  updateCartItem(cartGameId: number, request: UpdateCartItemRequest): Observable<Cart> {
    return this.http.put<Cart>(`${this.API_URL}/cart/items/${cartGameId}`, request).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  removeFromCart(cartGameId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.API_URL}/cart/items/${cartGameId}`).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/cart`).pipe(
      tap(() => this.cartSubject.next(null))
    );
  }

  getCartItemCount(): number {
    const cart = this.cartSubject.value;
    return cart?.cartGames?.reduce((total, item) => total + item.quantity, 0) || 0;
  }

  getCartTotal(): number {
    const cart = this.cartSubject.value;
    return cart?.cartGames?.reduce((total, item) => {
      const game = item.game;
  const price = game?.valor || 0;
  return total + (price * item.quantity);
    }, 0) || 0;
  }

  getCurrentCart(): Cart | null {
    return this.cartSubject.value;
  }
}
