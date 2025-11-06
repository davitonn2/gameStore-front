import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { CategoryService } from '../../services/category.service';
import { GameCreateRequest } from '../../models/game.model';

@Component({
  selector: 'app-add-jogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="list-admin-container">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="text-center mb-4">
              <h2 class="fw-bold">
                <i class="fas fa-plus-circle text-success me-2"></i>
                Adicionar Jogo
              </h2>
              <p class="text-muted">Preencha os dados para cadastrar um novo jogo</p>
            </div>
            <div class="card p-4 shadow-sm mb-4" style="background: linear-gradient(135deg, #e2e6ea 0%, #bfc8d1 100%); border-radius: 18px;">
              <form (ngSubmit)="addGame()" #gameForm="ngForm">
                <div class="mb-3">
                  <label class="form-label fw-bold"><i class="fas fa-gamepad me-2"></i>Nome:</label>
                  <input type="text" class="form-control" [(ngModel)]="game.nome" name="nome" required style="border-radius: 8px;" />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold"><i class="fas fa-list me-2"></i>Categorias:</label>
                  <select class="form-select" [(ngModel)]="categoriasSelecionadas" name="categorias" multiple style="border-radius: 8px;">
                    <option *ngFor="let cat of categories" [value]="cat.nome">{{ cat.nome }}</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold"><i class="fas fa-laptop me-2"></i>Plataformas:</label>
                  <div *ngFor="let plat of plataformas; let p = index; trackBy: trackByIndex" class="input-group mb-2">
                    <input type="text" class="form-control" [(ngModel)]="plataformas[p]" [name]="'plataforma' + p" placeholder="Ex: PC, PS5, Xbox" style="border-radius: 8px;" />
                    <button type="button" class="btn btn-danger" (click)="removerPlataforma(p)"><i class="fas fa-trash"></i></button>
                  </div>
                  <button type="button" class="btn btn-secondary" (click)="adicionarPlataforma()"><i class="fas fa-plus"></i> Adicionar Plataforma</button>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold"><i class="fas fa-dollar-sign me-2"></i>Preço:</label>
                  <input type="number" class="form-control" [(ngModel)]="game.valor" name="valor" required style="border-radius: 8px;" />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold"><i class="fas fa-calendar me-2"></i>Data de Lançamento:</label>
                  <input type="date" class="form-control" [(ngModel)]="game.dataLancamento" name="dataLancamento" style="border-radius: 8px;" />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold"><i class="fas fa-user-cog me-2"></i>Desenvolvedor:</label>
                  <input type="text" class="form-control" [(ngModel)]="game.desenvolvedor" name="desenvolvedor" style="border-radius: 8px;" />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold"><i class="fas fa-industry me-2"></i>Distribuidor:</label>
                  <input type="text" class="form-control" [(ngModel)]="game.distribuidor" name="distribuidor" style="border-radius: 8px;" />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold"><i class="fas fa-desktop me-2"></i>Sistema Operacional:</label>
                  <input type="text" class="form-control" [(ngModel)]="game.so" name="so" style="border-radius: 8px;" />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold"><i class="fas fa-hdd me-2"></i>Armazenamento:</label>
                  <input type="text" class="form-control" [(ngModel)]="game.armazenamento" name="armazenamento" style="border-radius: 8px;" />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold"><i class="fas fa-microchip me-2"></i>Processador:</label>
                  <input type="text" class="form-control" [(ngModel)]="game.processador" name="processador" style="border-radius: 8px;" />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold"><i class="fas fa-memory me-2"></i>Memória:</label>
                  <input type="text" class="form-control" [(ngModel)]="game.memoria" name="memoria" style="border-radius: 8px;" />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold"><i class="fas fa-video me-2"></i>Placa de Vídeo:</label>
                  <input type="text" class="form-control" [(ngModel)]="game.placaDeVideo" name="placaDeVideo" style="border-radius: 8px;" />
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold"><i class="fas fa-align-left me-2"></i>Descrição:</label>
                  <textarea class="form-control" [(ngModel)]="game.descricao" name="descricao" style="border-radius: 8px;"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-bold"><i class="fas fa-image me-2"></i>Imagens (URLs):</label>
                  <div *ngFor="let img of imagens; let i = index" class="input-group mb-2">
                    <input type="text" class="form-control" [(ngModel)]="imagens[i].url" name="imagem{{i}}" placeholder="URL da imagem" style="border-radius: 8px;" />
                    <button type="button" class="btn btn-danger" (click)="removerImagem(i)"><i class="fas fa-trash"></i></button>
                  </div>
                  <button type="button" class="btn btn-secondary" (click)="adicionarImagem()"><i class="fas fa-plus"></i> Adicionar Imagem</button>
                </div>
                <div class="d-flex align-items-center">
                  <button class="btn btn-success" type="submit" [disabled]="loading" style="border-radius: 8px; font-weight: 500; min-width: 120px; font-size: 1.1rem;">
                    <i class="fas fa-save me-2"></i>Salvar
                  </button>
                  <span *ngIf="success" class="text-success ms-3">Jogo cadastrado!</span>
                  <span *ngIf="error" class="text-danger ms-3">{{ error }}</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AddJogoComponent {
  game: GameCreateRequest = { nome: '', categoria: '', valor: 0, descricao: '', dataLancamento: '', desenvolvedor: '', distribuidor: '', so: '', armazenamento: '', processador: '', memoria: '', placaDeVideo: '', imagens: [], plataformas: [] };
  imagens: { url: string }[] = [];
  plataformas: string[] = [];
  categoriasSelecionadas: string[] = [];
  categories: any[] = [];
  loading = false;
  success = false;
  error = '';

  constructor(private gameService: GameService, private categoryService: CategoryService) {
    this.categoryService.getAllCategories().subscribe(cats => this.categories = cats);
  }

  // trackBy to keep inputs stable inside ngFor and avoid re-creation while typing
  trackByIndex(index: number, item: any) {
    return index;
  }

  adicionarImagem() {
    this.imagens.push({ url: '' });
  }
  removerImagem(index: number) {
    this.imagens.splice(index, 1);
  }
  adicionarPlataforma() {
    this.plataformas.push('');
  }
  removerPlataforma(index: number) {
    this.plataformas.splice(index, 1);
  }

  addGame() {
    this.loading = true;
    this.success = false;
    this.error = '';
    // Monta o objeto para envio
    this.game.imagens = this.imagens
      .filter(img => img.url)
      .map((img, idx) => ({
        url: img.url,
        nome: `Imagem ${idx + 1}`,
        isMainImage: idx === 0
      }));
    this.game.plataformas = this.plataformas.filter(p => p);
    // Categoria principal: primeira selecionada ou vazio
    this.game.categoria = this.categoriasSelecionadas.length > 0 ? this.categoriasSelecionadas[0] : '';
    // Envia categorias como array de objetos {id: number}
    (this.game as any).categorias = this.categories
      .filter(cat => this.categoriasSelecionadas.includes(cat.nome))
      .map(cat => ({ id: cat.id }));
    this.gameService.createGame(this.game).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
  this.game = { nome: '', categoria: '', valor: 0, descricao: '', dataLancamento: '', desenvolvedor: '', distribuidor: '', so: '', armazenamento: '', processador: '', memoria: '', placaDeVideo: '', imagens: [], plataformas: [] };
        this.imagens = [];
        this.plataformas = [];
        this.categoriasSelecionadas = [];
      },
      error: () => {
        this.error = 'Erro ao cadastrar jogo';
        this.loading = false;
      }
    });
  }
}