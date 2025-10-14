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
    const mainImage = this.game.images?.find(img => img.isMainImage);
    return mainImage?.url || this.game.images?.[0]?.url || 'assets/images/placeholder-game.jpg';
  }

  getCurrentPrice(): number {
    return this.game.discountPrice || this.game.price;
  }

  hasDiscount(): boolean {
    return !!this.game.discountPrice && this.game.discountPrice < this.game.price;
  }

  getDiscountPercentage(): number {
    if (!this.hasDiscount()) return 0;
    return Math.round(((this.game.price - this.game.discountPrice!) / this.game.price) * 100);
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
