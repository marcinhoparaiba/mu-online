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
- Campanhas, torneios, guildas e casamento integrados ao jogo; anexos e editor WYSIWYG completo no fórum. Perfis, reputação, mensagens e notificações internas já funcionam localmente.
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

## Comunidade ampliada — 06/11/2026

24 categorias agrupadas; notícias, avisos, eventos, campanhas, manutenção, comunidade internacional, suporte, seis áreas de tutoriais, compra/venda/troca de itens, design e convivência. Sete cargos com permissões explícitas (administrador, subadministrador, GM, moderador, colaborador, designer, membro). Títulos por participação não concedem poder.
Perfis, biografia e assinatura em texto; membros, equipe, líderes por participação/reputação e atividade; curtidas sem autocurtida e sem duplicação; edição própria até 15 minutos; favoritos, acompanhamento e notificações; mensagens privadas com bloqueio de recebimento; denúncias e resolução; suspensão de conta web e mudanças de cargo com auditoria e revogação de sessões. Moderação: fechar, ocultar, fixar, mover, marcar respondido e moderar respostas. Comércio e área livre de design não somam participação.
Tudo persiste somente no JSON local; não concede cargos no jogo. Nenhuma conta de jogador real ou conteúdo do fórum de referência foi importado.

## Loja e utilidades — 06/11/2026

Loja em `shop.html` com catálogo gerenciado, busca, carrinho, rascunhos idempotentes, cancelamento, valores calculados no backend e auditoria. Não recebe pagamentos nem entrega itens. Catálogo vazio até cadastro autorizado de produtos. Calendário permite publicar/cancelar eventos e registrar interesse; não executa eventos no jogo. Membros ativos refletem sessões autenticadas no site nos últimos 15 minutos.

## Recuperação e acabamento web

Página de recuperação e redefinição implementadas; adaptador opcional Resend exige remetente, chave e URL HTTPS. Sem configuração retorna indisponível; nenhum envio real foi feito. Tokens ficam somente como hash no armazenamento, expiram em 15 minutos e são consumidos na fila de escrita; redefinição revoga sessões. Troca autenticada invalida links antigos.
Site ganhou privacidade, informações do projeto, acesso à recuperação e navegação para loja/comunidade. Fórum inclui formatação segura de negrito, itálico, código e citação, com botões de edição; não executa HTML do participante.


## Auditoria local do pacote — 06/11/2026

O pacote Windows foi inspecionado estaticamente nesta máquina. Auditoria e bloqueios estão em AUDITORIA-PACOTE-LOCAL-2026-11-06.md. Backup privado parcial do material legível validado por SHA-256; um executável de launcher teve leitura recusada, e Main.exe não estava presente na verificação final. Nenhum binário executado, nenhuma compilação ou restauração SQL efetuada. Web preservada, oito testes Node e três testes Python aprovados.


## Recuperação do pacote e proteção do Windows — 06/11/2026

O FIRETEAM.rar foi localizado e extraído em área privada, mas Main.exe e o criador de launcher foram bloqueados pelo Microsoft Defender (Trojan:Win32/Phonzy.A!ml). A proteção foi preservada. Há consultas SQL em arquivos .txt numa pasta MuServer alternativa; não foram executadas e sua compatibilidade não está validada. Outros dois RARs aguardam senha válida. Consulte RECUPERACAO-PACOTE-LOCAL-2026-11-06.md. Não declarar cliente utilizável ou integração concluída.
