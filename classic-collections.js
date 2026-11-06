/** Referência informada pelo usuário; numeração não é nível de melhoria. */
export const classicCollections = Object.freeze(Array.from({ length: 9 }, (_, index) => ({
  id: `especial-${String(index + 1).padStart(2, '0')}`,
  name: `Set Especial ${String(index + 1).padStart(2, '0')}`,
  parts: ['Capacete', 'Armadura', 'Calça', 'Luvas', 'Botas'],
  source: 'Referência do usuário: vídeo Utilizando Editor wh [ MU EC ] e captura enviada',
  verification: index < 2 ? 'Nome e partes visíveis na captura' : 'Numeração informada pelo usuário; aparência e componentes individuais não conferidos',
  modelsAvailable: false,
  statsVerified: false,
  editorEligibility: 'pending_catalog_review',
})));
