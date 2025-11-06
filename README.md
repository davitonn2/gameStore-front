# GameStore — Frontend (Angular)

Este README documenta o frontend Angular do projeto "GameStore".
Inclui instruções de build, deploy (Render), variáveis de ambiente, páginas e exemplos de screenshots.

## Sumário

- Visão geral
- Funcionalidades / páginas
- Requisitos
- Variáveis de ambiente / build-time
- Scripts úteis
- Build para Render (deploy estático)
- Desenvolvimento local
- Estrutura do projeto (páginas e serviços)
- Como adicionar screenshots
- Troubleshooting

---

## Visão geral

Frontend feito com Angular (standalone components). Fornece as páginas principais da loja: catálogo, detalhes do jogo, carrinho, checkout, painel admin, perfil, login, register, thank-you (com keys geradas localmente).

Build-time env injection: este projeto gera `src/environments/environment.prod.ts` durante o build (script `set-env.js`) para injetar `apiUrl` e `authUrl` no bundle de produção.
SPA fallback: após o build, copiamos `index.html` → `200.html` para hospedar no Render e evitar 404 em rotas SPA.

---

## Funcionalidades / páginas

Páginas implementadas (resumo):
- Home
- Catalog (listagem de jogos, sem painel lateral de filtros)
- Game Details
- Cart
- Checkout (sem frete)
- Thank You (gera chaves fake por unidade e permite copiar)
- About
- Contact
- Login / Register
- Profile
- Admin (painel de estatísticas e ações de gerenciamento)

Serviços principais:
- `auth.service.ts` — login/logout/guarda de rotas
- `game.service.ts` — listagem/CRUD de jogos
- `category.service.ts` — categorias
- `user.service.ts` — endpoints relacionados a usuários (inclui `getUserCount()`)
- `order.service.ts` — criar e listar pedidos
- `cart.service.ts` — gerenciamento do carrinho no client-side

---

## Requisitos

- Node.js 18+ (recomendado)
- npm 9+
- Angular CLI (opcional para desenvolvimento)

---

## Variáveis de ambiente (build-time)

O projeto usa um script `set-env.js` para gerar `src/environments/environment.prod.ts` no build de produção. As variáveis esperadas (defina no ambiente de build do Render ou localmente antes de rodar o script):

- `API_URL` — URL base da API (ex.: `https://minha-api.onrender.com/api`)
- `AUTH_URL` — URL do provedor de autenticação (opcional)

No `package.json` existe o script `build:render` que chama o `set-env.js` e em seguida `ng build --configuration=production` e copia `index.html` para `200.html`.

---

## Scripts úteis

No diretório do frontend (`gameStore-front`):

```powershell
# instalar dependências
npm install

# desenvolvimento (dev server)
npm run start  # ou: ng serve --open

# build para render (gera environment.prod.ts e 200.html)
npm run build:render

# build de produção padrão
npm run build
```

---

## Build para Render

1. Configure as variáveis de ambiente no dashboard do Render (ou onde for hospedar): `API_URL` e `AUTH_URL`.
2. Use o script `build:render` como comando de build (já foi adicionado no package.json). Esse script:
   - escreve `src/environments/environment.prod.ts` com as variáveis
   - executa `ng build --configuration=production`
   - copia `dist/index.html` para `dist/200.html` para fallback SPA

No Render, escolha `Static Site` e aponte para a pasta `dist/<nome-do-app>` que o Angular gerar.

---

## Desenvolvimento local

1. Clone e instale dependências:
```powershell
cd "c:\Users\lucas\OneDrive\Área de Trabalho\Projeto\gameStore-front"
npm install
```
2. Para desenvolvimento com live-reload:
```powershell
npm run start
```
3. Para testar integração com backend local (garanta que o `environment.ts` aponta para `http://localhost:8080/api`).

---

## Estrutura do projeto (onde ficam as coisas)

- `src/app/pages/` — principais páginas (home, catalog, admin, profile...)
- `src/app/services/` — serviços HTTP
- `src/app/models/` — modelos/DTOs (Game, User, Order, Cart)
- `src/environments/` — arquivos de environment; `environment.prod.ts` é gerado no build
- `set-env.js` — script para gerar `environment.prod.ts` no build
- `copy-index-to-200.js` — copia index para 200.html

---

## Ajustes visuais e UX

- O catálogo foi ajustado para remover o painel de filtros e centralizar os cartões de jogos.
- A página de agradecimento (`thank-you`) gera keys fake por unidade e possui botão de copiar.
- No perfil, botões de edição foram removidos conforme pedido do design.

---

## Screenshots (preencha com prints)

Crie uma pasta `docs/screenshots` e adicione as imagens. Em seguida substitua os links abaixo.

### Home

![Home](./docs/screenshots/home.png)

### Catálogo

![Catálogo](./docs/screenshots/catalog.png)

### Admin - Painel

![Admin](./docs/screenshots/admin.png)

### Thank-you (chaves)

![Thank You](./docs/screenshots/thank-you.png)

---

## Troubleshooting

- Se o build `build:render` falhar, verifique se as variáveis `API_URL` e `AUTH_URL` estão definidas no ambiente ou exportadas localmente.
- Se rotas do admin 404 no host (Render), confirme que o `200.html` está presente na pasta `dist`.
- CORS: se o frontend não consegue chamar a API, confira cabeçalhos CORS no backend.

---

Se quiser, eu adiciono um script `npm run ci:build` que valida o `environment.prod.ts` antes do build e falha se `API_URL` não estiver definido. Deseja que eu inclua isso? 
