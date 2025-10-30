import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Game } from '../../../models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() game!: Game;
  @Input() showAddToCart = true;
  @Input() cardSize: 'small' | 'medium' | 'large' = 'medium';
  @Output() addToCart = new EventEmitter<Game>();
  @Output() quickView = new EventEmitter<Game>();

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(this.game);
  }

  onQuickView(event: Event): void {
    event.stopPropagation();
    this.quickView.emit(this.game);
  }

  getMainImage(): string {
    const mainImage = this.game.imagens?.find((img: any) => img.isMainImage);
    return mainImage?.url || this.game.imagens?.[0]?.url || 'assets/images/placeholder-game.jpg';
  }

  getCurrentPrice(): number {
    return this.game.valor || 0;
  }

  getDescricaoSlice(): string {
    return (this.game.descricao || '').slice(0, 120);
  }

  getDescricaoLength(): number {
    return (this.game.descricao || '').length;
  }

  formatDataLancamento(): string {
    if (!this.game.dataLancamento) return '';
    const date = new Date(this.game.dataLancamento);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }
}
