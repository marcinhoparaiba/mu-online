# Eventos na agenda pessoal

No fórum, abra Calendário e use **BAIXAR PARA MINHA AGENDA** no evento desejado. O arquivo .ics pode ser importado em agendas compatíveis com iCalendar.

Horários são exportados em UTC e a agenda do participante apresenta seu fuso local. O arquivo contém título, descrição, início, fim, identificador estável e situação agendado/cancelado. Não inclui lista de interessados ou identidade do organizador.

É uma cópia baixada manualmente: alterações e cancelamentos não são sincronizados automaticamente. Baixe novamente para consultar a versão atual; a atualização de uma importação anterior depende do aplicativo de agenda. Confirmação de interesse continua no site e não inscreve personagem nem executa evento no jogo.

Endpoint público: GET /api/community/events/:id/calendar.ics. Evento inexistente retorna 404. O formato usa CRLF, escape de texto e dobra de linhas até 75 bytes UTF-8, preservando caracteres completos. Não exige GameServer, SQL ou serviço externo.

Validação: testes de horários, acentos, textos longos, tentativas de injeção de propriedades, cancelamento, privacidade, download HTTP e interface em Chromium. Nenhuma compatibilidade específica com aplicativos externos foi testada.
