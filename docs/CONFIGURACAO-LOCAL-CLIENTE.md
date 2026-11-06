# Preparação local — cliente e limites do servidor

Destino escolhido pelo titular: teste local no próprio PC Windows.

## Cliente

scripts/configure-client-local.ps1 prepara IPaddress=127.0.0.1 e gera main.lab correspondente ao serial presente no MainLab.ini. Faz backup dos dois arquivos antes da troca e tenta restaurá-los em caso de erro na gravação. Não executa GetMainLab.exe, Main.exe ou a DLL; não muda SQL, serviços ou firewall.

Com o cliente fechado, baixe o script do repositório e execute no PowerShell, usando o caminho real da pasta do cliente completo:

```powershell
.\configure-client-local.ps1 -ClientPath "C:\CAMINHO\DO\CLIENTE"
```

O caminho é um exemplo; a pasta correta é a que contém MainLab.ini. Não há instrução para desativar proteção ou alterar a política de execução.

O serial dos anexos é preenchimento; o script preserva o valor e informa a pendência. É necessário obter o serial correto da configuração do GameServer da mesma revisão, ajustar o INI privadamente e gerar novamente. Não publicar serial real.

127.0.0.1 vale somente para cliente e servidor no mesmo PC. Não é configuração para outro PC da rede.

## Verificação realizada neste ambiente

A preparação em Python produziu LAB de 49 bytes para loopback, preservando o serial recebido. O retorno da transformação reproduziu exatamente host, preenchimento e serial. O INI preparado usa o mesmo host e serial. Originais dos anexos não foram modificados.

O PowerShell foi revisado estaticamente, mas não executado: este ambiente não tem Windows/PowerShell nem o pacote completo. Não afirmar que a configuração foi aplicada no PC do titular.

## Servidor e banco: ainda não configurados

Os cinco anexos contêm apenas Main.exe, Customs.dll, GetMainLab.exe, MainLab.ini e main.lab. O RAR maior não pôde ser transferido pelo limite de 32 MiB. Não existem aqui os arquivos de configuração reais de ConnectServer, JoinServer, DataServer, GameServer, EventServer e RankingServer, nem schema SQL base validado.

Para concluir, são necessários os arquivos reais de configuração da distribuição, incluindo os caminhos documentados:
- ConnectServer/Data/BoR_ServerList.dat
- GameServer/Data/Settings.txt
- EventServer/Data/SvConfig.ini
- RankingServer/SvConfig.ini
- configurações de JoinServer e DataServer, DSNs e schema vazio compatível.

Enviar cópias sem senhas e sem dados de jogadores; preservar campos e seções para revisão. Não misturar arquivos de outra base. Com isso será possível preparar as alterações concretas de conexão, nomes dos bancos, DSNs e portas. As portas mencionadas no guia histórico não foram assumidas como configuração atual.

Nenhum GameServer foi iniciado e nenhum login no jogo foi realizado. A preparação do cliente não equivale à configuração de todo o servidor.
