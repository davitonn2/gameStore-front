export interface CartGame {
  id: number;
  cartId: number;
  gameId: number;
  game?: Game;
  quantity: number;
  dataAdicao: string;
}

export interface Cart {
  id: number;
  userId: number;
  user?: User;
  cartGames: CartGame[];
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface AddToCartRequest {
  gameId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Import types from other models
import { Game } from './game.model';
import { User } from './user.model';
