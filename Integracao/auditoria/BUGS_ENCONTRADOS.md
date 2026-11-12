# Bugs encontrados

| # | Sev. | Onde | Problema | Status |
|---|---|---|---|---|
| 1 | Alta | Cliente: BMD dos pets e itens recoloridos | Nome da textura acima de 31 letras era cortado, então o item ficaria sem textura | CONFIRMADO E CORRIGIDO |
| 2 | Alta | Comando /make e similares (GM) | GM criava item de donate ou exclusivo | CONFIRMADO E CORRIGIDO |
| 3 | Alta | /editor | Aceitava código de item inexistente, o que cria item inválido | CONFIRMADO E CORRIGIDO |
| 4 | Média | /editorset | Criava peça que não existe no set | CONFIRMADO E CORRIGIDO |
| 5 | Média | Item.txt (3 salas) | Nome dos Scepters quebrado por TAB e índice 144 duplicado | CONFIRMADO E CORRIGIDO |
| 6 | Média | Item.txt | Classes dos Scepters erradas (MG em vez de DL) | CONFIRMADO E CORRIGIDO |
| 7 | Média | Efeitos (Lua) | Brilho na cor errada (cor da linha diferente da arte do item) | CONFIRMADO E CORRIGIDO |
| 8 | Média | Item.txt | Calça, luva e bota BanneD com defesa 5 a 44 (fora da linha) | CONFIRMADO E CORRIGIDO |
| 9 | Baixa | Recoloração | Armagedom rosado (saturação baixa) | CONFIRMADO E CORRIGIDO |
| 10 | Baixa | Inventário do MarcioBK | 19 itens de teste deixados pelos bots | CONFIRMADO E CORRIGIDO |
| 11 | Baixa | LoadItens.lua (cliente) | Modelos Bow124, Staff132 e battlescroll não existem; os itens também não existem no servidor | CONFIRMADO E PENDENTE (inofensivo) |
| 12 | Baixa | 7 Lua do cliente (GiroDaSorte, Options, Move, InterfaceInfos, CharacterHelper, CharacterCreateCape) | Parênteses desequilibrados já no original; o jogo roda com eles | SUSPEITO |
| 13 | Baixa | Arte original de algumas linhas (ex.: Holly Night) | Cores misturadas na própria arte | SUSPEITO (escolha artística, não alterado) |
| 14 | Info | Logs | "CheckSumTime Error" vem dos bots de teste | NÃO APLICÁVEL |

## Auditoria de itens (12/11, 2a rodada) — work/audita_itens.py
| # | Sev. | Achado | Status |
|---|---|---|---|
| 15 | ? | 191 itens classicos (ex.: Bone Blade, Crossbow, Golden Crossbow, sets 3a classe) sem arquivo 3D com o nome padrao -> podem estar invisiveis | SUSPEITO / NAO TESTADO (lista em ITENS_SUSPEITOS.md; cliente original igual) |
| 16 | — | Angel Helm usa skin_Class305 (pele do personagem, trocada pelo jogo em tempo real) | NAO APLICAVEL |
| 17 | — | Asas classicas 5x3 / 5x2 no inventario | NAO APLICAVEL (tamanho original do MU) |
| 18 | — | 10 itens sem classe (pergaminhos do DL, Cape of Lord, Dark Raven, Spirit) | NAO APLICAVEL (itens especiais) |
| — | — | Todos os 2193 itens tem nome no cliente; todos os itens novos/donate tem modelo e textura | OK |

## Varredura geral (12/11, 3a rodada) — Integracao/editor/auditoria_geral.py
| # | Sev. | Achado | Status |
|---|---|---|---|
| 19 | Alta | Wizards Ring (13:20) estava comentado no Item.txt, mas todo personagem novo nasce com 2 (DefaultClassType) -> 28 itens invalidos em inventarios | CONFIRMADO E CORRIGIDO (item reativado nas 3 salas) |
| 20 | Media | 5 itens classicos entraram em linhas por engano (Dark Raven normal do DL, Cape of Lord, Ring of Ice, Scroll of Blood, Orb of Ice Arrow) e ficaram exclusivos | CONFIRMADO E CORRIGIDO (classicos fora das linhas; nome original de volta) |
| 21 | Media | Pet Frost Black (13:275) sem registro no cliente -> invisivel | CONFIRMADO E CORRIGIDO (CharacterHelper) |
| 22 | Media | SalaVip: 11 itens inexistentes nas lojas | CONFIRMADO E CORRIGIDO (//REMOVIDO) |
| 23 | Baixa | CustomWing com asa 12:174 inexistente (3 salas) | CONFIRMADO E CORRIGIDO |
| 24 | Media | Aneis/pendants novos com modelo de chifre | CONFIRMADO E CORRIGIDO (modelos de anel/colar por tema) |
| 25 | Media | Horse/Fenrir BanneD duplicados (13:473/474) | CONFIRMADO E CORRIGIDO |
| — | — | Varredura final: 0 achados (monstros, spawns, lojas, asas, portoes, imagens, inventarios/baus do banco, logs) | OK |
| — | — | Visual dentro do jogo | NAO TESTADO |
