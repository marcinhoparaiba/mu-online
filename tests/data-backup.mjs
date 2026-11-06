import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm, symlink, stat } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { backup, restore } from '../scripts/data-backup.mjs';

test('backup e restauração preservam bytes, fórum e dados sem sobrescrever arquivos', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'mubanned-backup-'));
  try {
    const source = path.join(dir, 'store.json'), archive = path.join(dir, 'backup.json'), target = path.join(dir, 'restored.json');
    const bytes = Buffer.from(JSON.stringify({ users: [{ username: 'Teste' }], chats: [], articles: [], forum: { topics: [], audit: [] } }, null, 2) + '\r\n');
    await writeFile(source, bytes);
    const saved = await backup(source, archive);
    assert.equal((await restore(archive, target)).sha256, saved.sha256);
    assert.deepEqual(await readFile(target), bytes);
    await assert.rejects(backup(source, archive), { code: 'EEXIST' });
    await assert.rejects(restore(archive, target), { code: 'EEXIST' });
    if (process.platform !== 'win32') assert.equal((await stat(archive)).mode & 0o777, 0o600);
    const altered = JSON.parse(await readFile(archive, 'utf8')); altered.payload = Buffer.from('{}').toString('base64');
    const corrupt = path.join(dir, 'corrupt.json'); await writeFile(corrupt, JSON.stringify(altered));
    await assert.rejects(restore(corrupt, path.join(dir, 'must-not-exist.json')), /Integridade/);
    await assert.rejects(stat(path.join(dir, 'must-not-exist.json')), { code: 'ENOENT' });
    await writeFile(source, '{"users":[]}');
    await assert.rejects(backup(source, path.join(dir, 'invalid.json')), /Formato/);
    await assert.rejects(backup(target, new URL('../private-backup.json', import.meta.url).pathname), /fora da pasta/);
    const link = path.join(dir, 'project-link');
    await symlink(path.resolve('.'), link, 'dir');
    await assert.rejects(backup(target, path.join(link, 'private-backup.json')), /fora da pasta/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
