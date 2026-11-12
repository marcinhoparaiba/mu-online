# Correções realizadas (todas com backup)

- **#1:** os BMD clonados passaram a usar nomes curtos de textura (`dn<Linha><hash>`). O script `work\criar_pecas_donate.py` foi corrigido para não repetir o erro.
- **#2:**
  - `Utils\ChatSystem.lua` das 3 salas: /make, /makeall, /makeset*, /makevisual, /drop*, /addbrinde e afins agora só funcionam para a conta admin (backup em `work\antes-chat-*.lua`).
  - `Make Item.lua`: trava extra para exclusivos (backup em `work\antes-make-*.lua`).
- **#3 e #4:** `EditorItens.lua` (servidor) agora valida contra a lista de itens existentes (EDITOR_VALIDOS) e as peças de cada set (EDITOR_SETMASK).
- **#5 e #6:** corrigidas as linhas dos Scepters no Item.txt das 3 salas (backup em `work\antes-pecas-donate`).
- **#7:**
  - o brilho de cada item passou a usar a cor real dele (`work\cores_linhas.json`);
  - o set e as peças criadas usam a cor da asa original da linha.
- **#8:** a defesa do BanneD e das linhas de donate ficou em 1,2 × a melhor peça de evento (backup em `work\antes-donate`).
- **#9:** recoloração com saturação mínima de 0,85.
- **#10:** limpeza do inventário do MarcioBK (backup em `work\backup-inv-MarcioBK.txt`).

**Novas regras pedidas, com teste:**
- GM vê só a aba EVENTOS; a aba DONATE é só da conta ADM.
- GM é obrigado a justificar, com `/justificar texto` (mínimo de 10 letras, prazo de 2 minutos).
- Tudo que o GM cria fica registrado na tabela **EditorLog**: data, conta, personagem, item e justificativa. A conta ADM também fica registrada.
