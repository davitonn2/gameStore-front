
export interface CartGame {
  carrinhoId: number;
  jogoId: number;
  quantidade: number;
  jogo?: Game;
}

export interface Cart {
  id: number;
  usuarioId: number;
  carrinhoJogos: CartGame[];
  status?: string;
}

export interface AddToCartRequest {
  gameId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantidade: number;
}

// Import types from other models
import { Game } from './game.model';
import { User } from './user.model';
