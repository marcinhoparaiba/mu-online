# Auditoria MU BanneD — 12/11/2026

**Escopo inspecionado:**
- Servidor: as 3 salas, Item.txt, scripts Lua e logs.
- Cliente: Lua cifrado, modelos BMD e texturas em Item/ e Player/, nomes de itens.
- Banco: SQL Express MUBANNEDTEST.
- Ferramentas próprias: editor, lobby, loja web e scripts de recoloração.
- Git: branch mubanned-5.2, último commit 89216d0. Há mudanças não commitadas. O ponto de recuperação são os backups em `work\antes-*`; o Git não foi alterado.

**Fora do escopo (NÃO TESTADO):**
- Tudo que exige ver a tela do jogo: o visual, a interface, FPS e resoluções.
- Launcher de atualização: não existe.
- Teste de carga com muitos jogadores.
- Fuzzing de pacotes.

**Ferramentas usadas:**
- Scripts Python: `work\verifica_tudo.py`, `work\verifica_visual.py` e `work\cores_itens.py`.
- Bot de protocolo: `work\test_editor.py`.
- Renderizador de BMD: `work\render_asas.py`.

**Resumo:** 10 defeitos confirmados e corrigidos, 4 pendentes ou suspeitos, e a parte visual sem teste. Detalhes nos outros arquivos.
