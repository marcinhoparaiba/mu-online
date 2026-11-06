# Complemento do guia recebido por capturas — 06/11/2026

As duas capturas fornecidas pelo titular descrevem instalação e inicialização do pacote. São instruções do fornecedor, não prova de que os serviços estejam instalados ou ativos.

## Inicialização do cliente local

O guia informa que o Main necessita de launcher ou parâmetros no atalho. Para cliente e servidor no mesmo PC, a forma indicada se traduz em:

```text
"C:\CAMINHO\DO\CLIENTE\Main.exe" /u127.0.0.1 /p44405
```

O caminho deve ser substituído pelo real. A porta 44405 foi obtida do guia; ainda precisa corresponder à configuração real do ConnectServer.

scripts/create-client-local-shortcut.ps1 cria MU-Banned-Local.lnk, com o diretório de trabalho igual à pasta do cliente. Não executa o Main, não sobrescreve atalho existente e permite informar outra porta. Rodar no Windows:

```powershell
.\create-client-local-shortcut.ps1 -ClientPath "C:\CAMINHO\DO\CLIENTE"
```

Complementa scripts/configure-client-local.ps1, que prepara INI e LAB para loopback. Nenhum dos scripts foi aplicado ao PC do titular nem testado em Windows neste ambiente.

## Requisitos de servidor confirmados apenas pelo texto do guia

- Pasta esperada C:\MuServer.
- Bancos MuOnline e Ranking.
- DSNs MuOnline, MuOnlineJoinDB, USELOG, DEVILSQURE_RANKING e Ranking. O mapeamento completo DSN/banco não aparece nas capturas; não deve ser inventado.
- Referências de configuração: ConnectServer/Data/BoR_ServerList.dat; EventServer/Data/SvConfig.ini; GameServer/Data/Settings.txt; RankingServer/SvConfig.ini.
- O guia cita 44405 e 55901; protocolo e endereços de bind precisam ser conferidos nos arquivos reais. Nenhuma regra de firewall foi aplicada.
- A recomendação de SQL Server 2008 R2 no guia é histórica. A compatibilidade com o Windows do titular não foi comprovada; ver REQUISITOS-SQL-DO-PACOTE.md.
- O guia lista credenciais de exemplo e conta de teste. Esses valores não foram reproduzidos nem tratados como credenciais válidas.

## O que permanece necessário

As capturas esclarecem o procedimento, mas não contêm os arquivos de configuração nem schema. Ainda é necessário receber as configurações reais do MuServer, sem senhas, e schema vazio compatível para preparar o servidor concreto. Não houve restauração de bancos, execução de LAB Start, abertura do jogo ou teste de login.
