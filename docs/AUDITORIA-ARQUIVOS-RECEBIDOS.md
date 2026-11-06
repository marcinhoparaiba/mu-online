# Auditoria dos arquivos recebidos

## Escopo

Recebidos `Configs.ini` (621 bytes) e `- Deletar Logs -.bat` (234 bytes). Nenhum executável, banco, script SQL ou cliente foi entregue nesses anexos. Não foram executados. Originais preservados em `game-server/reference/`; o batch recebeu sufixo `.txt` para servir apenas como referência. Manifesto SHA-256 registra os bytes originais. Não foram encontradas senhas nesses dois arquivos.

## Configs.ini

Parece uma configuração de inicializador de serviços, não a configuração de combate ou itens do GameServer. Há seis entradas numeradas de v0v a v5v: ConnectServer, DataServer, JoinServer, ExDB, EventServer e RankingServer. Os caminhos são relativos, e cada entrada aponta a seu executável.

- O comando de DataServer contém `55960 1`.
- JoinServer contém `/p55970 /ca127.0.0.1 /cp55557`.
- O IP principal é loopback (`127.0.0.1`).
- Todas as entradas de intervalo valem `2500`; a unidade depende do inicializador, não foi verificada.
- Reinício por entrada é `no` e `AutoRestart=0`.
- **Não há entrada para iniciar GameServer.** Isso não prova que ele inexiste no pacote: somente que não está listado neste arquivo.

Esses parâmetros não foram aplicados, não são regra de firewall e não comprovam qual porta cada serviço realmente abre. Sem executáveis/documentação não é possível confirmar a versão técnica, protocolo, estrutura de itens, suporte +15 ou identidade com a base de outro servidor.

## Deletar Logs

O batch chama `del ... /q` em oito padrões: ConnectServer/Logs, DataServer/Log, EventServer/Log_Error, ExDB/Log, GameServer/Log, JoinServer/Log, RankingServer/Log_Error e RankingServer/Log_Point.

Não contém filtro por idade, arquivamento, confirmação ou verificação de backup. Os caminhos são relativos ao diretório atual; não contém `/s`, portanto não solicita exclusão recursiva. Executá-lo removeria arquivos das pastas correspondentes silenciosamente, incluindo dados úteis para diagnóstico e auditoria.

Não executar automaticamente. Uma futura rotina de retenção deve primeiro listar candidatos, conferir a raiz do servidor, arquivar registros necessários, manter logs ativos e usar política explícita de idade e retenção. Nenhum arquivo de log foi apagado.

## Próxima validação possível

Com um pacote completo autorizado, inventariar binários, bibliotecas, configurações, licença, documentação, cliente e banco em ambiente isolado. Não gerar schema SQL ou patch de cliente por suposição a partir destes dois arquivos.
