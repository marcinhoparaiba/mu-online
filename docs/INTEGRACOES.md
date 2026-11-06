# Integrações

| Área | Estado | Contrato |
|---|---|---|
| Conta web | Local | `/api/auth/register`, `/login`, `/me`, `/logout`, `/password` sob `/api/auth` |
| Notícias | Local | `/api/news`, `/api/admin/news`, `/api/admin/remove-news` |
| Suporte | Local | `/api/chat/*`, `/api/admin/chats`, `/api/admin/reply`, `/api/admin/close-chat` |
| Fórum inicial | Local | `/api/forum/categories`, `/api/forum/topics`, `/api/forum/topics/:id`, `/api/forum/topics/:id/replies` |
| Moderação | Local | `/api/admin/forum/topics/:id` e `/api/admin/forum/audit`; apenas administrador |
| Perfil do jogo | Informativo | `/api/game/status`; 97d+99i custom escolhida, `connected: false` |
| Ranking | Indisponível | `/api/rankings`; 13 categorias com `entries: []`, sem scraping |
| Coleções clássicas | Referência | `/api/catalog/collections`; 01..09, sem inventário ou atributos reais |
| Editor real | Desativado | `item-policy.js` valida apenas nível e bloqueio de exclusivos; não é integração de inventário |
| Banco do jogo | Ausente | Banco e schema ainda não revisados |
| Pagamentos | Desativados | Sem credenciais, cobranças ou entregas |

A conta do site não cria conta de jogo. Nenhuma senha deve ser copiada automaticamente para um schema desconhecido. O navegador nunca acessa SQL diretamente. Futuras mutações devem validar titularidade, serial, catálogo de opções, estado do personagem, idempotência e bloqueio concorrente no serviço privado.

Comunidade local: `/api/community/{roles,members,leaders,activity,profile,notifications,messages,reports}`; detalhes em `docs/COMUNIDADE-E-PERMISSOES.md`. Gestão privada em `/api/admin/community/{users,reports,audit}`. Permissões verificadas no backend; cargo enviado pelo navegador não cria privilégios.

Loja: `/api/shop/{catalog,cart,orders}`; catálogo/auditoria privados em `/api/admin/shop/*`. Pagamentos e entrega desativados. Recuperação: `POST /api/auth/forgot`, `POST /api/auth/reset`, envio externo opcional ainda sem configuração. Calendário: `/api/community/events` e ações `/join`, `/cancel`. Presença do site: `/api/community/online`.
