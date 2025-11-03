export interface OrderGame {
  id: number;
  orderId: number;
  gameId: number;
  game?: Game;
  quantity: number;
  valor: number;
  key?: Key;
}

export interface Order {
  id: number;
  usuario: User;
  carrinho: any;
  dataPedido: string;
  status: string;
}

export interface CreateOrderRequest {
  cartId: number;
  paymentMethod: string;
  shippingAddress?: string;
}

export interface OrderStatusUpdateRequest {
  status: Order['status'];
}

export interface PaymentStatusUpdateRequest {
  // Removido: campo inexistente no model Order
}

// Import types from other models
import { Game } from './game.model';
import { User } from './user.model';
import { Key } from './game.model';
