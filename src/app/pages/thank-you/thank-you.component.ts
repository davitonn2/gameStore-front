
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

function generateSteamKey(): string {
  // Steam style: 5 blocks of 5 uppercase letters (A-Z), separated by '-'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let key = '';
  for (let i = 0; i < 5; i++) {
    if (i > 0) key += '-';
    for (let j = 0; j < 5; j++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return key;
}

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  error: string | null = null;
  fakeKeys: { [gameName: string]: string } = {};
  // map keys by game id to avoid missing names
  fakeKeysById: { [id: string]: string } = {};
  // unified items array used by the template (supports backend shape and older frontend shape)
  items: any[] = [];
  // track copied state per item id for UI feedback
  copiedMap: { [id: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    if (orderId) {
      this.orderService.getOrderById(+orderId).subscribe({
        next: (order) => {
          this.order = order;
          // Normalize items into `this.items` to support both backend DTO (itens) and frontend/cart shape
          if ((order as any).carrinho && (order as any).carrinho.carrinhoJogos) {
            this.items = (order as any).carrinho.carrinhoJogos;
          } else if ((order as any).itens) {
            // backend returns PedidoDTO.itens -> each item has jogoId, nomeJogo, quantidade
            // NOTE: expand items per unit when quantidade > 1 so we show one key per purchased unit
            const rawItems = (order as any).itens.map((it: any) => ({
              jogoId: it.jogoId,
              nomeJogo: it.nomeJogo,
              quantidade: it.quantidade,
              jogo: { id: it.jogoId, nome: it.nomeJogo }
            }));

            const expanded: any[] = [];
            rawItems.forEach((it: any, itemIdx: number) => {
              const qty = (it.quantidade && Number(it.quantidade) > 0) ? Number(it.quantidade) : 1;
              for (let u = 0; u < qty; u++) {
                // create a per-unit entry with a stable display id so keys do not collide
                const baseId = it.jogo?.id ? String(it.jogo.id) : (it.jogoId ? String(it.jogoId) : String(itemIdx));
                expanded.push({
                  ...it,
                  _unitIndex: u,
                  _unitOrdinal: u + 1,
                  _displayId: `${baseId}-${u}`
                });
              }
            });

            this.items = expanded;
          } else {
            this.items = [];
          }

          // Gerar uma key fake para cada unidade (item expandido)
          this.items.forEach((item: any, idx: number) => {
            const id = item._displayId ? String(item._displayId) : (item.jogo?.id ? String(item.jogo.id) : (item.jogoId ? String(item.jogoId) : String(idx)));
            const name = item.jogo?.nome || item.nomeJogo || (`Jogo ${idx + 1}`);
            const k = generateSteamKey();
            // prefer id mapping to avoid collisions when same game is bought multiple times
            this.fakeKeysById[id] = k;
            // keep name mapping for convenience (includes unit index to avoid overwrite)
            this.fakeKeys[`${name}-${item._unitIndex ?? 0}`] = k;
          });
          this.loading = false;
        },
        error: () => {
          this.error = 'Não foi possível carregar o pedido.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Pedido não encontrado.';
      this.loading = false;
    }
  }

  getKeyForItem(item: any, idx: number): string {
    const id = item._displayId ? String(item._displayId) : ((item.jogo && item.jogo.id) ? String(item.jogo.id) : (item.jogoId ? String(item.jogoId) : String(idx)));
    const name = item.jogo?.nome || item.nomeJogo || (`Jogo ${idx + 1}`);
    // prefer id-based mapping to avoid collisions when same game bought multiple times
    if (this.fakeKeysById[id]) return this.fakeKeysById[id];
    // check a name+unit mapping as a secondary source
    const nameKey = `${name}-${item._unitIndex ?? 0}`;
    if (this.fakeKeys[nameKey]) {
      this.fakeKeysById[id] = this.fakeKeys[nameKey];
      return this.fakeKeys[nameKey];
    }
    const newKey = generateSteamKey();
    this.fakeKeysById[id] = newKey;
    this.fakeKeys[nameKey] = newKey;
    return newKey;
  }

  copyKey(item: any, idx: number): void {
    const id = item._displayId ? String(item._displayId) : ((item.jogo && item.jogo.id) ? String(item.jogo.id) : (item.jogoId ? String(item.jogoId) : String(idx)));
    const key = this.getKeyForItem(item, idx);

    const doCopied = () => {
      this.copiedMap[id] = true;
      setTimeout(() => { this.copiedMap[id] = false; }, 2200);
    };

    // use clipboard API with fallback
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(key).then(() => {
        doCopied();
      }).catch(() => {
        this.fallbackCopy(key, id, doCopied);
      });
    } else {
      this.fallbackCopy(key, id, doCopied);
    }
  }

  private fallbackCopy(text: string, id: string, onSuccess: () => void) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      onSuccess();
    } catch (e) {
      console.warn('Fallback copy failed', e);
      // still show a short UI feedback (no clipboard)
      onSuccess();
    }
  }
}
