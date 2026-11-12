# Riscos pendentes

- **Visual (NÃO TESTADO):** posições das janelas Lua (editor e lobby), recoloração dos pets e intensidade dos brilhos. Precisa de print do jogo.
- **Menu da tecla G** (Negociar, Lojinha, Party e outros): não foi implementado. O cliente não tem função em Lua para pedir trade ou party a outro jogador. Fazer isso exige enviar pacotes de protocolo crus com o índice do alvo, e não dá para validar sem a tela. Fica como próximo passo, a ser testado com você no jogo.
- **GMs:** a permissão vem do CtlCode 32 do personagem. Quem receber GM passa a ver a aba EVENTOS automaticamente.
- **Origem:** o código-fonte do mu.exe não existe no PC. Brilho por nível, montaria no lobby e visual transparente ou brilhante continuam impossíveis.
- **Git:** muitas mudanças ainda não foram commitadas. Recomendo commitar os scripts e as configurações do servidor, sem arquivos de senha.
