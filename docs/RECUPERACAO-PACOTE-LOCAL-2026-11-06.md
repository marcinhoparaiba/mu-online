# Localização e extração do pacote — 06/11/2026

## Material localizado

Na pasta acima de Nova pasta foram encontrados FIRETEAM - 97D.rar, MuServer.rar, Cliente 97d KrovaX.rar e uma segunda pasta MuServer. Os três arquivos compactados foram copiados para armazenamento privado fora do Git e conferidos por SHA-256 contra os originais. O conteúdo não foi publicado.

A senha fornecida pelo titular abriu FIRETEAM - 97D.rar. Ela não foi registrada em arquivo ou no Git. Os outros dois RARs rejeitaram a senha (UnRAR exit 11); aguardam informação do titular. O Windows tar listou os arquivos, mas não pôde extrair dados RAR criptografados. O WinRAR/UnRAR já instalado foi usado somente para extração, nunca para abrir o jogo.

FIRETEAM foi extraído em diretório novo privado, sem sobrescrever as cópias anteriores. Traz Source, Client, GetMainLab e MuServer. O snapshot registrou 4.152 arquivos e 286.203.040 bytes, incluindo três arquivos que tiveram leitura bloqueada. O índice inclui Client/Main.exe e GetMainLab/Main.exe, ambos com 5.126.148 bytes. A igualdade de tamanho não comprova que sejam binários idênticos: não foi possível obter hash ou validar o PE desses arquivos.

## Bloqueio confirmado pelo sistema

A consulta somente de leitura ao Microsoft Defender encontrou detecções com ação bem-sucedida nos dois Main.exe e em MuServer/Utilitários/Criar Launcher/Launcher.exe. Nome da detecção: **Trojan:Win32/Phonzy.A!ml**. As detecções também explicam a indisponibilidade das cópias originais examinadas na etapa anterior. A classificação é do Defender; não foi feita análise dinâmica independente.

Os arquivos estavam listados após extração, mas ficaram indisponíveis durante a leitura e não estavam mais na pasta ao final. A proteção não foi desativada; não foram criadas exclusões, restauradas quarentenas, tentadas novas extrações para driblar o bloqueio ou iniciados binários. O relatório anterior de causa não determinada fica atualizado por esta evidência posterior.

**Compatibilidade do cliente continua bloqueada.** A existência do arquivo dentro do RAR não o torna utilizável nem autoriza ignorar a detecção. A próxima etapa precisa de procedência e cópia validada do cliente ou de reconstrução a partir de fonte auditável e dependências confiáveis, além dos requisitos de licença e toolset já documentados.

GameServer.exe legível: PE x86. O hash foi registrado no inventário privado. Isso não comprova segurança, versão/protocolo ou compatibilidade com o Main.

## Cópias privadas e consultas SQL

Foram copiadas e conferidas por hash as pastas já extraídas, sem alterar suas fontes: Source (463 arquivos), Client (3.499), GetMainLab (4), MuServer original (182) e MuServer alternativo (273). Nenhuma falha de leitura ocorreu nessas cópias, que já não continham os executáveis removidos pela proteção. Não misturar os conjuntos: similaridade de nomes não confirma mesma distribuição.

Na pasta MuServer alternativa há Querys/Extwarehouse.txt, Procedure.txt, Tabelas.txt e warehouse.txt. A inspeção textual identificou CREATE TABLE, CREATE PROCEDURE, INSERT, DELETE e ALTER. São consultas SQL apesar da extensão .txt. Não foram executadas ou importadas e não constituem ainda um schema completo, compatível ou sanitizado. Nenhum conteúdo/valor de configuração, banco ou consulta privada foi enviado ao GitHub.

Os manifestos completos, cópias e logs de extração ficam somente na área privada local. O backup desta etapa contém os RARs originais verificados, mas não se deve afirmar que há uma cópia extraída utilizável do Main. Pedidos de outra senha permanecem independentes da auditoria do FIRETEAM.

## Continuidade

Preservar site, intro, loja, fórum, classes BK/SM/ME/MG sem DL e todas as decisões de edição e transparência. Não iniciar serviços do pacote nem banco de jogadores. Resolver proveniência/licença, detecções, versão do executável base e dependências antes de compilar ou preparar execução isolada. Toolset v141/SDK 22621 ainda não encontrados na instalação auditada. Não é necessário desativar a proteção para continuar a leitura dos fontes e a evolução independente do site.
