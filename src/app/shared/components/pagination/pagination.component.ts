import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() totalElements = 0;
  @Input() pageSize = 10;
  @Input() showInfo = true;
  @Input() maxVisiblePages = 5;
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalElements);
  }

  get pages(): number[] {
    const pages: number[] = [];
    const halfVisible = Math.floor(this.maxVisiblePages / 2);
    
    let startPage = Math.max(1, this.currentPage - halfVisible);
    let endPage = Math.min(this.totalPages, startPage + this.maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < this.maxVisiblePages) {
      startPage = Math.max(1, endPage - this.maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  goToPrevious(): void {
    if (this.canGoPrevious) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNext(): void {
    if (this.canGoNext) {
      this.goToPage(this.currentPage + 1);
    }
  }

  goToFirst(): void {
    this.goToPage(1);
  }

  goToLast(): void {
    this.goToPage(this.totalPages);
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newSize = +target.value;
    this.pageSizeChange.emit(newSize);
  }

  getPageSizeOptions(): number[] {
    return [10, 20, 50, 100];
  }
}
