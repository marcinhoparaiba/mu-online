/** Perfil desejado. Não substitui nem inicia os binários do GameServer. */
import { itemPolicy } from '../item-policy.js';
export const gameProfile = Object.freeze({
  name: 'MuBanneD - Editavel',
  version: '1.0M',
  distribution: 'DarksTeam 0.99.60/62T Beta 15',
  status: 'awaiting_compatible_base',
  darkLord: { required: true, verified: false },
  classes: ['BK', 'SM', 'ME', 'MG', 'DL'],
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
    message: 'Base 1.0M escolhida; arquivos e integração com Dark Lord ainda não validados.',
  };
}
