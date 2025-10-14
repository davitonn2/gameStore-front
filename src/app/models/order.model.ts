export interface OrderGame {
  id: number;
  orderId: number;
  gameId: number;
  game?: Game;
  quantity: number;
  price: number;
  key?: Key;
}

export interface Order {
  id: number;
  userId: number;
  user?: User;
  orderGames: OrderGame[];
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  shippingAddress?: string;
  createdAt: Date;
  updatedAt: Date;
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
  paymentStatus: Order['paymentStatus'];
}

// Import types from other models
import { Game } from './game.model';
import { User } from './user.model';
import { Key } from './game.model';
