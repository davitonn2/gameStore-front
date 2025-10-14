export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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
