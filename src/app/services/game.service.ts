import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game, GameCreateRequest, GameUpdateRequest } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllGames(params?: {
    page?: number;
    size?: number;
    categoryId?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
  }): Observable<{ content: Game[]; totalElements: number; totalPages: number; number: number; size: number }> {
    let httpParams = new HttpParams();
    
    if (params?.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
    if (params?.size !== undefined) httpParams = httpParams.set('size', params.size.toString());
    if (params?.categoryId) httpParams = httpParams.set('categoryId', params.categoryId.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.minPrice !== undefined) httpParams = httpParams.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    if (params?.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params?.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);

  return this.http.get<{ content: Game[]; totalElements: number; totalPages: number; number: number; size: number }>(`${this.API_URL}/jogos`, { params: httpParams });
  }

  getGameById(id: number): Observable<Game> {
  return this.http.get<Game>(`${this.API_URL}/jogos/${id}`);
  }

  getFeaturedGames(): Observable<Game[]> {
  return this.http.get<Game[]>(`${this.API_URL}/jogos/featured`);
  }

  getNewGames(): Observable<Game[]> {
  return this.http.get<Game[]>(`${this.API_URL}/jogos/new`);
  }

  getGamesOnSale(): Observable<Game[]> {
  return this.http.get<Game[]>(`${this.API_URL}/jogos/sale`);
  }

  getRelatedGames(gameId: number): Observable<Game[]> {
  return this.http.get<Game[]>(`${this.API_URL}/jogos/${gameId}/related`);
  }

  // Admin methods
  createGame(gameData: GameCreateRequest): Observable<Game> {
    return this.http.post<Game>(`${this.API_URL}/jogos`, gameData);
  }

  updateGame(id: number, gameData: GameUpdateRequest): Observable<Game> {
    return this.http.put<Game>(`${this.API_URL}/jogos/${id}`, gameData);
  }

  deleteGame(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/jogos/${id}`);
  }

  uploadGameImage(gameId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.API_URL}/jogos/${gameId}/images`, formData);
  }
}
