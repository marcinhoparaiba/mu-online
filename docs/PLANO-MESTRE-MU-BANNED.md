# Plano mestre — MuBanneD - Editavel

Continuar o projeto existente em HTML, CSS, JavaScript e Node.js sem dependências de execução externas. O commit anterior f7e14a38138618e68492338de1be98c7d338025d e cópias locais preservam o estado de partida. Nunca incluir segredos ou banco de jogadores no Git.

## Etapas e critérios de conclusão

1. **Site e conta:** cadastro, login, troca de senha com revogação de sessões, atendimento, notícias, acessibilidade e testes HTTP. Implementados e testados; revisão visual de navegador ainda pendente.
2. **Regras do editor e ranking:** +0..+15 para comuns, transparência a partir de +12, exclusivos bloqueados; 13 categorias públicas com estado vazio. Implementados no protótipo. O editor não toca no jogo.
3. **Fórum inicial:** categorias, tópicos, respostas, busca, conta compartilhada, moderação e auditoria. Próxima etapa independente do GameServer. Fórum completo inclui funcionalidades adicionais a implementar depois.
4. **Base 1.0M:** obter arquivos autorizados, inventariar e instalar em Windows isolado; validar cliente, banco e DL. Bloqueada pelo acesso aos arquivos.
5. **Integração:** contas vinculadas, personagens, baú, editor com locks/auditoria e rankings reais. Depende da etapa 4.
6. **Eventos e comunidade:** PvP Legend, resultados auditáveis, vidas não compráveis, guilds de 20 membros e casamento. Implementar módulos locais antes da ponte com o jogo.
7. **Donate:** campanhas sem cobrança real, pacote superior com dois kits elegíveis inclusive classes repetidas; validar provedor antes de pagamentos e entrega.
8. **Lançamento:** banco transacional, HTTPS, recuperação de contas, backups restauráveis, teste de carga, auditoria e beta. Nenhum lançamento aconteceu.

Cada etapa deve gerar commit descritivo no GitHub após testes. Não tratar commits como publicação de servidor. Preservar Home clássica.
