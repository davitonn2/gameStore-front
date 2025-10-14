export interface SystemRequirement {
  id: number;
  gameId: number;
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  directX: string;
  network: string;
  storage: string;
  soundCard: string;
  additionalNotes?: string;
}

export interface Image {
  id: number;
  gameId: number;
  url: string;
  altText?: string;
  isMainImage?: boolean;
}

export interface Key {
  id: number;
  gameId: number;
  keyValue: string;
  isUsed: boolean;
  usedAt?: Date;
  orderId?: number;
}

import { Category } from './category.model';

export interface Game {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  releaseDate: Date;
  developer: string;
  publisher: string;
  categoryId: number;
  category?: Category;
  systemRequirements: SystemRequirement[];
  images: Image[];
  keys: Key[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameCreateRequest {
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  releaseDate: Date;
  developer: string;
  publisher: string;
  categoryId: number;
  systemRequirements: Omit<SystemRequirement, 'id' | 'gameId'>[];
  images: Omit<Image, 'id' | 'gameId'>[];
  keys: Omit<Key, 'id' | 'gameId'>[];
}

export interface GameUpdateRequest {
  title?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  releaseDate?: Date;
  developer?: string;
  publisher?: string;
  categoryId?: number;
  isActive?: boolean;
}
