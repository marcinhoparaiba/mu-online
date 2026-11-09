# MuBanneD 5.2 com Dark Lord

Esta pasta reúne o cliente e o servidor do 97d+5.2 GBS Premium e o primeiro lote importado do 97d+3.0 e do OBBY. A instalação original do MuBanneD e os RARs de origem ficam fora desta pasta.

O [estado da integração](Integracao/ESTADO.md) registra o que foi importado e testado.

## Entrar no teste local

Execute Instalar-MuBanneD.cmd para criar ou atualizar o atalho MuBanneD 5.2 na Área de Trabalho. O instalador usa o jogo desta pasta. Abra o atalho para iniciar ou reaproveitar o servidor local e abrir o cliente. Se o SQL estiver parado, o Windows poderá pedir elevação. Selecione a SalaTrade. A conta de teste é marcio, com MarcioBK e MarcioDL, ambos GMs. O banco MuBanneD52Integrado e o DSN de mesmo nome já foram configurados neste PC.

Comandos confirmados na SalaTrade com os dois personagens:

- /trace NomeDoPersonagem procura o alvo para teleporte. O teste verificou a resposta para um alvo offline.
- ! Mensagem, /notice Mensagem e /gmpost Mensagem foram aceitos como anúncios na sala de teste. O alcance entre salas ainda precisa de verificação.

## Preparação do SQL em outra instalação

1. Inicie a instância local do SQL Server. A instância usada neste PC é MUBANNEDTEST.
2. Restaure o arquivo Database/MuOnline.bak da pasta do servidor em um banco de teste separado, usando a opção MOVE para os arquivos de dados e log. Use o nome MuBanneD52Integrado e evite substituir bancos existentes.
3. No Administrador de Fontes de Dados ODBC de 32 bits, crie um DSN MuBanneD52Integrado apontando para o banco restaurado. Teste a conexão e ajuste a autenticação nos arquivos DataServer.ini e JoinServer.ini conforme sua instância.
4. Inicie ConnectServer.exe, DataServer.exe e JoinServer.exe em suas respectivas pastas. Para começar, use o GameServer da SalaTrade, na pasta Salas/SalaTrade/GameServer. O arquivo nessa sala se chama GameServer-Upar.exe no pacote, mas a configuração usa o código de sala 20 e a porta 55940.
5. Abra mu.exe na pasta 2 - Cliente. Confirme a lista local, entre com uma conta de teste e verifique a criação de um Dark Lord com uma conta que cumpra o requisito de nível.
6. Para os itens adicionados, valide nome, visual, equipamento e persistência após sair e entrar novamente. Os registros foram adicionados com drop aleatório desativado para o teste inicial.

As ferramentas e os arquivos de configuração originais do 5.2 acompanham a base. Use o executável mu.exe na pasta do cliente para o teste local.
