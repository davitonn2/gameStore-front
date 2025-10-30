export interface User {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  role: string; // 'USER' | 'ADMIN'
  datacriacao?: string;
  updatedAt?: string;
}

export interface UserCreateRequest {
  cpf: string;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  role: string;
}

export interface UserUpdateRequest {
  nome?: string;
  email?: string;
  senha?: string;
  telefone?: string;
}

export interface LoginRequest {
  email: string;
  senha: string; 
}

export interface LoginResponse {
  token: string;
  user: User;
}
