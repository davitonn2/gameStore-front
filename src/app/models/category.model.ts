export interface Category {
  id: number;
  nome: string;
}

export interface CategoryCreateRequest {
  nome: string;
  descricao?: string;
  imagemUrl?: string;
}

export interface CategoryUpdateRequest {
  nome?: string;
  descricao?: string;
  imagemUrl?: string;
  isActive?: boolean;
}
