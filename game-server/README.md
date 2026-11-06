# Base 1.0M do MuBanneD

Base escolhida pelo usuário: DarksTeam 0.99.60/62T (1.0M), Beta 15. A escolha substitui o requisito inicial de 97d+99i.

Fonte de distribuição consultada: https://darksteam.net/threads/darksteam-muserver-0-99-60-62t-1-0m-beta-15.21354/

O tópico lista pacote de servidor, patch de cliente e patch Beta 15. Os binários não foram baixados nem executados. A tentativa de leitura direta da página retornou HTTP 403. Não há credenciais do fórum configuradas. A consulta pública do tópico não equivale a acesso aos anexos.

## Configuração própria

- Classes previstas: BK, SM, ME, MG e DL. Prioridade de testes: BK e DL.
- Editor comum: +0 a +15. Customs exclusivos bloqueados em qualquer nível.
- +0 a +11 normais; +12 a +15 transparentes. O módulo `item-policy.js` especifica a regra, mas a renderização real deve ser implementada no cliente.
- Não há intermediação financeira entre jogadores. Donate ainda desativado.
- Guild: meta de 20 integrantes. Suporte a cargos e guerras depende de avaliação da base.

## Antes de iniciar

Obter pacote e cliente compatível de fonte autorizada. Verificar condições de uso, hashes, documentação e necessidade de licença. Disponibilidade pública não implica direito de redistribuir. O acesso ao código-fonte ainda não foi confirmado; não prometer qualquer customização interna enquanto isso não for verificado.

Inventariar serviços, configurações, bibliotecas, formatos de itens, schema e versão de SQL exigida. Preparar Windows isolado compatível e banco exclusivo de teste. Definir portas a partir dos arquivos recebidos, mantendo banco e serviços internos privados. Não presumir que os padrões de outra distribuição servem aqui.

## Sequência de testes

1. Início dos serviços e conectividade local.
2. Login e criação das cinco classes.
3. DL: Command, cavalo, corvo, habilidades e equipamentos.
4. Persistência e reconexão; inventário, warehouse, serial e trade.
5. Níveis +12 a +15: validar armazenamento e protocolo; a documentação consultada lista mixes até +13, portanto +15 não está comprovado.
6. Implementar transparência no cliente somente depois de localizar a regra de renderização compatível.
7. Comparar dano, defesa, velocidade, combo, buffs e pets em duelos BK/DL repetíveis. Não há equivalência demonstrada com MuAwaY.
8. Construir serviço privado de integração com autenticação, auditoria, locks e validação de titularidade. Editor real permanece desativado até passar esses testes.

`GET /api/game/status` informa a escolha e mantém `connected: false`. Não há GameServer executando neste repositório.
