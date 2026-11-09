# Estado do MuBanneD

- Base local 97d+5.2. Servidor e cliente usam localhost. A SalaTrade foi validada pelo protocolo do jogo.
- Os 1.800 IDs do 5.2 estão preservados. Entraram 312 itens do 3.0 e 47 do OBBY no lote 2, e 67 asas do grupo 12 no lote 3 (48 do 3.0, 19 do OBBY). Há 2.226 IDs por sala.
- Login, entrada no mapa e comandos de GM foram verificados com MarcioBK e MarcioDL. Criação de um novo DL pela interface, renderização e persistência dos itens importados ainda precisam de teste.
- Pendências: 845 IDs sem importação e 972 com nome igual a conferir. A criação via /make não persistiu no teste. Mapas, eventos e sistemas dos doadores seguem pendentes. Use [itens adicionados](itens-adicionados.csv) ou filtre o [mapa de origem](mapa-catalogos.csv).

- Lote 3 (09/11/2026): os modelos dos grupos 12-15 foram extraídos do main.exe dos doadores (work/model_map_12_15.json) e das asas WingNNN do 3.0. O script é work/merge_mu_batch3.py e o backup fica em work/mu-antes-lote3. As asas ainda não foram vistas no jogo. Ficaram de fora as Seed Spheres (sistema de soquetes) e os pets, brincos e amuletos personalizados do 3.0, que não têm modelo identificável.
