# Requisitos SQL informados pelo autor do pacote

Guia fornecido pelo usuário em 06/11/2026, conferido por inspeção estática. É uma referência de instalação da distribuição, não autorização para executar seus binários, abrir portas ou restaurar bancos de jogadores. Credenciais de exemplo do guia foram omitidas.

## Mapa recebido e conferência local

- Versão indicada pelo guia: SQL Server 2008 R2 Developer Edition. Isso identifica a expectativa do autor; a versão interna dos arquivos de backup ainda não foi consultada em SQL.
- Bancos indicados: MuOnline e Ranking. Existem dois arquivos de backup com esses nomes e assinatura TAPE, sem schema validado.
- DSNs pedidos no guia: MuOnline, MuOnlineJoinDB, USELOG, DEVILSQURE_RANKING e Ranking. Os dois arquivos REG encontrados mencionam apenas MuOnline, MuOnlineJoinDB e USELOG. Não afirmar que importar os REG configure todos os cinco. Não foram importados.
- A arquitetura x86 dos serviços observados exige revisar os DSNs na visão correta do ODBC, mesmo em Windows x64. A compatibilidade do driver e sua configuração ainda não foram testadas.
- Existem os caminhos de configuração indicados: ConnectServer/Data/BoR_ServerList.dat, EventServer/Data/SvConfig.ini, GameServer/Data/Settings.txt e RankingServer/SvConfig.ini. A grafia CoonecServer do guia é um erro textual; a pasta existente é ConnectServer.
- BoR_ServerList.dat contém referência a 55901. O guia também cita 44405. São portas declaradas pela distribuição, não evidência de serviços ativos ou recomendação de exposição. Nenhuma regra de firewall foi criada.
- O guia descreve geração de main.lab e inicialização por ferramentas/atalho. Nada disso foi executado; os arquivos identificados pelo Defender continuam bloqueados. Não usar atalhos para contornar a detecção.

## Compatibilidade e plano de laboratório

A Microsoft registra o SQL Server 2008 R2 como fora de suporte; a matriz oficial não suporta essa versão no Windows 10/11. Não instalar diretamente no host moderno seguindo um tutorial antigo. Um eventual laboratório de compatibilidade deve ser separado, sem acesso ao banco real e sem publicação, depois da revisão dos binários e licenças. Não foi contratado ou instalado nenhum serviço.

Avaliar SQL suportado com schema vazio sanitizado é uma alternativa de pesquisa, não compatibilidade já demonstrada: drivers, procedures, tipos e comportamento legado precisam de testes. Não restaurar os backups recebidos antes de verificar que não contêm dados reais. As consultas .txt da pasta MuServer alternativa também precisam de revisão, sem misturar distribuições.

O link de download de terceiro informado pelo guia não foi usado para baixar ou executar instaladores. A presença de Developer Edition no tutorial não comprova a licença ou integridade de um instalador recebido.

Fontes oficiais consultadas:
- https://learn.microsoft.com/en-us/lifecycle/products/microsoft-sql-server-2008-r2
- https://learn.microsoft.com/en-us/troubleshoot/sql/database-engine/install/windows/use-sql-server-in-windows

## Material já extraído

O titular confirmou que possui o material extraído. As pastas existentes são a fonte de trabalho, incluindo a segunda MuServer e Cliente 97d KrovaX. As senhas dos RARs alternativos não são pré-requisito para continuar a inspeção dessas pastas. Não insistir na extração de arquivos já disponíveis. Isso não resolve os executáveis retirados pela proteção do Windows.
