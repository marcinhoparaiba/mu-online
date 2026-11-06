# Fontes de arquivos e desenvolvimento de MU

Consulta: 5 de novembro de 2026, horário do usuário. Pesquisa em português, inglês, espanhol e termos russos; páginas públicas de desenvolvedores, fóruns e GitHub. Não é levantamento exaustivo da internet. Nenhum pacote foi executado, comparado em carga ou certificado como seguro. Recursos de fornecedores são alegações até teste local.

| Fonte | Evidência observada | Utilidade para MuBanneD | Limites |
|---|---|---|---|
| [DarksTeam 1.0M](https://darksteam.net/threads/darksteam-muserver-0-99-60-62t-1-0m-beta-15.21354/) | Publicação de DarkMaster; servidor 0.99.60/62T, patch Beta 15 e patch de cliente listados; DL/pets e mixes até +13 documentados no tópico | Candidata escolhida para experiência clássica | Download não obtido; acesso ao código-fonte não confirmado; +15 e transparência próprios não demonstrados |
| [SSeMU](https://www.ssemu.com.ar/) | Site do fornecedor apresenta SSeMU 1 e 2; SSeMU 2 declara perfis 0.97, 0.99B, Season 1, 2 e 3 sobre base técnica Season 3 Episode 1; licença comercial | Comparação técnica para clássicos com manutenção e documentação | Não equivale a 1.0M original. Não comprada, instalada ou testada; código-fonte e direito a modificar cliente devem ser confirmados |
| [Documentação SSeMU 1](https://www.ssemu.com.ar/ssemu1/docs/) | Referências de configurações de cliente, itens, combate, eventos, casamento e scripts | Avaliar pontos de extensão antes de depender de alterações internas | Não comprova suporte a todos os recursos desejados na mesma versão |
| [Louis Emulator](https://www.jogandomu.com.br/) / [perfil GitHub do autor](https://github.com/LouisEmulator) | Site do produto e vínculo no perfil; distribuições gratuitas/comerciais mencionadas em publicações próprias e comunidade | Comparação de Season 6 e ferramentas; não substitui base escolhida | Não tratar GitHub do autor como fonte completa do GameServer nem confundir repack com distribuição própria |
| [IGCN](https://www.igcn.mu/) | Fornecedor apresenta Server Suite, ferramentas e extensões Lua; catálogo consultado inclui Season 6 e Season 22 | Referência para operação e seasons posteriores | Escopo distante da 1.0M escolhida; comercial; sem compra nem teste |
| [OpenMU](https://github.com/MUnique/OpenMU) / [documentação](https://openmu-docs.munique.net/) | Emulador C#, MIT, foco em S6E3; documentação declara projeto em desenvolvimento e diferenças no gameplay | Referência aberta de arquitetura e integração | Não reproduz automaticamente a experiência de 97d/1.0M; requer cliente separado |
| [LABMU](https://labmu.com.br/downloads/package_muserver) | Catálogo lista pacotes FireTeam 97D e Season 1 com cliente e source | Inventário e pesquisa de material clássico | Agregador: arquivos, links reais, autoria e permissões não validados. Rótulo source não comprova completude |
| [RaGEZONE](https://forum.ragezone.com/community/mu-online-releases.197/) | Tópicos públicos de releases, correções e desenvolvimento | Histórico técnico e experiências da comunidade | Reputação do fórum não valida todo anexo; verificar autor e cada release |
| [TUServerMU](https://tuservermu.com.ve/) | Resultados indexados de releases e fontes; algumas páginas retornaram 403 | Pesquisa em espanhol e comparação de changelogs | Parte da cobertura limitada a resultados indexados; não alegar inspeção integral dos arquivos |

## Pista aberta adicional

[SharpSSeMU-99B](https://github.com/olddies/SharpSSeMU-99B) declara implementação em C# e ferramentas de administração. O README exclui cliente original, pacote original e fontes SSeMU C++ de referência: não é um pacote pronto e independente. Licença possui ressalvas para partes derivadas. Não escolhido nem testado.

## Critério de escolha

A melhor fonte depende do objetivo. Para a base 1.0M já aprovada, começar pela publicação do desenvolvedor DarksTeam e avaliar acesso ao código e limitações reais. Para comparar uma alternativa comercial clássica, SSeMU oferece documentação pública mais explícita de configuração. Nenhuma dessas observações constitui prova de estabilidade ou de compatibilidade com o editor +15.

Antes de implementar transparência e +15 no jogo, confirmar: pacote/cliente combinados, formato binário dos itens, bits de nível, opções, serial, locks de baú, renderização e disponibilidade de fonte ou extensão suportada. Pacotes com cliente diferente não devem ser misturados só porque o anúncio diz clássico.

Não houve compra, contato com terceiros, instalação de binários ou publicação de servidor nesta pesquisa.
