# GameStore - Loja Virtual de Jogos Digitais

Uma aplicação Angular moderna para uma loja virtual de jogos digitais, desenvolvida com foco em experiência do usuário, design responsivo e funcionalidades completas de e-commerce.

## 🚀 Funcionalidades

### Páginas Principais
- **Home**: Página inicial com jogos em destaque, novidades e promoções
- **Catálogo**: Listagem de jogos com filtros por categoria, preço e busca
- **Detalhes do Jogo**: Página completa com informações, requisitos e jogos relacionados
- **Carrinho**: Gerenciamento de itens com atualização em tempo real
- **Checkout**: Processo de pagamento com múltiplas formas de pagamento

### Autenticação
- **Login**: Sistema de autenticação com validação
- **Cadastro**: Registro de usuários com validação de senha
- **Perfil**: Área do usuário com informações e histórico

### Administração
- **Painel Admin**: Dashboard administrativo para gerenciamento da loja
- **Gerenciamento de Jogos**: CRUD completo para jogos e categorias
- **Gestão de Usuários**: Administração de usuários e permissões

### Páginas Auxiliares
- **Sobre**: Informações sobre a loja e equipe
- **Contato**: Formulário de contato e informações
- **404**: Página de erro personalizada

## 🛠️ Tecnologias Utilizadas

- **Angular 17+**: Framework principal
- **TypeScript**: Linguagem de programação
- **Bootstrap 5**: Framework CSS para responsividade
- **Font Awesome**: Ícones
- **SCSS**: Pré-processador CSS
- **RxJS**: Programação reativa

## 📁 Estrutura do Projeto

```
src/app/
├── components/          # Componentes reutilizáveis
├── pages/              # Páginas da aplicação
│   ├── home/           # Página inicial
│   ├── catalog/        # Catálogo de jogos
│   ├── game-details/   # Detalhes do jogo
│   ├── cart/           # Carrinho de compras
│   ├── checkout/       # Finalização de compra
│   ├── login/          # Login
│   ├── register/       # Cadastro
│   ├── profile/        # Perfil do usuário
│   ├── admin/          # Painel administrativo
│   ├── about/          # Sobre
│   ├── contact/        # Contato
│   └── not-found/      # Página 404
├── services/           # Serviços para comunicação com API
├── models/             # Interfaces e modelos TypeScript
├── shared/             # Componentes compartilhados
│   └── components/
│       ├── header/     # Cabeçalho
│       ├── footer/     # Rodapé
│       ├── product-card/ # Card de produto
│       ├── loading-spinner/ # Spinner de carregamento
│       ├── alert-message/ # Mensagens de alerta
│       └── pagination/ # Componente de paginação
└── assets/             # Recursos estáticos
    ├── images/         # Imagens
    └── icons/          # Ícones SVG
```

## 🎨 Design e UX

### Características do Design
- **Tema Moderno**: Cores vibrantes com gradientes
- **Responsivo**: Mobile-first design
- **Acessibilidade**: Boas práticas de acessibilidade
- **Animações**: Transições suaves e efeitos hover
- **Dark Mode**: Suporte a tema escuro

### Paleta de Cores
- **Primária**: #667eea (Azul vibrante)
- **Secundária**: #764ba2 (Roxo)
- **Sucesso**: #27ae60 (Verde)
- **Perigo**: #dc3545 (Vermelho)
- **Aviso**: #ffc107 (Amarelo)

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd game-store

# Instale as dependências
npm install

# Execute o projeto
ng serve
```

### Acesse a aplicação
Abra seu navegador e acesse: `http://localhost:4200`

## 📱 Funcionalidades Responsivas

- **Desktop**: Layout completo com sidebar e grid
- **Tablet**: Layout adaptado com navegação otimizada
- **Mobile**: Interface mobile-first com menu hamburger

## 🔐 Autenticação

O sistema de autenticação inclui:
- Validação de formulários
- Feedback visual de erros
- Proteção de rotas
- Gerenciamento de estado do usuário

## 🛒 Sistema de Carrinho

- Adicionar/remover produtos
- Atualização de quantidades
- Cálculo automático de totais
- Persistência no localStorage
- Feedback visual de ações

## 💳 Sistema de Pagamento

- Múltiplas formas de pagamento
- Validação de cartão de crédito
- Processamento simulado
- Confirmação de pagamento
- Redirecionamento após sucesso

## 📊 Dashboard Administrativo

- Estatísticas da loja
- Gerenciamento de jogos
- Gestão de usuários
- Relatórios de vendas
- Configurações do sistema

## 🎯 Próximos Passos

### Funcionalidades Futuras
- [ ] Sistema de avaliações de jogos
- [ ] Wishlist de jogos
- [ ] Sistema de cupons e promoções
- [ ] Chat de suporte em tempo real
- [ ] App mobile (Ionic/React Native)
- [ ] Integração com APIs de pagamento reais
- [ ] Sistema de notificações push
- [ ] Analytics avançado

### Melhorias Técnicas
- [ ] Testes unitários e e2e
- [ ] PWA (Progressive Web App)
- [ ] Otimização de performance
- [ ] SEO otimizado
- [ ] Internacionalização (i18n)
- [ ] Lazy loading avançado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
   

## 👥 Equipe

- **Davi Augusto Voelz Tonn**: Responsável por...
- **Kaio Levi**: Responsável por...
- **Lucas Miguel**: Responsável por...
- **Arthur Bona**: Responsável por...


