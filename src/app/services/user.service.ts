import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserUpdateRequest } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/profile`);
  }

  updateProfile(userData: UserUpdateRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/users/profile`, userData);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/users/change-password`, {
      currentPassword,
      newPassword
    });
  }

  deleteAccount(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/users/profile`);
  }

  // Admin methods
  getAllUsers(params?: {
    page?: number;
    size?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
  }): Observable<{ content: User[]; totalElements: number; totalPages: number; number: number; size: number }> {
    let httpParams = new HttpParams();
    
    if (params?.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
    if (params?.size !== undefined) httpParams = httpParams.set('size', params.size.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.role) httpParams = httpParams.set('role', params.role);
    if (params?.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params?.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);

  return this.http.get<{ content: User[]; totalElements: number; totalPages: number; number: number; size: number }>(`${this.API_URL}/usuarios`, { params: httpParams });
  }

  getUserCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/usuarios/count`);
  }

  getUserById(id: number): Observable<User> {
  return this.http.get<User>(`${this.API_URL}/usuarios/${id}`);
  }

  updateUser(id: number, userData: UserUpdateRequest): Observable<User> {
  return this.http.put<User>(`${this.API_URL}/usuarios/${id}`, userData);
  }

  deleteUser(id: number): Observable<void> {
  return this.http.delete<void>(`${this.API_URL}/usuarios/${id}`);
  }
}
