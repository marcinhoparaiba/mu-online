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
