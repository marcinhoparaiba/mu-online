# Compilação diagnóstica — 06/11/2026

## Resultado verificado

Cinco receitas novas mínimas de MSBuild, sem importar os projetos recebidos, foram executadas somente com target ClCompile em Win32, toolset v143 e SDK 10.0.26100.0 instalados. Os cinco processos terminaram com exit 0:

| Conjunto | Objetos compilados |
|---|---:|
| DataServer/Plugin | 3 |
| GameServer/DarkPlugin | 74 |
| GetMain/GetMainInfo | 4 |
| JoinServer/Plugin | 3 |
| Main/Customs | 22 |

Isso resolve a necessidade de v141 para **esta análise de compilação de objetos**; não comprova um build equivalente ao original. Nenhuma DLL/EXE foi vinculada ou executada. Nenhuma biblioteca binária recebida foi copiada ao laboratório. Pós-build, imports de usuário e targets personalizados dos projetos recebidos não fazem parte das novas receitas. Diretório de compilação não é uma VM nem um isolamento de execução de malware.

Fontes recebidos e produtos OBJ permanecem privados. O Git contém somente o preparador próprio e testes sintéticos. O preparador rejeita paths dinâmicos/fora da fonte, não sobrescreve laboratório existente e copia apenas CPP/H/HPP/INL. A licença dos fontes e a compatibilidade dos offsets com o executável base continuam pendentes.

## main.lab

O arquivo gerado pelo titular às 06:46 foi inspecionado sem executar GetMain. Possui 49 bytes, host em formato válido e serial imprimível de 16 caracteres. A cópia em Client era antiga; ela foi preservada em backup externo e substituída pela nova, com comparação byte a byte. Nenhum valor privado foi registrado no Git.

O novo scripts/mainlab-config.py reproduziu exatamente os bytes do arquivo recebido em uma verificação local sem exibir host/serial. Usa entrada oculta para serial, destino novo fora do repositório e host padrão de loopback. Não inicia serviços nem altera o Defender. Três testes cobrem fixture sintética de 49 bytes, limites de entrada e proteção do destino.

main.lab não é Main.exe. Os executáveis base continuam ausentes após ação do Defender; gerar configuração não altera a detecção. A proteção estava ativa na conferência. Não restaurar ou liberar os arquivos detectados.

## SQL e limites restantes

As consultas recebidas dependem de Character, MEMB_INFO, warehouse, Extwarehouse e procedure MUDAR_BAU. Não constituem schema base completo. Não foram executadas. Não instalar SQL legado no host, importar bancos potencialmente reais, expor portas ou criar contas de teste no banco recebido. São necessários cliente base verificável e schema vazio compatível antes de testar integração.

Os projetos chamados Main e GameServer geram plugins; não reconstruíram o motor completo do cliente/servidor. O catálogo público LABMU lista FIRETEAM 97D em https://labmu.com.br/downloads/package_muserver, mas isso não comprova uma revisão limpa. Solicitar ao responsável uma revisão verificável, sua proveniência e o executável exato compatível. Não presumir falso positivo nem recomendar desativar a proteção.

## Validação

Oito testes Python passaram (auditoria, receitas de build e gerador de configuração). npm run check e os oito testes Node passaram. Home, intro, fórum e loja não foram alterados nesta etapa. Não houve publicação do jogo, cobrança ou upload de fontes privados, binários, bancos ou credenciais.
