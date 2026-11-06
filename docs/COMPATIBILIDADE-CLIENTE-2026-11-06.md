# Compatibilidade estática do cliente recebido — 06/11/2026

## Resultado

Compatibilidade parcial confirmada por inspeção dos binários, sem executá-los. Não foi feita análise antivírus, conforme solicitado pelo titular. Não foi possível realizar teste de inicialização ou conexão: este ambiente é Linux sem Wine, os cinco anexos não incluem o cliente completo/assets nem os serviços do GameServer e SQL.

A ausência de teste dinâmico é uma limitação técnica desta etapa; não representa reprovação de compatibilidade.

## Verificações

| Verificação | Resultado | Evidência |
|---|---|---|
| Arquitetura cliente/plugin | Coerente | Main.exe e Customs.dll são PE32/i386 |
| Dependência do plugin | Confirmada estaticamente | Main.exe importa Customs.dll |
| Símbolo requerido | Correspondência exata | Main importa FireTeam por nome; Customs.dll exporta FireTeam, ordinal 1, RVA 0x3260 |
| Nome do arquivo de configuração | Coerente | Rotina FireTeam referencia main.lab |
| Tamanho esperado da configuração | Correspondência | DLL compara tamanho com 0x31 (49); anexo tem 49 bytes |
| Transformação da configuração | Coerente | Rotina da DLL soma 0xb7 e aplica XOR com 0xfd XOR índice para os 49 bytes; corresponde ao inverso de scripts/mainlab-config.py |
| Campos decodificados | Estrutura coerente | Host com terminação, serial imprimível de 16 bytes e terminador final |
| Correspondência INI/LAB | Divergência | Host diferente; serial igual e de preenchimento |
| Offsets e hooks do plugin | Não comprovados | Plugin escreve em endereços fixos do processo; arquitetura e exportação não validam o conteúdo esperado nesses endereços |
| Login e protocolo cliente/servidor | Não testados | Servidor, banco e par de configurações não disponíveis |
| Assets e renderização | Não testados | Cliente completo não disponível |
| Itens +15 e transparência | Não testados | Exigem execução e integração com a base exata |

## Importações do Main.exe: aprofundamento da análise anterior

O relatório AUDITORIA-ANEXOS-CLIENTE-2026-11-06.md registrou que objdump não havia exibido nomes de DLLs. A leitura manual dos descritores PE, convertendo RVAs pelos intervalos das seções, recuperou 13 descritores não nulos:

advapi32.dll, dsound.dll, gdi32.dll, glu32.dll, imm32.dll, kernel32.dll, opengl32.dll, user32.dll, version.dll, winmm.dll, ws2_32.dll, ole32.dll e Customs.dll.

O último descritor referencia FireTeam por nome. Portanto a ligação cliente/plugin não depende apenas de uma string solta. Essa leitura complementa a limitação da saída inicial do objdump; não houve alteração dos binários.

Main.exe declara ImageBase 0x00400000. Customs.dll declara ImageBase 0x10000000. A desmontagem do caminho de inicialização do plugin mostra configuração e modificações em endereços fixos do cliente; a adequação desses pontos à revisão recebida continua por comprovar em laboratório. Não foi aplicado patch.

## Configuração

O MainLab.ini usa endereço público de exemplo e serial de preenchimento. O main.lab possui outro host. Essa diferença pode indicar configuração gerada em outro momento; por si só não comprova erro de formato do LAB. O cliente usa o LAB; mudar apenas o INI não demonstra que o arquivo utilizado pelo cliente tenha sido atualizado.

Não se escolheu IP, serial ou servidor arbitrariamente. Os valores decodificados permanecem privados. Para testar conexão é necessário confirmar o destino e o serial esperado pelo servidor da mesma distribuição.

## Próximo teste funcional

São necessários:
1. Windows de teste com cliente completo e assets desta revisão.
2. ConnectServer, JoinServer, DataServer e GameServer correspondentes, com banco vazio compatível.
3. Configuração privada consistente de endereço, portas, versão e serial.
4. Registro de abertura, carregamento do plugin, seleção de servidor, login, criação/seleção de personagem e entrada no mapa.
5. Só após a entrada: inventário, +15, transparência, desconexão/reconexão e persistência.

Nenhum desses fluxos foi executado nesta etapa. Não se declara o conjunto pronto para jogar.

Identificação dos cinco anexos: hashes e tamanhos em AUDITORIA-ANEXOS-CLIENTE-2026-11-06.md. Nenhum original foi publicado ou modificado.
