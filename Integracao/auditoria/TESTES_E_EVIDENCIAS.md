# Testes e evidências (bot de protocolo, conta marcio = GM, não ADM)

| Teste | Resultado |
|---|---|
| /editor 0 244 15 (BanneD, donate) | "Item de DONATE: só a conta ADM." OK |
| /editor 0 176 15 (Gold, evento) | Pediu justificativa. OK |
| /justificar curto | "Justificativa muito curta". OK |
| /justificar premio do mata-mata… | Item criado e gravado no EditorLog (linha de teste apagada depois). OK |
| /make e /drop pelo GM | "Criar item: use o Editor (tecla D)". OK |
| /editor 0 511 (item inexistente) | "Item inválido". OK |
| /editor 14 13 (Bless) e set Bronze | Criados. OK |
| `work\verifica_tudo.py` | Sem problemas novos: Item.txt, nomes, modelos, texturas, Lua dos arquivos alterados e log |
| Banco | Login com gm, adm ou banned bloqueado pelo trigger (teste "testegm1" recusado) |

**NÃO TESTADO**, porque exige a tela do jogo:
- janelas do editor (D) e do lobby;
- cores e brilhos;
- pets montados;
- FPS e resoluções.
