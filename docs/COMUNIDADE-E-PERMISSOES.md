# Comunidade e permissões

Referência consultada em 06/11/2026: https://forum.muaway.net/ (HTML público). A página mostra categorias oficiais, suporte, tutoriais, comércio, design, convivência, links de membros, líderes, equipe e atividade. Recursos e regras internos após login não foram inspecionados. Não se trata de cópia literal ou equivalência verificada do Invision Community; marca, arte, usuários e conteúdo não foram copiados.

## Hierarquia própria

| Cargo | Permissões web |
|---|---|
| Administrador | Cargos, suspensões, moderação, anúncios, atendimento, catálogo |
| Subadministrador | Moderação, anúncios, atendimento, catálogo |
| Game Master | Moderação, anúncios, atendimento |
| Moderador | Moderação e atendimento |
| Colaborador | Atendimento |
| Designer | Participação; cargo visual sem poderes de gestão |
| Membro | Participação |

Somente administrador altera cargos/suspensões com motivo. Não altera o próprio acesso e preserva administrador ativo. Mudanças revogam sessões. Uma suspensão bloqueia autenticação web; não é banimento do GameServer. Não há promoção automática por posts, reputação ou compras.

## Conteúdo

Categorias de publicação oficial exigem permissão `official`; moderador não publica anúncios. Tópicos fechados não recebem respostas. Ocultação remove conteúdo de busca, atividade e rankings públicos. O primeiro post é moderado pelo tópico, preservando a estrutura. Contagens excluem respostas ocultas e categorias sem participação. Curtidas são únicas por usuário, reversíveis e sem autocurtida. Autores editam em tópicos abertos por 15 minutos; corpo anterior fica na auditoria privada.

Notificações têm limite de 200 por membro. Mensagens privadas só são retornadas aos dois participantes; equipe não recebe acesso geral pela API. Não há criptografia ponta a ponta: operadores com acesso ao arquivo podem ler os dados. Usuário pode bloquear novas mensagens. Contas, mensagens e auditoria não devem ser publicadas.

## Limites restantes

Armazenamento local em instância única; migração transacional, e-mail de recuperação/verificação, autenticação de dois fatores, anexos com análise de arquivos, notificações push, presença distribuída e traduções completas não foram implementados. Não anunciar paridade integral com plataforma de terceiros. Comércio não tem custódia, cobrança ou intermediação financeira.
