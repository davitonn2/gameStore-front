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
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GameCreateRequest {
  nome: string;
  descricao: string;
  valor: number;
  dataLancamento: string;
  desenvolvedor: string;
  distribuidor: string;
  categoria: string;
  so: string;
  armazenamento: string;
  processador: string;
  memoria: string;
  placaDeVideo: string;
  plataformas?: string[];
  imagens: Omit<Image, 'id' | 'gameId'>[];
  isActive?: boolean;
}

export interface GameUpdateRequest {
  nome?: string;
  descricao?: string;
  valor?: number;
  dataLancamento?: string;
  desenvolvedor?: string;
  distribuidor?: string;
  categoria?: string;
  so?: string;
  armazenamento?: string;
  processador?: string;
  memoria?: string;
  placaDeVideo?: string;
  plataformas?: string[];
  imagens?: Omit<Image, 'id' | 'gameId'>[];
  isActive?: boolean;
}
