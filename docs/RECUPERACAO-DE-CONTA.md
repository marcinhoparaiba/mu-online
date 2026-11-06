# Recuperação de conta web

`index.html#recuperar` solicita instruções; `reset.html` consome link recebido. `POST /api/auth/forgot` usa resposta genérica para endereços existentes e inexistentes. Sem envio configurado retorna 503 para todos. `POST /api/auth/reset` valida token, senha de 10..256 caracteres, validade de 15 minutos e uso único. Senha usa o hash do backend; todas as sessões e outros links da conta são invalidados. O token fica em fragmento da URL (não vai na requisição HTTP da página) e é removido do endereço pelo script. Nunca imprimir tokens em logs.

## Configuração opcional no ambiente

- `MU_MAIL_API_KEY`: chave privada Resend, nunca versionar.
- `MU_MAIL_FROM`: remetente verificado no provedor.
- `MU_PUBLIC_URL`: origem HTTPS pública do site, sem credenciais/query/fragmento.

Nenhum serviço foi contratado, configurado ou utilizado nesta etapa. Os testes injetam remetente simulado; nenhum e-mail real foi enviado. Provedor e domínio precisam de autorização e configuração do titular. HTTPS e reputação de envio devem ser validados antes de ativar. Não guardar chave no JavaScript público.

Falha de envio não expõe existência da conta ao solicitante; o operador recebe um aviso genérico no log. O rate limit básico local não substitui proteção distribuída ou observação de abuso. E-mail não é verificado no cadastro; verificação e 2FA permanecem complementos de produção. Suspensão de conta não é removida pela recuperação. O fluxo não modifica credenciais de GameServer.
