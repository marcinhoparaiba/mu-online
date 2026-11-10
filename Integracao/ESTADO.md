# Estado do MuBanneD 5.2 (atualizado 09/11/2026, sessão Claude)

Abrir sempre por `Integracao\Abrir-Jogo.ps1` (atalho "MuBanneD 5.2"). Ele sobe SQL, ConnectServer, DataServer, JoinServer e os 2 GameServers, ajusta o IP e dá foco ao jogo.

## Rede e cliente
- O cliente recusa 127.0.0.1. `ajustar_ip.py` grava o IP da rede (hoje 192.168.0.2) no `Configs.gbt` (XOR f29554; IP [32:64], porta [64:66]) e no `ConnectServer\ServerList.dat`.
- O crash SDL2+e1ea8 (c000041d) só acontece no fechamento (SDL_DestroyWindow), é sintoma. O Mesa3D foi removido (lento e não era a causa) e está em work\mesa-removido.
- O registro `HKCU\Software\Webzen\Mu\Config` usa Resolution=8 (1920x1080) e WindowMode=0. Os índices são 0/1=800x600, 2=1024x768, 3=1280x960, 4=1360x768, 5=1440x900, 6=1600x900, 7=1680x1050, 8=1920x1080.
- Tela preta em tela cheia (driver Intel HD 2500): o launcher simula Alt+Tab.
- O Print do Win11 (Ferramenta de Captura) fecha o jogo. O usuário desligou a opção no Windows.

## Servidores
- SalaTrade (código 20, porta 55940): servidor normal com PvP e sem monstros nos mapas de caça (linhas `//SPOT` nos spawns). Tem a arena de Lorencia.
- SalaUpar (código 40, porta 55920): SPOT com monstros e NonPK=1.
- Arena: Lorencia Degelo (pacote 07). O PvP vale só no cercado x139-148, y123-132 (bit safe limpo no Terrain1.att do servidor e no EncTerrain1.att do cliente). O boneco é o monstro 16 (100M HP, sem ataque), spawn em (144,128). Os arbustos da arena foram tirados do EncTerrain1.obj.
- PvP: DK e DL com DamageRatePvP=140, as outras classes continuam baixas (`GameServerInfo - Character.dat`, backup em work\Character.dat.antes-pvp).
- Comandos: ver [COMANDOS.md](COMANDOS.md). O /zen e outros foram ligados, e os personagens do marcio, marcio2 e teste são GM (Data\Util\GameMaster.txt).

## Itens
- Lotes 1-3 integrados (2.226 IDs por sala). 40 peças nativas do OBBY (ex.: Titan 8:45) foram registradas no LoadItens.lua, porque estavam invisíveis no inventário.
- 51 asas e capas novas foram registradas no CustomWings.lua (cliente) e no CustomWing.txt (3 salas). Antes o lobby mostrava a asa errada.
- As cores do LoadItem foram todas padronizadas em -1,-1,-1 (antes eram RGB aleatórias).
- 15 tamanhos de item servidor x cliente foram igualados. 120 itens de outras seasons sem cadastro no cliente foram desativados com `//REMOVIDO` no Item.txt (lista em work\removidos-119.json).
- Os Lua do cliente são criptografados: header de 52 bytes + XOR com work\lua-codec-key.bin ^ ((i-0x56)&255). A versão decriptada fica em `3 - Ferramentas\...\Decrypted`.

## Personagens (todos lvl 400, 32767 stats, itens +15 exc)
- Conta marcio: MarcioBK, MarcioDL (cavalo e corvo equipados, pet info nível 50), MarcioSM, MarcioElf, MarcioMG.
- Conta marcio2: MarcioSU. Conta teste: TesteDL. A senha da conta teste está em senha-conta-teste.txt (fora do git).
- O cliente aceita até 10 personagens (MAX_CHARACTER_LIST=10). A tabela AccountCharacter.MaxCharacter=5.

## Pacotes instalados (backup em work\antes-packs)
- 08 Interface Legends, 10 MenuBar (Versão 2), 07 Lorencia Degelo. O 02 Lorencia Abismo não foi instalado: 224 células do att divergem entre cliente e servidor.

## Pendências e limites
- Não testado em jogo: o acesso de controle à janela foi negado. Falta conferir trade, skills, M (nomes dos mapas não aparecem; possivelmente a interface Legends) e itens novos.
- Exigem fonte do mu.exe: lag do Chaotic Diseier (GPU fraca), +15 transparente com opção no menu, logo da intro descentralizada, comemoração no lobby (remover a ação 207 fechou o jogo, revertido), montaria no lobby.
- Ideias: placa [PVP] e logo MuBanneD em Lorencia (trocar texturas de Sign01/bandeiras), subir MaxCharacter para 10.
- Arquivos binários (att, obj, bmd, lua criptografado, texturas) não vão para o git (.gitignore). Os backups ficam em ..\..\work.

## 10/11/2026 (madrugada)
- mu.exe aceita só 1 instância: abrir outra enquanto uma fecha => sai na hora com código 1 (não é bug do jogo).
- Atalho: escolha de modo (SemBorda recomendado / Cheia exclusiva / Janela 1600x900), lembra em HKCU\Software\MuBanneD\Modo. SemBorda = janela 1600x900 esticada para a tela, sem borda, 1px deslocada (assim o print captura OpenGL). Não testado após a escolha de modo.
- print-helper.ps1 (iniciado pelo atalho): intercepta Print (o mu.exe fecha ao receber Print), salva PNG em 2 - Cliente\ScreenShots e copia para a área de transferência; Alt+F4 fecha o jogo. Print testado: funciona.
- Lobby (CharacterList.lua do cliente): 6 lado a lado (eixo Y, 150), selecionado 1.15x, MOUNT/FLYING_ADD_SIZE 0.10, ação 207 mantida (remover fechava). Original em work\antes-lobby.
- Até 6 personagens por conta, qualquer classe (proc WZ_CreateCharacter alterada; Integracao\WZ_CreateCharacter-limite6.sql).
- 16 mapas do servidor sincronizados com o cliente (work\antes-terrain). Skills 75/216 bloqueadas.
