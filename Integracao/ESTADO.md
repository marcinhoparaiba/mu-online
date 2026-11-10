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

## 10/11/2026 (sessão 2)
- SemBorda testado: ok. print-helper agora acha o mu pelo nome (antes saía se o PID sumisse); falta testar Print.
- Fenrir no lobby aparece sem montar: é do mu.exe, o Lua não controla.
- Logo: Integracao\logo\gerar_logo.py -> logo-mubanned.png. Alvos em Data\Object1: notice.OZJ (placa), badge_02/03.OZT (bandeiras). OZJ = 24 bytes de header + JPG; OZT = 4 bytes + TGA.
- Ferramentas em Downloads\packs mu (senha dos rar: aprendizmuonline). BmdDecoder só trata BMD de texto. Blender instalado (winget). Próximo: conversor BMD<->Blender próprio e set base.
- Espada Monarch: 0:244 'Monarch Sword' (Integracao\bmd: bmd.py codec 0x0A, glb2bmd.py; work\add_monarch_item.py registra; backup work\antes-MonarchSword).
- Kit Monarch estático: 2:233 Mace, 2:234 Hammer, 4:226 Bow, 5:242 Staff, 6:250 Shield, 13:430 Ring, 13:431 Pendant. MarcioBK equipado (espada, escudo, pingente, 2 anéis). Falta: asas, capa, águia, sets M/F (precisam esqueleto).
- Kit completo registrado: 12:332 Wings, 12:333 Cape, set M 7-11:271 (base Hades), set F 7-11:272 (base Nature). Águia: modelo do Icon_Eagle_Hawk (13:420) trocado (original em work\antes-MonarchEagle). BK com set M + asas. Rig: Integracao\bmd\rig.py (pesos/animação copiados do modelo base). Efeitos e Coroa: exigem fonte do mu.exe.
- Águia Monarch = pet 13:277 (DarkSpirit.lua, voa e fica no braço; base corvolighthawk). Icon_Eagle_Hawk restaurado.

## Checklist para item novo (aprendido 10/11)
1. Modelo: Integracao\bmd (glb2bmd.py estático; rig.py copia esqueleto/animação de um modelo base; bmd.py lê 0x0A/0x0C).
2. Registro: work\add_monarch_item.py (Item.txt das 3 salas, item_*.bmd de nomes, LoadItens.lua criptografado). Sets: DEST=Player.
3. Asa/capa: também CustomWings.lua + Data\Custom\CustomWing.txt (feito pelo script).
4. Pet voador (águia/corvo): DarkSpirit.lua (work\add_darkspirit.py) + Data\Item\PetItemOption.txt (índice 512*13+id). Sem o PetItemOption o servidor apaga o item.
5. Reiniciar os GameServers depois de mexer no Item.txt (o atalho só sobe o que está parado).
6. Mexer em inventário pelo SQL só com o personagem deslogado, porque o servidor grava por cima ao sair.
7. Item no inventário: 16 bytes; byte0 = id&255, byte7 bit 0x80 = id>=256, byte9 = grupo<<4.
- 10/11 01:40: mu.exe fecha (código 1) em modo janela/SemBorda; tela cheia abre. Suspeita: GpuPreference=2 (Alto desempenho) para mu.exe em HKCU\Software\Microsoft\DirectX\UserGpuPreferences. Spirit BanneD equipada no DL (slot 1), PetItemOption 6933 nas 3 salas; falta conferir em jogo. Brave com aba de ferramentas MU não é a causa.

## 10/11/2026 (sessão 3)
- Abrir-Jogo testado nos 3 modos: SemBorda (sem título, 1920x1080), Janela e Cheia abrem; Print salva PNG com imagem; Alt+F4 fecha. A barra de tarefas ficava por cima no SemBorda: agora a janela é TOPMOST. Modo padrão salvo: SemBorda.
- Efeitos: dá para pôr pelo Lua (EffectSystem\CharacterEffectItens.lua, CUSTOM_EFFECT_INFOS por osso). Asa 12:332 (ossos 11-30) e capa 12:333 (ossos 2-12) com brilho dourado 32002 (work\add_monarch_effect.py, backup work\antes-efeito-monarch). Falta ver em jogo.
- MarcioBK conferido no banco: espada 0:244, escudo 6:250, set M 7-11:271, asas 12:332.
- Kit Monarch invisível no BK (asa quebrada): modelos com ~20 mil vértices. Integracao\bmd\weld.py junta vértices repetidos (3.4k). Originais em work\antes-weld, soldados em work\antes-weld-welded (aplicados). Falta ver em jogo.
- mu.exe saindo com código 1 = duas aberturas ao mesmo tempo. Abrir só uma.
- 10/11 ~08h: código 1 em modo janela/SemBorda (qualquer resolução) mesmo com Lua e BMD originais; tela cheia abre (com os BMD soldados também). Não é o kit Monarch. Padrão do atalho trocado para Cheia. Causa da janela ainda aberta (Windows mudou algo ~07:15?).
- Set Monarch sumia do BK: no Item.txt o set M só aceitava 1 classe (o servidor tirava as peças). Agora M = DW/DK/MG/DL/SU e F = Elf/SU (3 salas). BK re-equipado no banco com 7-11:271 +15 exc full; GameServers reiniciados. Asa/capa voltaram ao modelo original (o weld piorou); set M/F continua soldado. Modo janela: crash às 07:15 e desde então código 1; após o reboot das 07:01 funcionava. Provável: reiniciar o PC resolve. Atalho em Cheia até lá.
- Itens full (+15, skill, luck, +28, exc completo; asas sem mexer no exc) em inventário e baú de marcio/marcio2/teste: work\full_itens.py (com GameServers parados).

## 10/11/2026 tarde
- Limite 4 personagens/conta (proc + CharacterList MAX=4); lobby centralizado por quantidade (LobbyPosY 18570, espaco 500, escala 1.15, camera no do meio).
- Contas: marcio/teste com BK,DL,SM,Elf; marcio2 com MG,SU,TesteMG,TesteSU. Conta teste com kit BanneD (ex-Monarch) +15.
- Itens Monarch renomeados BanneD (servidor e item_*.bmd). PartyMaxMembers 9->5 (UI do cliente mostra 5).
- Nao existe sistema de casamento neste servidor. Trade/party/guild nao testados em jogo: o mu.exe so aceita 1 instancia por PC.
- Teste automatico: config.ini [AutoLogin] (deixar vazio no fim); conta teste/abc123.
- 2 clientes no mesmo PC: a trava do mu.exe e pelo titulo da janela; renomear a janela da 1a (SetWindowText) permite abrir a 2a (scratchpad dois.ps1). Conta marcio2 senha de teste abc123.

- 10/11: SalaTrade tinha ServerName=SPOT (corrigido p/ PVP). Mensagem 902 faltava no Message.txt (aparecia 'Could not find message 902' ao pedir trade); adicionada. Clique automatizado no MU so funciona com foco via SetForegroundWindow (scratchpad clk.ps1). Teste por bot (work\test_mu52_trade.py adaptado): login e entrada no mapa das 2 contas OK; trade e party sem resposta do servidor ao bot - falta testar com 2 clientes reais.

- 10/11: brilho excellent/ancient pintava os itens custom de roxo. Cliente: Data\Configs\Lua\Configs\DisableExcellent.lua (e Configs\Configs) agora lista 1168 itens custom (sec 0-11, idx>=60; linhas '-- MUBANNED'). Asas (sec 12) NAO podem entrar: fecha o jogo no lobby. Backup original: work\antes-disableexc. O jogo so carrega com a janela em primeiro plano.

- 10/11 varredura: codigos das salas trocados (SalaTrade=40/PvP no grupo TRADE+BAU; SalaUpar=20/SPOT no grupo UPLEVELSPOTS) em Common.dat, ConnectServer\ServerList.dat e MapServerInfo.dat (backups .antes-swap); rotulo cliente 'Sala Spot-1(Nao-PvP)'. Banco: criada CentralDevices e colunas Character EventosTotal/Honra/Quiz/TradeWins/WarKill; TradeWins premio GlobinPoint->GoblinPoint. Lobby: SetTargetCharacter voltou a usar o personagem clicado (antes era o do meio). CheckSumTime Error nos logs = bots de teste, nao bug.
