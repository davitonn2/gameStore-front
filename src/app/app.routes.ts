import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./pages/catalog/catalog.component').then(m => m.CatalogComponent)
  },
  {
    path: 'jogo/:id',
    loadComponent: () => import('./pages/game-details/game-details.component').then(m => m.GameDetailsComponent)
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'pagamento',
    loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: 'admin/jogos/adicionar',
    loadComponent: () => import('./pages/jogos/add-jogo.component').then(m => m.AddJogoComponent)
  },
  {
    path: 'admin/jogos',
    loadComponent: () => import('./pages/jogos/list-jogos.component').then(m => m.ListJogosComponent)
  },
  {
    path: 'admin/categorias',
    loadComponent: () => import('./pages/categorias/categorias.component').then(m => m.CategoriasComponent)
  },
  {
    path: 'admin/usuarios',
    loadComponent: () => import('./pages/usuarios/list-usuarios.component').then(m => m.ListUsuariosComponent)
  },
  {
    path: 'admin/pedidos',
    loadComponent: () => import('./pages/pedidos/pedidos.component').then(m => m.PedidosComponent)
  },
  {
    path: 'admin/relatorios',
    loadComponent: () => import('./pages/relatorios/relatorios.component').then(m => m.RelatoriosComponent)
  },
  {
    path: 'admin/pagamentos',
    loadComponent: () => import('./pages/pagamentos/pagamentos.component').then(m => m.PagamentosComponent)
  },
  {
    path: 'sobre',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'contato',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
