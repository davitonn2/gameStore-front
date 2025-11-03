import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CategoryCreateRequest, CategoryUpdateRequest } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
  return this.http.get<Category[]>(`${this.API_URL}/categorias`);
  }

  getCategoryById(id: number): Observable<Category> {
  return this.http.get<Category>(`${this.API_URL}/categorias/${id}`);
  }

  getActiveCategories(): Observable<Category[]> {
  return this.http.get<Category[]>(`${this.API_URL}/categorias/active`);
  }

  // Admin methods
  createCategory(categoryData: CategoryCreateRequest): Observable<Category> {
  return this.http.post<Category>(`${this.API_URL}/admin/categorias`, categoryData);
  }

  updateCategory(id: number, categoryData: CategoryUpdateRequest): Observable<Category> {
  return this.http.put<Category>(`${this.API_URL}/admin/categorias/${id}`, categoryData);
  }

  deleteCategory(id: number): Observable<void> {
  return this.http.delete<void>(`${this.API_URL}/admin/categorias/${id}`);
  }
}
