/** Perfil desejado. Não substitui nem inicia os binários do GameServer. */
import { itemPolicy } from '../item-policy.js';
export const gameProfile = Object.freeze({
  name: 'MuBanneD - Editavel',
  version: '97d+99i+1.0 custom',
  distribution: '97d+99i custom — pacote ainda em avaliação',
  status: 'awaiting_compatible_base',
  darkLord: { required: false, verified: false },
  classes: ['BK', 'SM', 'ME', 'MG'],
  editor: { ...itemPolicy, enabled: false },
  specialItems: { maxLevel: 15, enabled: false },
  payments: { enabled: false },
});

export function publicGameStatus() {
  return {
    name: gameProfile.name,
    version: gameProfile.version,
    distribution: gameProfile.distribution,
    connected: false,
    status: gameProfile.status,
    classes: gameProfile.classes,
    darkLord: gameProfile.darkLord,
    editor: gameProfile.editor,
    message: 'Perfil clássico 97d+99i com customs escolhido; arquivos e integração ainda não validados.',
  };
}
