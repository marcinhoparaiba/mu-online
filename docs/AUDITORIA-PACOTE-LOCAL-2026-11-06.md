# Auditoria estática do pacote local — 06/11/2026

## Base e preservação

Retomada a partir de `f7aa1e1c70483697cc8fa5cde463c2f6ece7b119`. O remoto não tinha commits posteriores no início. A cópia antiga estava em `feat/mubanned-portal`, com quatro arquivos alterados/não rastreados. Ela não foi atualizada nem sobrescrita. Foram salvos ZIP da árvore de trabalho e bundle do Git em diretório privado fora dos projetos; uma nova cópia da main foi usada nesta etapa.

Não havia AGENTS.md ou CLAUDE.md no remoto nem nas pastas do pacote na verificação. AGENTS.md foi criado pelo Trail local e complementado com as restrições vigentes. A indexação foi local, sem uso de modelo pago ou upload do pacote.

## Escopo e método

Inspeção de nomes, tamanhos, SHA-256, cabeçalhos PE e XML dos projetos. Nenhum EXE/DLL do pacote foi iniciado ou carregado. Não executados o batch de limpeza, arquivos REG, atalhos, inicializadores, comandos MSBuild ou ferramentas SQL do pacote. Não houve alteração no antivírus, importação de banco, publicação ou compra.

O inventário privado, com nomes e hashes, e o backup do material legível ficam fora do repositório. Não publicar esses arquivos: o pacote inclui binários, configurações e backups de banco não classificados quanto a dados pessoais. O ZIP do material legível passou verificação CRC e comparação SHA-256 de cada entrada com o inventário. **Esse backup é parcial:** um Launcher.exe não pôde ser lido (errno 22), ficando explicitamente excluído. O primeiro acesso a Client/Main.exe também falhou; na inspeção final não havia executáveis na raiz de Client. Não foi determinada a causa da mudança/indisponibilidade e não se tentou contorná-la.

Snapshot final: 4.150 arquivos, 275.950.744 bytes; um arquivo com erro de leitura. As contagens iniciais diferiram do snapshot final; portanto não tratar a pasta de origem como imutável. Repetir inventário em um snapshot estável antes de qualquer compilação ou teste de compatibilidade.

## Source

Cinco soluções: DataServer, GameServer, JoinServer, Main e GetMain. Os projetos principais geram plugins/DLLs; isto não comprova a presença do código completo dos executáveis proprietários de servidor/cliente. Há arquivos de compilação antiga (OBJ/PCH/PDB/TLOG), não utilizados.

Todos os cinco VCXPROJ pedem `v141` e SDK `10.0.22621.0`, em Win32. DataServer e JoinServer usam Application no Debug e DynamicLibrary no Release: revisar antes de escolher configuração. Soluções têm marcadores de Visual Studio 2010/2017; isso não identifica o protocolo do jogo.

`Main/Customs/Customs.vcxproj:110–112` possui pós-build com xcopy para a área de trabalho de outro computador. Não foi executado. Uma futura cópia de trabalho deve remover/desativar esse evento e direcionar toda saída para o laboratório, antes de invocar MSBuild. Não retargetar projetos originais automaticamente.

Máquina: Visual Studio 2022 Build Tools 17.14, MSVC 14.44.35207 e SDK 10.0.26100.0 encontrados. v141 e SDK 22621 não foram encontrados no inventário das instalações. A ferramenta MSBuild não aparecer no PATH não significa que não esteja instalada; o problema verificado é o desencontro de toolset/SDK.

Bibliotecas: existe detours.lib no pacote e cabeçalho Detours; sua procedência/licença e correspondência com o compilador ainda precisam ser verificadas. GetMain inclui ThemidaSDK.h. Não executar nem baixar protetores de executável para resolver dependências.

## Versão e compatibilidade

Os PE legíveis de GameServer, GetMainLab e Customs são x86. O plugin Main escreve em endereços fixos e instala hooks; exige correspondência exata com o executável base. `Main/Customs/DllMain.cpp` inicializa a DLL ao carregá-la: apenas carregar a DLL já executaria código, o que não foi feito.

Comentários de GetMain citam GameServer 1.00.18 e cliente 1.1.46/1.1T+, enquanto o pacote é anunciado como 97D custom. Esses comentários podem ter sido reaproveitados: não confirmam nem invalidam isoladamente a versão. **A versão técnica e a compatibilidade cliente/servidor permanecem não verificadas**, especialmente sem Main.exe legível e estável.

`GetMainInfo/GetMainLab.cpp` declara configuração com IP de 32 bytes e serial de 17 bytes, total de 49 bytes. Client/main.lab também tem 49 bytes. Isso é uma correspondência de tamanho, não valida o segredo, versão ou compatibilidade. Nenhum IP/serial/senha foi incluído no relatório.

## Itens, classes e renderização

`GameServer/DarkPlugin/Corrections.cpp:174–179` contém patches comentados para itens +14/+15. `Character.cpp` conta equipamentos até +15. São evidências de intenção/suporte parcial, não de serialização, persistência, protocolo, inventário e editor reais funcionando.

`Character.cpp:487` tem condição `Level13Count == 5 || (Level13Count + Level14Count + Level15Count)` sem comparar a soma com 5. Registrar como candidata a erro lógico de bônus, sem alterar o fonte privado antes de testes reproduzíveis.

`Main/Customs/Effect.cpp` usa alpha e hooks de efeitos, mas não foi comprovado o limiar de transparência +12..+15. O uso de ponteiros fixos e indexação de efeitos exige revisão de limites antes de uso. Não transplantar offsets de outra versão.

Decisões preservadas: BK, SM, ME e MG, sem DL; editor comum +0..+15; normal até +11, transparente +12..+15; exclusivos bloqueados. Sets 01..09 são coleções. Não inferir fórmulas PvP do MuAwaY. O emblema de staff é requisito futuro, sem implementação no jogo nesta etapa.

## MuServer, SQL e GetMainLab

MuServer contém executáveis, configurações, arquivo de limpeza, arquivos de registro ODBC e dois arquivos em DB chamados MuOnline e Ranking, sem extensão. Ambos começam com `TAPE` (formato compatível com backup SQL Server). Não são scripts SQL legíveis; não comprovam versão, schema, procedures, permissões ou ausência de dados reais.

Não foram encontrados scripts .sql no inventário. Não encontrados sqlcmd no PATH nem serviços SQL pelo inventário local. Não foi feita conexão a instância, RESTORE HEADERONLY, restauração ou importação de DSNs/REG. Dados dos backups são desconhecidos: a próxima etapa precisa de schema/DDL sanitizado ou de procedimento aprovado que assegure ausência de banco real de jogadores.

GetMainLab contém EXEs/DLL, INI e main.lab. Foi somente inventariado; sua operação não é necessária para a inspeção estática e não foi iniciada.

## Licença e próximos passos

Não foi encontrada licença geral de redistribuição do pacote. Cabeçalhos citam LABMU/WEBZEN e há dependências de terceiros. Disponibilidade da pasta não concede autorização para redistribuir binários, fontes ou assets. Nenhum desses materiais foi enviado ao GitHub.

Bloqueios para compilação/execução: executável base do cliente ausente/ilegível; toolset/SDK divergentes; fontes parciais com offsets fixos; condições de licença e dependências não verificadas; schema e dados SQL desconhecidos. Não criar uma VM conectada à rede ou importar banco para tentar resolver isso às cegas.

Próxima etapa: obter pacote estável e proveniência/condições de uso; conferir hashes do Main e do GameServer; confirmar o par exato de versão/protocolo; revisar todos os eventos/imports de build numa cópia privada; decidir toolset original ou retargeting testado; obter DDL vazio sanitizado. Só então preparar VM sem acesso ao banco real, serviços em loopback/rede privada, snapshots e credenciais sintéticas.

## Verificação da etapa web independente

`npm run check` e `npm test` passaram: oito testes Node. Foi corrigida a conversão de file URL Windows e o teste usa junction em Windows para verificar rejeição de backup dentro do projeto. Nenhuma regra de backup foi enfraquecida.

`python -m unittest discover -s tests -p test_package_audit.py -v`: três testes passaram, cobrindo cabeçalho PE malformado, preservação/ausência de conteúdo privado no inventário e rejeição de saída dentro do pacote. O utilitário recusa sobrescrever inventário existente e nunca executa os arquivos examinados.
