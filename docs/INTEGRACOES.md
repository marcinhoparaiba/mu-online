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


## Auditoria local do pacote — 06/11/2026

O pacote local foi inventariado; banco do jogo continua sem schema validado, sem conexão e sem importação. Fontes parciais de plugins não habilitam o editor real. Não copiar credenciais da conta web para o jogo. Relatório: AUDITORIA-PACOTE-LOCAL-2026-11-06.md.


## Recuperação do pacote e proteção do Windows — 06/11/2026

O FIRETEAM.rar foi localizado e extraído em área privada, mas Main.exe e o criador de launcher foram bloqueados pelo Microsoft Defender (Trojan:Win32/Phonzy.A!ml). A proteção foi preservada. Há consultas SQL em arquivos .txt numa pasta MuServer alternativa; não foram executadas e sua compatibilidade não está validada. Outros dois RARs aguardam senha válida. Consulte RECUPERACAO-PACOTE-LOCAL-2026-11-06.md. Não declarar cliente utilizável ou integração concluída.


## Compilação diagnóstica e configuração — 06/11/2026

Os cinco conjuntos de fontes compilaram para objetos Win32 com v143/SDK 26100 em receitas próprias, sem link ou execução. O gerador main.lab próprio foi testado e a configuração nova foi sincronizada com Client após backup. O motor Main.exe não foi reconstruído e permanece bloqueado/ausente. SQL segue sem schema base validado ou instância de teste. Leia COMPILACAO-DIAGNOSTICA-2026-11-06.md. Não confundir compilação de plugins com jogo funcionando.
