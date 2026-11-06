# Integrações

| Área | Estado | Contrato |
|---|---|---|
| Conta web | Local | `/api/auth/register`, `/login`, `/me`, `/logout`, `/password` sob `/api/auth` |
| Notícias | Local | `/api/news`, `/api/admin/news`, `/api/admin/remove-news` |
| Suporte | Local | `/api/chat/*`, `/api/admin/chats`, `/api/admin/reply`, `/api/admin/close-chat` |
| Fórum inicial | Local | `/api/forum/categories`, `/api/forum/topics`, `/api/forum/topics/:id`, `/api/forum/topics/:id/replies` |
| Moderação | Local | `/api/admin/forum/topics/:id` e `/api/admin/forum/audit`; apenas administrador |
| Perfil do jogo | Informativo | `/api/game/status`; 1.0M escolhida, `connected: false` |
| Ranking | Indisponível | `/api/rankings`; 13 categorias com `entries: []`, sem scraping |
| Editor real | Desativado | `item-policy.js` valida apenas nível e bloqueio de exclusivos; não é integração de inventário |
| Banco do jogo | Ausente | Banco e schema ainda não revisados |
| Pagamentos | Desativados | Sem credenciais, cobranças ou entregas |

A conta do site não cria conta de jogo. Nenhuma senha deve ser copiada automaticamente para um schema desconhecido. O navegador nunca acessa SQL diretamente. Futuras mutações devem validar titularidade, serial, catálogo de opções, estado do personagem, idempotência e bloqueio concorrente no serviço privado.
