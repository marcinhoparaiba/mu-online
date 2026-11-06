# Home clássica — referência visual recebida em 06/11/2026

A captura fornecida pelo titular de https://www.muaway.net/home orientou a organização visual: largura central de 940 px, duas colunas, navegação prateada, links laterais, painel do jogador, banner, classificação e notícias. Mantidos nome, textos e arte original MuBanneD. Nenhum logo, avatar de jogador, arte comercial ou código do site de referência foi importado.

A classificação foi movida da terceira coluna para a área central entre banner e notícias. As 13 categorias continuam disponíveis, com cinco posições vazias e mensagem de indisponibilidade. Não foram criados jogadores, resultados ou status online fictícios. A seleção de categoria permanece funcional. Painéis auxiliares seguem na lateral.

classic-home.css se aplica somente ao body.classic-site de index.html. Fórum, loja, intro e editor conservam sua apresentação. Os formulários e as rotas existentes foram preservados. Em telas menores a página usa uma coluna e a navegação se reorganiza.

Validação: npm run check, npm test e testes Python de auditoria; revisão Chromium em 1440x960, 390x844 e 320x760, incluindo ausência de rolagem horizontal, posições do banner/classificação/notícias, carregamento do novo CSS e navegação. A captura da Home fica em docs/previews/site-home-classic-2026-11-06.jpg.

A alteração visual não instala GameServer nem conecta SQL ou pagamentos. Não houve publicação de hospedagem: os arquivos foram salvos no GitHub.
