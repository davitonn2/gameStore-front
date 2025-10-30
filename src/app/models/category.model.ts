export interface Category {
  id: number;
  nome: string;
}

export interface CategoryCreateRequest {
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface CategoryUpdateRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}
