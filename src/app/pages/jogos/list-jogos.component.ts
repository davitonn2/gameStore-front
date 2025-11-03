import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game.model';

@Component({
  selector: 'app-list-jogos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="list-jogos-container">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="text-center mb-4">
              <h2 class="fw-bold">
                <i class="fas fa-gamepad text-primary me-2"></i>
                Listar Jogos
              </h2>
              <p class="text-muted">Veja todos os jogos cadastrados na plataforma</p>
            </div>
            <div class="card p-4 shadow-sm mb-4" style="background: linear-gradient(135deg, #e2e6ea 0%, #bfc8d1 100%); border-radius: 18px;">
              <div class="row justify-content-center mb-4">
                <div class="col-12">
                  <div class="d-flex" style="width: 100%;">
                    <div class="input-group" style="width: 100%;">
                      <span class="input-group-text d-flex align-items-center" style="height: 48px; min-width: 56px; padding: 0 18px; font-size: 1.3rem; background: linear-gradient(135deg, #6a82fb 0%, #5f6caf 100%); color: #fff; border: none; box-shadow: none;">
                        <i class="fas fa-search"></i>
                      </span>
                      <input type="text" [(ngModel)]="search" placeholder="Buscar jogo..." class="form-control" style="border-radius: 0 8px 8px 0; height: 48px; font-size: 1.1rem; border: none; box-shadow: none; background: #3c4251; color: #222; margin-left: -1px;" />
                      <div style="width: 16px;"></div>
                      <button (click)="loadGames()" class="btn btn-primary" style="border-radius: 8px; font-weight: 500; height: 48px; min-width: 120px; font-size: 1.1rem;">
                        Buscar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <table class="table table-hover" style="border-radius: 16px; overflow: hidden; background: #dee2e6;">
                <thead style="background: #343a40; color: #fff;">
                  <tr>
                    <th class="align-middle"><i class="fas fa-hashtag"></i> ID</th>
                    <th class="align-middle"><i class="fas fa-gamepad"></i> Nome</th>
                    <th class="align-middle"><i class="fas fa-tags"></i> Categoria</th>
                    <th class="align-middle"><i class="fas fa-dollar-sign"></i> Preço</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let game of games">
                    <td class="align-middle">{{ game.id }}</td>
                    <td class="align-middle">{{ game.nome }}</td>
                    <td class="align-middle">{{ game.categoria }}</td>
                    <td class="align-middle">R$ {{ game.valor | number:'1.2-2' }}</td>
                  </tr>
                </tbody>
              </table>
              <div *ngIf="loading" class="text-center py-3">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Carregando...</span>
                </div>
              </div>
              <div *ngIf="error" class="alert alert-danger mt-3">
                <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ListJogosComponent implements OnInit {
  games: Game[] = [];
  search: string = '';
  loading = false;
  error = '';

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.loadGames();
  }

  loadGames() {
    this.loading = true;
    this.error = '';
    this.gameService.getAllGames({ search: this.search, page: 0, size: 20 })
      .subscribe({
        next: res => {
          let games = res.content;
          if (this.search && this.search.trim() !== '') {
            const termo = this.search.trim().toLowerCase();
            games = games.filter(game =>
              game.nome.toLowerCase().includes(termo) ||
              (game.categoria && game.categoria.toLowerCase().includes(termo))
            );
          }
          this.games = games;
          this.loading = false;
        },
        error: err => {
          this.error = 'Erro ao carregar jogos.';
          this.loading = false;
        }
      });
  }
}