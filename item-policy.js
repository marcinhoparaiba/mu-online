/** Regras compartilhadas. A transparência real depende do cliente do jogo. */
export const itemPolicy = Object.freeze({ minLevel: 0, maxLevel: 15, transparentFrom: 12 });

export function itemAppearance(level) {
  if (!Number.isInteger(level) || level < itemPolicy.minLevel || level > itemPolicy.maxLevel) {
    throw new RangeError('Nível do item deve ser um inteiro entre +0 e +15.');
  }
  return level >= itemPolicy.transparentFrom ? 'transparent' : 'normal';
}

/** Item deve vir de inventário confiável; esta função não valida titularidade. */
export function validateItemEdit(item, change) {
  if (!item || item.premium || item.exclusive) return { ok: false, error: 'Custom exclusivo não pode ser alterado no editor comum.' };
  if (!change || !Number.isInteger(change.level) || change.level < 0 || change.level > 15) {
    return { ok: false, error: 'Escolha um nível inteiro entre +0 e +15.' };
  }
  return { ok: true, level: change.level, appearance: itemAppearance(change.level) };
}
