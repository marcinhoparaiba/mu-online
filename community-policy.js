/** Cargos concedem permissões; títulos por participação nunca concedem poderes. */
export const roles = [
  { id: 'admin', name: 'Administrador', level: 100, permissions: ['users', 'moderate', 'official', 'support', 'catalog'] },
  { id: 'subadmin', name: 'Subadministrador', level: 80, permissions: ['moderate', 'official', 'support', 'catalog'] },
  { id: 'gm', name: 'Game Master', level: 60, permissions: ['moderate', 'official', 'support'] },
  { id: 'moderator', name: 'Moderador', level: 50, permissions: ['moderate', 'support'] },
  { id: 'collaborator', name: 'Colaborador', level: 30, permissions: ['support'] },
  { id: 'designer', name: 'Designer', level: 20, permissions: [] },
  { id: 'player', name: 'Membro', level: 0, permissions: [] },
];
export const can = (user, permission) => !!user && !!roles.find(r => r.id === user.role)?.permissions.includes(permission);
export const roleName = id => roles.find(r => r.id === id)?.name || 'Membro';
export const participationTitle = count => count >= 500 ? 'Lenda da comunidade' : count >= 100 ? 'Veterano' : count >= 25 ? 'Participante' : 'Iniciante';
