export interface PaymentRequest {
  orderId: number;
  amount: number;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BOLETO';
  cardNumber?: string;
  cardHolderName?: string;
  cardExpiryMonth?: number;
  cardExpiryYear?: number;
  cardCvv?: string;
  pixKey?: string;
}

export interface PaymentResponse {
  id: string;
  orderId: number;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  paymentMethod: string;
  transactionId?: string;
  message?: string;
  createdAt: Date;
}

export interface PaymentStatus {
  id: string;
  orderId: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  message?: string;
}
