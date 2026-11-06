# Estado atual

## Funciona com backend local

- Cadastro e login do site; senha com scrypt, sessão HttpOnly.
- Minha conta e troca de senha, invalidando outros acessos.
- Chat entre visitante e equipe; encerramento e novo atendimento.
- Publicação de notícias e permissões de administrador.
- Site preservado, navegação e 13 categorias de ranking sem dados inventados.
- Servidor HTTP com lista explícita de arquivos públicos; backend, testes e módulos privados não são entregues pelo site.

## Demonstração

- Personagens, inventário, editor +0 a +15 e premiações do `portal.html` usam dados locais.
- A regra de transparência +12..+15 aparece como indicação, sem modelo 3D real.
- Painel administrativo demonstrativo não gerencia o GameServer.

## Ainda não funciona

- Jogo e cliente 1.0M, banco do jogo, contas vinculadas, itens e rankings reais.
- Transparência no cliente, suporte real a +15 na distribuição escolhida e combate equilibrado.
- Fórum completo, campanhas, torneios, guilds e casamento integrados.
- Produção: JSON local é apenas armazenamento para teste em instância única. Não afirmar que está pronto para operação pública.

## Validação desta etapa

`npm run check`: scripts JavaScript sem erro de sintaxe.
`npm test`: limites do editor, exclusivos, conta, senha, sessões, chat, notícias, 13 categorias, ausência de integração e segurança HTTP aprovados.
Sem teste visual em navegador nesta etapa; sem acesso ao jogo.
