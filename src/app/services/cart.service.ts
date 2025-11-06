
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartGame, AddToCartRequest, UpdateCartItemRequest, Game } from '../models';
import { GameService } from './game.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly STORAGE_KEY = 'gameStoreCart';
  private cartSubject = new BehaviorSubject<Cart | null>(this.loadCartFromStorage());
  public cart$ = this.cartSubject.asObservable();

  constructor(private gameService: GameService) { }



  getCart(): Observable<Cart> {
    let cart = this.loadCartFromStorage();
    if (!cart) {
      cart = {
        id: Date.now(),
        usuarioId: 1,
        carrinhoJogos: [],
        status: 'ATIVO'
      };
      this.saveCartToStorage(cart);
    }
    this.cartSubject.next(cart);
    return this.cartSubject.asObservable() as Observable<Cart>;
  }


  addToCart(request: AddToCartRequest & { game?: Game }): Observable<Cart> {
    let cart: Cart = this.loadCartFromStorage() ?? {
      id: Date.now(),
      usuarioId: 1,
      carrinhoJogos: [],
      status: 'ATIVO'
    };
    const existing = cart.carrinhoJogos.find(item => item.jogoId === request.gameId);

    const finalize = (gameObj?: Game) => {
      if (existing) {
        existing.quantidade += request.quantity;
        if (gameObj) existing.jogo = gameObj;
      } else {
        cart.carrinhoJogos.push({
          carrinhoId: cart.id,
          jogoId: request.gameId,
          quantidade: request.quantity,
          jogo: gameObj // Salva o objeto jogo completo (pode ser undefined if fetch failed)
        });
      }
      this.saveCartToStorage(cart);
      this.cartSubject.next(cart);
    };

    // If caller provided the full game, use it immediately
    if (request.game) {
      finalize(request.game);
      return this.cartSubject.asObservable() as Observable<Cart>;
    }

    // Otherwise try to fetch the game from API, but fall back to storing without jogo if fetch fails
    this.gameService.getGameById(request.gameId).pipe(first()).subscribe({
      next: (game) => finalize(game),
      error: () => finalize(undefined)
    });

    return this.cartSubject.asObservable() as Observable<Cart>;
  }


  updateCartItem(jogoId: number, request: UpdateCartItemRequest): Observable<Cart> {
    let cart: Cart = this.loadCartFromStorage() ?? {
      id: Date.now(),
      usuarioId: 1,
      carrinhoJogos: [],
      status: 'ATIVO'
    };
    const item = cart.carrinhoJogos.find(i => i.jogoId === jogoId);
    if (item) {
      item.quantidade = request.quantidade;
      if (item.quantidade <= 0) {
        cart.carrinhoJogos = cart.carrinhoJogos.filter(i => i.jogoId !== jogoId);
      }
      this.saveCartToStorage(cart);
      this.cartSubject.next(cart);
    }
    return this.cartSubject.asObservable() as Observable<Cart>;
  }


  removeFromCart(jogoId: number): Observable<Cart> {
    let cart: Cart = this.loadCartFromStorage() ?? {
      id: Date.now(),
      usuarioId: 1,
      carrinhoJogos: [],
      status: 'ATIVO'
    };
    cart.carrinhoJogos = cart.carrinhoJogos.filter(i => i.jogoId !== jogoId);
    this.saveCartToStorage(cart);
    this.cartSubject.next(cart);
    return this.cartSubject.asObservable() as Observable<Cart>;
  }


  clearCart(): Observable<void> {
    localStorage.removeItem(this.STORAGE_KEY);
    this.cartSubject.next(null);
    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }
  private loadCartFromStorage(): Cart | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  private saveCartToStorage(cart: Cart) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
  }


  getCartItemCount(): number {
    const cart = this.cartSubject.value;
    return cart?.carrinhoJogos?.reduce((total, item) => total + item.quantidade, 0) || 0;
  }

  getCartTotal(): number {
    const cart = this.cartSubject.value;
    return cart?.carrinhoJogos?.reduce((total, item) => {
      const game = item.jogo;
      const price = game?.valor || 0;
      return total + (price * item.quantidade);
    }, 0) || 0;
  }

  getCurrentCart(): Cart | null {
    return this.cartSubject.value;
  }
}
