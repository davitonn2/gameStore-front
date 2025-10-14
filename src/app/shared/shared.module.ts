import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { AlertMessageComponent } from './components/alert-message/alert-message.component';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
    LoadingSpinnerComponent,
    AlertMessageComponent,
    PaginationComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
    LoadingSpinnerComponent,
    AlertMessageComponent,
    PaginationComponent
  ]
})
export class SharedModule { }
