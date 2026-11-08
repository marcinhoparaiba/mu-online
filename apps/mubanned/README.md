# MuBanneD - Editavel

Portal Next.js 15 + React 19, com SQLite local (Node.js 24 recomendado).

```powershell
cd apps/mubanned
npm ci
npm run dev
```

Abra http://localhost:3000/home. Painel: /painel. Fórum: /forum.

A base original do repositório permanece na raiz: site, painel demonstrativo, chat de suporte e testes. O documento de requisitos permanece em docs/MU-EC-PROJETO-MESTRE.md. A integração destes dois sistemas ainda está em andamento; suas bases de contas não são compartilhadas.

## Funcionalidades verificadas

Cadastro e login com sessão; perfil e atualização de e-mail com senha; alteração de senha com confirmação; fórum com categorias, pesquisa, tópicos, respostas e fechamento pela equipe; notícias, catálogo, calendário, suporte por tickets e administração.

GameServer, personagens reais, saldos, conversões, PID e pagamentos não estão integrados. As operações dependentes do jogo ficam indisponíveis. O visual ainda precisa de comparação final com as capturas de referência; não é uma réplica perfeita concluída.

## Validação

`npm run build` passou. Testes HTTP reais passaram para cadastro, sessão, criação/persistência de tópico, resposta e rejeição de senhas divergentes.

## Imagens de referência

Os arquivos em public/reference foram obtidos das páginas públicas de referência fornecidas pelo usuário, para comparação visual. Não são arte original nem há licença comercial concedida por este repositório.

- header.jpg: https://images.muaway.net/website/images/header-bg.jpg
- banner.jpg: https://images.muaway.net/site/images/bannerRotate/2026/10/HALL_2026_10_warlock_kit.jpg
- account-bg.png: https://forum.muaway.net/static/theme/away-bg-lg.png

Nenhum banco local, sessão, senha, token ou dados de contas foi incluído.
