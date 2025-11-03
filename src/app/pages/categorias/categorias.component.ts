import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category, CategoryCreateRequest } from '../../models/category.model';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="list-admin-container">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="text-center mb-4">
              <h2 class="fw-bold">
                <i class="fas fa-tags text-primary me-2"></i>
                Listar Categorias
              </h2>
              <p class="text-muted">Veja todas as categorias cadastradas na plataforma</p>
            </div>
            <div class="card p-4 shadow-sm mb-4" style="background: linear-gradient(135deg, #e2e6ea 0%, #bfc8d1 100%); border-radius: 18px;">
              <div class="row justify-content-center mb-4">
                <div class="col-12">
                  <div class="d-flex" style="width: 100%;">
                    <div class="input-group" style="width: 100%;">
                      <span class="input-group-text d-flex align-items-center" style="height: 48px; min-width: 56px; padding: 0 18px; font-size: 1.3rem; background: linear-gradient(135deg, #6a82fb 0%, #5f6caf 100%); color: #fff; border: none; box-shadow: none;">
                        <i class="fas fa-search"></i>
                      </span>
                      <input type="text" [(ngModel)]="busca" placeholder="Buscar categoria..." class="form-control" style="border-radius: 0 8px 8px 0; height: 48px; font-size: 1.1rem; border: none; box-shadow: none; background: #3c4251; color: #222; margin-left: -1px;" />
                      <div style="width: 16px;"></div>
                      <button (click)="carregarCategorias()" class="btn btn-primary" style="border-radius: 8px; font-weight: 500; height: 48px; min-width: 120px; font-size: 1.1rem;">
                        Buscar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <form (ngSubmit)="adicionarCategoria()" #catForm="ngForm" class="mb-3">
                <div class="mb-2">
                  <label>Nome:</label>
                  <input type="text" class="form-control" [(ngModel)]="novaCategoria.nome" name="nome" required />
                </div>
                <button class="btn btn-success" type="submit" [disabled]="carregando">Adicionar</button>
                <span *ngIf="sucesso" class="text-success ms-2">Categoria adicionada!</span>
                <span *ngIf="erro" class="text-danger ms-2">{{ erro }}</span>
              </form>
              <table class="table table-hover" style="border-radius: 16px; overflow: hidden; background: #dee2e6;">
                <thead style="background: #343a40; color: #fff;">
                  <tr>
                    <th class="align-middle"><i class="fas fa-hashtag"></i> ID</th>
                    <th class="align-middle"><i class="fas fa-tag"></i> Nome</th>
                    <th class="align-middle"><i class="fas fa-trash"></i> Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let cat of categorias">
                    <td class="align-middle">{{ cat.id }}</td>
                    <td class="align-middle">{{ cat.nome }}</td>
                    <td class="align-middle">
                      <button class="btn btn-danger btn-sm" (click)="excluirCategoria(cat.id)" [disabled]="carregando">
                        <i class="fas fa-trash"></i> Excluir
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div *ngIf="carregando" class="text-center py-3">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Carregando...</span>
                </div>
              </div>
              <div *ngIf="erro" class="alert alert-danger mt-3">
                <i class="fas fa-exclamation-triangle me-2"></i>{{ erro }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CategoriasComponent {
  categorias: Category[] = [];
  novaCategoria: CategoryCreateRequest = { nome: '' };
  busca: string = '';
  carregando = false;
  sucesso = false;
  erro = '';

  constructor(private categoriaService: CategoryService) {
    this.carregarCategorias();
  }

  carregarCategorias() {
    this.carregando = true;
    this.erro = '';
    this.categoriaService.getAllCategories().subscribe({
      next: cats => {
        let categorias = cats;
        if (this.busca && this.busca.trim() !== '') {
          const termo = this.busca.trim().toLowerCase();
          categorias = categorias.filter(cat =>
            cat.nome.toLowerCase().includes(termo)
          );
        }
        this.categorias = categorias;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar categorias';
        this.carregando = false;
      }
    });
  }

  adicionarCategoria() {
    this.carregando = true;
    this.sucesso = false;
    this.erro = '';
    this.categoriaService.createCategory(this.novaCategoria).subscribe({
      next: () => {
        this.sucesso = true;
        this.novaCategoria = { nome: '' };
        this.carregarCategorias();
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao adicionar categoria';
        this.carregando = false;
      }
    });
  }

  excluirCategoria(id: number) {
    this.carregando = true;
    this.categoriaService.deleteCategory(id).subscribe({
      next: () => {
        this.carregarCategorias();
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao excluir categoria';
        this.carregando = false;
      }
    });
  }
}