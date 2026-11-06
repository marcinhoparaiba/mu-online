# Estado atual

## Funciona com backend local

- Cadastro e login do site; senha com scrypt, sessão HttpOnly.
- Minha conta e troca de senha, invalidando outros acessos.
- Chat entre visitante e equipe; encerramento e novo atendimento.
- Publicação de notícias e permissões de administrador.
- Fórum inicial: categorias, tópicos, respostas, busca paginada e moderação com motivo e auditoria; usa conta do site.
- Site preservado, navegação e 13 categorias de ranking sem dados inventados.
- Servidor HTTP com lista explícita de arquivos públicos; backend, testes e módulos privados não são entregues pelo site.

## Demonstração

- Personagens, inventário, editor +0 a +15 e premiações do `portal.html` usam dados locais.
- A regra de transparência +12..+15 aparece como indicação, sem modelo 3D real.
- Painel administrativo demonstrativo não gerencia o GameServer.

## Ainda não funciona

- Jogo e cliente clássico custom, banco do jogo, contas vinculadas, itens e rankings reais.
- Transparência no cliente, suporte real a +15 na distribuição escolhida e combate equilibrado.
- Fórum avançado (perfis, reputação, mensagens, notificações e editor rico), campanhas, torneios, guilds e casamento integrados.
- Produção: JSON local é apenas armazenamento para teste em instância única. Não afirmar que está pronto para operação pública.

## Validação desta etapa

`npm run check`: scripts JavaScript sem erro de sintaxe.
`npm test`: limites do editor, exclusivos, conta, senha, sessões, chat, notícias, 13 categorias, ausência de integração e segurança HTTP aprovados.
Revisão posterior em Chromium aprovada em 1440×960, 390×844 e 320×760 para intro, site, editor e fórum; sem acesso ao jogo.

## Etapa do fórum

`npm run check` e `npm test` aprovados após inclusão do fórum. Testes verificam anonimato, categoria restrita à equipe, resposta, busca, fechamento e reabertura, ocultação e restauração, trilha de moderação e persistência no arquivo de teste. Revisão visual em Chromium aprovada em desktop e telas pequenas para os fluxos principais.

## Intro e catálogo

Apresentação separada em `intro.html`, arte original, responsividade, navegação, redução de movimento e prévia +11/+12. Home preservada em `index.html`. Coleções 01–09 em `portal.html#colecoes` e API de referência; sem modelos ou atributos inventados. Perfil vigente clássico sem DL. Nenhum GameServer foi instalado, conectado ou publicado.

## Recuperação e validação HTTP — 06/11/2026

Ferramenta local de backup com SHA-256 e restauração para destino novo, preservando os bytes originais, sem sobrescrever arquivos. Backups fora da árvore do projeto e gravação restrita no POSIX. Não é backup do GameServer.
A API agora rejeita JSON primitivo, listas, conteúdo malformado e tipo de conteúdo incorreto; excesso de tamanho retorna 413 sem destruir o socket antes da resposta. Os testes cobrem esses casos e restauração/corrupção de backup.
