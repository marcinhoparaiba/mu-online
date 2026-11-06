# Loja local

`shop.html`: catálogo por categorias e busca, carrinho persistente por conta e pedidos em rascunho com histórico e cancelamento. A conta do site é compartilhada com o fórum. Catálogo inicia vazio: não foram inventados produtos oficiais, preços comerciais ou assets. Administração e subadministração podem cadastrar, editar e ocultar produtos com motivo e histórico; demais cargos não possuem essa permissão.

## Contratos

- `GET /api/shop/catalog`: produtos ativos e flags de pagamento/entrega desativadas.
- `GET/POST /api/shop/cart`: carrinho próprio, quantidades 0..20, até 30 produtos.
- `GET/POST /api/shop/orders`: pedidos próprios e geração de rascunho com chave de idempotência.
- `POST /api/shop/orders/cancel`: cancela somente pedido próprio.
- `POST /api/shop/checkout`: retorna 503; nunca gera cobrança.
- `GET/POST /api/admin/shop/products`: catálogo protegido por permissão.
- `GET /api/admin/shop/audit`: histórico privado de alterações.

Preços são inteiros em centavos, até R$ 1.000.000,00 por unidade; preço null significa a definir e impede criar pedido. Total é sempre recalculado no backend e congelado no rascunho. Alterações de preço e disponibilidade são revalidadas na transação. Repetir uma chave de pedido para a mesma conta retorna o mesmo pedido, sem duplicação. Nenhum dado de pagamento é solicitado.

## Limites reais

Não há cobrança, saldo, Pix, cartão, custódia, intermediação financeira entre jogadores, estoque reservado ou entrega de itens. Produtos em rascunho não correspondem a inventário real. Integração de GameServer, provedor financeiro autorizado, política comercial e infraestrutura de produção permanecem pendentes. JSON local não substitui banco transacional de comércio em produção.
