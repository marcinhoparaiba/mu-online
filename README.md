# MuBanneD - Editavel

Portal original inspirado na **estrutura dos sites clássicos de MU**, sem copiar código, logos, textos nem imagens proprietários do MuAwaY. Projeto desenvolvido diretamente em HTML, CSS, JavaScript e Node.js, sem serviços pagos e sem dependências npm.

## Telas implementadas

- `index.html`: portal público no estilo de site de MMORPG clássico, home, notícias, cadastro, login, downloads, ranking, eventos, loja, guildas, ajuda e chat.
- `portal.html`: painel de jogo demonstrativo com personagens, editor +0 a +11, rankings, sorteios +13, premiação +15, prévia de itens **somente de simulação**.
- `staff.html`: área de **moderador/administrador**, com atendimento de chat e gestão de notícias.
- `server.mjs`: backend Node nativo para cadastro e login em banco JSON local, sessões HttpOnly, mensagens de suporte e notícias, somente para uma instância de teste.

## Rodar GRATUITAMENTE em seu computador (chat e login funcionando)

Requer Node.js 20+ (recomendado Node 22+). No terminal na pasta deste projeto:

```bash
MU_ADMIN_EMAIL="seu-email@exemplo.com" MU_ADMIN_PASSWORD="defina-uma-senha-longa" node server.mjs
```

No Windows PowerShell:

```powershell
$env:MU_ADMIN_EMAIL = "seu-email@exemplo.com"
$env:MU_ADMIN_PASSWORD = "defina-uma-senha-longa"
node server.mjs
```

O administrador precisa de senha com pelo menos 12 caracteres. Nenhuma senha padrão vem no projeto. Acesse `http://localhost:3000/` e faça login com a conta configurada; abra `http://localhost:3000/staff.html` para responder chats. Em outra janela privada, um visitante pode abrir uma conversa no canto inferior direito. O sistema guarda os registros em `.data/store.json` (ignorados pelo Git). **Não coloque credenciais em arquivo público nem no repositório.**

## Publicação gratuita da parte estática

GitHub Pages pode servir o site visualmente sem custo no repositório público. Na configuração do GitHub acesse `Settings → Pages → Source: Deploy from a branch → main → /(root) → Save`.

O GitHub Pages **não executa Node.js**, então cadastro, login e chat humano **não funcionam** em hospedagem puramente estática. Para atendimento real nessa publicação, há duas opções:

- Hospedar o backend `server.mjs` em um ambiente com HTTPS, armazenamento persistente e monitoramento e configurar o frontend para usar a mesma origem (requer arquitetura de proxy, reverse proxy ou adaptação da API);
- Criar uma conta gratuita no tawk.to e preencher em `chat-live.js` os IDs públicos `tawkPropertyId` e `tawkWidgetId` obtidos no código do widget oficial. O script então integra o chat humano ao site publicado sem exigir backend próprio. O moderador responde pelo painel do tawk.to (exige ação do titular da conta para ativar; não vem ativado por padrão).

É incorreto anunciar o chat como online enquanto nenhuma dessas opções estiver configurada.

## Segurança e limites

- A API guarda senhas com scrypt + salt; sessões em cookies HttpOnly SameSite Strict; requisições JSON limitadas; rate limit básico e verificação de origem para POST.
- O armazenamento JSON é suficiente **somente para protótipos e baixíssimo tráfego em instância única**. Produção pública requer banco transacional, TLS, configuração anti-CSRF mais forte, logs, monitoramento, backup, proteção contra brute force distribuído, recuperação de senha e autenticação aprimorada.
- Chat web permite conversa real entre visitante e moderador, quando o servidor Node estiver de pé; não há respostas automáticas fingindo ser humano.
- GameServer, Dark Lord real, inventários reais, Donate, QR Code, Pix e entregas de recompensas **não estão integrados nem operacionais**.
- Status de servidor e rankings exibidos na web são claramente marcados como projeto/demonstração.
- Não há custos de desenvolvimento nem créditos do Lovable. Hospedagem pública dinâmica e parceiros financeiros podem gerar custos ou limites.

## Regras desejadas para o futuro GameServer

- BK, SM, ME, MG e DL com Command.
- Edição de itens comuns pertencentes ao jogador de +0 a +15; customs exclusivos de eventos oficiais ou Donate bloqueados no editor comum. Transparência visual de +12 a +15; +0 a +11 normais.
- Transparência visual nos itens +12..+15, não nos itens +0..+11.
- Força do mesmo item relativa ao +11=100: +12=102, +13=105, +14=108, +15=111 (hipótese, não fórmula validada).
- Ranking semanal: duas partes distintas aleatórias de um set +13, cinco coleções em rodízio. Ranking mensal: arma Full +15 conforme classe escolhida.
- PvP competitivo mesmo para All +11 bem montado frente a +13/+14 incompletos.
- Não haverá intermediação de transações em dinheiro real entre jogadores.

## Direitos

Nenhum cliente comercial de MU, asset do MuAwaY, logomarca oficial ou servidor proprietário está neste projeto. Identidade visual do portal é própria. A publicação de servidores e comercialização de itens depende dos direitos pertinentes.

## Continuação: conta e perfil do servidor

Com Node.js 20+, execute `npm start`. Valide com `npm run check` e `npm test`; não há dependências para instalar. A página Minha conta permite trocar a senha e encerra outras sessões. O chat permite iniciar novo atendimento após o encerramento. Arquivos do backend e de testes não são servidos como conteúdo público.

Base escolhida para avaliação: **DarksTeam 1.0M (0.99.60/62T Beta 15), com Dark Lord**. Consulte `game-server/README.md`. Os arquivos da base ainda precisam ser obtidos e validados: nenhum binário de GameServer está incluído. `GET /api/game/status` e `GET /api/rankings` retornam o estado indisponível real. Os 13 rankings retornam estado vazio, sem nomes fictícios na página pública.

Publicação dinâmica, domínio, cliente de download, GameServer, banco de produção e pagamentos dependem de configuração externa. A referência visual recuperada da Hostinger ainda não foi entregue neste repositório.

## Estado e decisões

Consulte `docs/ESTADO-ATUAL.md`, `docs/DECISOES-DO-PROJETO.md` e `docs/PLANO-MESTRE-MU-BANNED.md`. Esses documentos refletem as decisões recentes; documentos anteriores ficam como histórico e não substituem essas regras.

## Fórum inicial

Abra `http://localhost:3000/forum.html` com o backend iniciado. Use a conta do site para criar tópicos e responder. Anúncios e eventos são categorias de publicação restrita à equipe; administrador pode fechar/reabrir ou ocultar/restaurar tópicos, com motivo e auditoria. Busca e páginas são suportadas. Mensagens usam texto simples, escapado na interface. O fórum completo e operação em produção ainda exigem os itens listados em `docs/PENDENCIAS.md`.
