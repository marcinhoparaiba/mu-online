# Etapa web — 06/11/2026

## Entregue localmente

- Preservadas a Home clássica, intro, fórum e painel demonstrativo. Cores compartilhadas ajustadas à identidade obsidiana/rubi/dourado.
- Comunidade com 24 categorias, sete cargos e permissões no backend; perfis, assinatura, reputação, líderes, membros/equipe, atividade, notificações, mensagens privadas e preferências.
- Tópicos: acompanhar, favoritos, curtidas, edição própria limitada, formatação segura, denúncias, fechar/reabrir, ocultar/restaurar, fixar, mover e marcar respondido. Respostas com moderação individual e auditoria.
- Administração de cargos e suspensões com motivo, revogação de sessões e proteção do acesso administrativo. Atendimento compartilhado com cargos autorizados; notícias restritas a publicação oficial.
- Calendário com agendamento, cancelamento e interesse; presença calculada a partir de atividade autenticada no site, sem simular jogadores conectados.
- Loja com catálogo gerenciado e auditado, busca, filtros, carrinho e pedidos em rascunho, totais no backend, idempotência, histórico e cancelamento. Cobrança e entrega seguem desativadas. Catálogo inicia vazio.
- Recuperação de conta com token de 15 minutos, uso único, hash no armazenamento e revogação de sessões; envio opcional ainda sem configuração.
- Privacidade, informações do projeto, links de navegação e acesso à recuperação.
- Backup privado com checksum e restauração para destino novo; validação de entrada HTTP.

## Verificação

`npm run check` e `npm test`: aprovados (8 casos, incluindo o fluxo integrado de HTTP com múltiplas contas). Cobertura de autorização, privacidade, concorrência no token, moderação, loja sem cobrança, idempotência, corrupção/recuperação do backup e formatação sem HTML executável.
Revisão em Chromium com 1440×960, 390×844 e 320×760: fluxos de intro/editor/coleções, fórum, criação de tópico e perfil, favoritos, carrinho e rascunho; telas de cargos, denúncias, auditoria, catálogo e atendimento verificadas. Capturas e dados sintéticos ficam fora do repositório.

## Limites e retomada

Não foi feita publicação do servidor. Nenhuma compra, cobrança ou envio real de e-mail. Sem acesso ao pacote Windows e sem integração de GameServer, banco do jogo, personagens, baú ou entrega de itens. Cliente/launcher e customizações do jogo não foram implementados sem arquivos.
Além do MuServer, ainda há configuração externa de e-mail, infraestrutura de produção e migração do armazenamento JSON para banco transacional. Pagamentos exigem provedor e política autorizados; permanecem desativados. Anexos, WYSIWYG completo, 2FA/login social, push e traduções são complementos de plataforma, explicitamente pendentes. Não declarar réplica literal de funções privadas não observadas no fórum de referência.

Retomar lendo `ESTADO-ATUAL.md`, `DECISOES-DO-PROJETO.md`, `PENDENCIAS.md`, `COMUNIDADE-E-PERMISSOES.md`, `LOJA.md` e `RECUPERACAO-DE-CONTA.md`. A decisão vigente é clássica sem DL; editor +0..+15 com transparência +12..+15; exclusivos bloqueados; coleções 01..09 não são níveis.
