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
  nome: string; // title
  valor: number; // price
  descricao: string; // description
  dataLancamento: string; // releaseDate (ISO string)
  desenvolvedor: string; // developer
  distribuidor: string; // publisher
  categoria: string; // categoria principal
  categorias?: Category[]; // lista de categorias
  so: string; // sistema operacional
  armazenamento: string;
  processador: string;
  memoria: string;
  placaDeVideo: string;
  plataformas?: string[]; // ex: ['PC', 'PS5']
  imagens?: Image[];
  chaves?: Key[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
