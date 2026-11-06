# Home clássica — referência visual recebida em 06/11/2026

A captura fornecida pelo titular de https://www.muaway.net/home orientou a organização visual: largura central de 924 px, duas colunas, navegação prateada, links laterais, painel do jogador, banner, classificação e notícias. Mantidos nome, textos e arte original MuBanneD. Nenhum logo, avatar de jogador, arte comercial ou código do site de referência foi importado.

A classificação foi movida da terceira coluna para a área central entre banner e notícias. As 13 categorias continuam disponíveis, com cinco posições vazias e mensagem de indisponibilidade. Não foram criados jogadores, resultados ou status online fictícios. A seleção de categoria permanece funcional. Painéis auxiliares seguem na lateral.

classic-home.css se aplica somente ao body.classic-site de index.html. Fórum, loja, intro e editor conservam sua apresentação. Os formulários e as rotas existentes foram preservados. Em telas menores a página usa uma coluna e a navegação se reorganiza.

Validação: npm run check, npm test e testes Python de auditoria; revisão Chromium em 1440x960, 390x844 e 320x760, incluindo ausência de rolagem horizontal, posições do banner/classificação/notícias, carregamento do novo CSS e navegação. A captura da Home fica em docs/previews/site-home-classic-2026-11-06.jpg.

A alteração visual não instala GameServer nem conecta SQL ou pagamentos. Não houve publicação de hospedagem: os arquivos foram salvos no GitHub.

## Refinamento conforme pedido de cópia fiel

Medidas refinadas para 924 px, lateral de 226 px, oito itens no menu horizontal, nove links laterais, banner compacto e cartões do ranking separados da faixa de categorias. Notícias em lista compacta com data/categoria; clicar abre o texto completo, preservando o conteúdo. Mantidos estados de indisponibilidade e dados reais do portal.

Fidelidade ainda parcial: a arte de cabeçalho, banner, logotipo e avatares do site de referência não estão disponíveis no projeto. A identidade MuBanneD permanece enquanto não houver outra escolha do titular. Não declarar esta versão uma reprodução idêntica. Captura atual: docs/previews/site-home-classic-v2-2026-11-06.jpg.
