import test from 'node:test';
import assert from 'node:assert/strict';
import { roles, can, participationTitle } from '../community-policy.js';
test('hierarquia não permite atribuição de cargos por moderação ou participação',()=>{
 for(const role of roles){assert.equal(can({role:role.id},'users'),role.id==='admin');assert.equal(can({role:role.id},'catalog'),['admin','subadmin'].includes(role.id));}
 assert.equal(can({role:'moderator'},'official'),false);
 assert.equal(can({role:'gm'},'official'),true);
 assert.equal(can({role:'collaborator'},'moderate'),false);
 assert.equal(can({role:'designer'},'support'),false);
 assert.equal(can(null,'users'),false);assert.equal(can({role:'invented'},'users'),false);
 assert.equal(participationTitle(500),'Lenda da comunidade');assert.equal(can({role:'player',posts:999999},'users'),false);
});
