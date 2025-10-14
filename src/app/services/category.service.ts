import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CategoryCreateRequest, CategoryUpdateRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/categories`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.API_URL}/categories/${id}`);
  }

  getActiveCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/categories/active`);
  }

  // Admin methods
  createCategory(categoryData: CategoryCreateRequest): Observable<Category> {
    return this.http.post<Category>(`${this.API_URL}/admin/categories`, categoryData);
  }

  updateCategory(id: number, categoryData: CategoryUpdateRequest): Observable<Category> {
    return this.http.put<Category>(`${this.API_URL}/admin/categories/${id}`, categoryData);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/admin/categories/${id}`);
  }
}
