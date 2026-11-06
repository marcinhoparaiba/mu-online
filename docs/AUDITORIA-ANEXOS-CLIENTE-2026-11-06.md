# Auditoria dos cinco anexos do cliente — 06/11/2026

## Resultado

Os cinco arquivos enviados nesta conversa foram lidos integralmente e analisados sem execução. Main.exe agora está disponível neste ambiente para inspeção; isso supera a ausência do arquivo descrita nos relatórios anteriores, mas não resolve a detecção histórica do Defender, a proveniência ou a compatibilidade.

**Situação: recebidos e inventariados; não aprovados para execução, distribuição ou integração.** Não houve teste do jogo, conexão ao servidor, reconstrução do motor, restauração SQL ou alteração do antivírus.

## Inventário SHA-256

| Arquivo | Bytes | SHA-256 |
|---|---:|---|
| Main.exe | 5126148 | f159e6bccdaef785208a8c3d05a22657093113d8624a32f472d22e869b4311ca |
| Customs.dll | 348160 | cd4d476e4c932600dc042de02238894affeb51c1af1916b5493bac5dc81085c7 |
| GetMainLab.exe | 122368 | 765a2f2a24186d1d2983712c26df8e97523b17a5e8dd861b4e18d80c05e4819c |
| main.lab | 49 | aa36ea864dc886d3042abd12516e0eb52d3b5caa139ed56a635b2e5ab382eab5 |
| MainLab.ini | 2851 | 0f97012b2bc36beb93b335e73f5aafcf2f496bafe2370a337ee3a08fda9590a8 |

Hashes identificam estes anexos e permitem comparar futuras revisões; não certificam segurança.

## Estrutura dos executáveis

Inspeção de cabeçalhos PE e diretórios com Python e GNU objdump, além de strings ASCII. Os três binários têm assinatura estrutural PE válida e arquitetura i386/PE32. Os intervalos brutos das seções cabem nos respectivos arquivos. Isso não valida todas as estruturas internas.

Nenhum dos três contém uma tabela de certificado Authenticode embutida. Não foi consultado catálogo externo de assinaturas.

### Main.exe

14 seções. Nomes incluem .mackt, .topo0 a .topo3 e .Orion; essas seis seções têm simultaneamente permissões de escrita e execução. Existem também seções sem nome. Esse conjunto é compatível com proteção, empacotamento ou modificações do executável, mas não identifica sozinho malware nem o empacotador.

objdump terminou com código 0, porém não apresentou nomes de DLLs importadas. Isso limita a visibilidade das dependências; não significa ausência de dependências. Foi encontrada a string Customs.dll, que sugere uma referência ao plugin, sem comprovar carregamento ou compatibilidade de offsets.

A detecção anterior Trojan:Win32/Phonzy.A!ml está documentada em ESTADO-ATUAL.md e RECUPERACAO-PACOTE-LOCAL-2026-11-06.md. Não há hash do executável anteriormente detectado comparado aqui; portanto não se afirma que este anexo seja exatamente a mesma revisão. A análise atual não confirma nem descarta a detecção.

### Customs.dll

5 seções; nenhuma marcada simultaneamente para escrita e execução. Importações visíveis: KERNEL32.dll, USER32.dll, GDI32.dll, ADVAPI32.dll e OPENGL32.dll. Contém as strings main.lab e mensagem de configuração ausente/inválida.

A arquitetura é coerente com o Main.exe de 32 bits. Não foi comprovada compatibilidade de endereços, hooks, protocolo ou versão. Caminhos de depuração embutidos apontam para árvores de compilação distintas das do gerador; caminhos não autenticam origem nem equivalência de fontes.

### GetMainLab.exe

5 seções; nenhuma marcada simultaneamente para escrita e execução. Importação visível: KERNEL32.dll. Contém referências a MainLab.ini, IPaddress, ClientSerial e main.lab, coerentes com a função declarada de gerador. Não foi executado.

## Configuração: divergência confirmada

O main.lab tem 49 bytes. Foi decodificado localmente pelo inverso da transformação documentada em scripts/mainlab-config.py, sem executar código dos anexos. Possui terminação de host, serial imprimível de 16 bytes e byte final zero.

Comparação com os campos do MainLab.ini:
- Host: **diferente**.
- Serial: igual; o INI usa uma sequência de pontos de preenchimento.
- Conteúdo completo esperado a partir do INI: **não corresponde** ao main.lab recebido.
- O endereço do INI é um DNS público de exemplo, não uma configuração validada de GameServer.

Os valores decodificados não são publicados. Não se deve regenerar a configuração usando esses exemplos e tratá-la como pronta para produção.

O cabeçalho do INI menciona versões comerciais de cliente/servidor; trata-se de texto do fornecedor, não de identificação técnica comprovada do par recebido.

## Cobertura e limites

Concluído:
- leitura integral e SHA-256 dos cinco arquivos;
- conferência básica PE32/i386, seções, tabela de certificado e importações visíveis;
- inspeção de referências entre cliente, DLL, gerador e configuração;
- comparação local de main.lab com MainLab.ini.

Não realizado:
- varredura antivírus atual: clamscan não está disponível neste ambiente;
- submissão a serviços externos de análise;
- execução, desempaquetamento dinâmico ou testes em Windows;
- auditoria completa do código de máquina ou equivalência com fontes;
- validação do cliente completo, assets, GameServer, schema SQL, login ou itens;
- comprovação de licença/proveniência ou permissão de redistribuição.

Ausência de detecção nesta análise não é atestado de arquivo limpo. Não desativar a proteção nem liberar o arquivo com base neste relatório.

## Integração ao GitHub e próximos passos

Este commit registra a evidência e atualiza o estado conhecido através deste relatório. Não altera o site nem sua configuração. Os anexos originais não foram adicionados ao repositório público: há licença/proveniência pendente, detecção histórica e configuração que deve permanecer privada. Não há URL pública de download dos binários neste commit.

Para avançar: obter uma revisão verificável do cliente com origem e licença confirmadas; realizar análise de segurança atual; conferir o par exato cliente/plugin/servidor; confirmar host e serial em configuração privada; validar schema vazio em laboratório e somente então testar a integração.

Referências: ESTADO-ATUAL.md, PENDENCIAS.md, COMPILACAO-DIAGNOSTICA-2026-11-06.md e scripts/mainlab-config.py. As evidências anteriores de compilação de objetos não equivalem a um jogo executável aprovado.
