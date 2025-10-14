export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  password?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
