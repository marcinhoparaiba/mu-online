/** Backups privados do armazenamento JSON do site; não acessa o banco do jogo. */
import { readFile, realpath, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const inside = (root, target) => {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
};
function validate(bytes) {
  let data;
  try { data = JSON.parse(bytes.toString('utf8')); } catch { throw new Error('O armazenamento não contém JSON válido.'); }
  if (!data || typeof data !== 'object' || Array.isArray(data) ||
      !['users', 'chats', 'articles'].every(key => Array.isArray(data[key])) ||
      (data.forum !== undefined && (!data.forum || !Array.isArray(data.forum.topics) || !Array.isArray(data.forum.audit)))) {
    throw new Error('Formato de armazenamento do site inválido.');
  }
}
async function destination(file, outsideProject) {
  const parent = await realpath(path.dirname(path.resolve(file)));
  const resolved = path.join(parent, path.basename(file));
  if (outsideProject && inside(await realpath(projectRoot), resolved)) throw new Error('Salve backups fora da pasta do projeto.');
  return resolved;
}
export async function backup(source, output) {
  const target = await destination(output, true);
  const bytes = await readFile(source);
  validate(bytes);
  const snapshot = { format: 'mubanned-site-backup', version: 1, createdAt: new Date().toISOString(), sha256: digest(bytes), payload: bytes.toString('base64') };
  await writeFile(target, JSON.stringify(snapshot, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  return { sha256: snapshot.sha256 };
}
export async function restore(source, output) {
  let snapshot;
  try { snapshot = JSON.parse(await readFile(source, 'utf8')); } catch { throw new Error('Backup ilegível ou inválido.'); }
  if (snapshot?.format !== 'mubanned-site-backup' || snapshot.version !== 1 || typeof snapshot.payload !== 'string' || !/^[a-f0-9]{64}$/.test(snapshot.sha256 || '')) throw new Error('Formato de backup não reconhecido.');
  const bytes = Buffer.from(snapshot.payload, 'base64');
  if (digest(bytes) !== snapshot.sha256) throw new Error('Integridade do backup inválida (SHA-256).');
  validate(bytes);
  const target = await destination(output, false);
  await writeFile(target, bytes, { flag: 'wx', mode: 0o600 });
  return { sha256: snapshot.sha256 };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [action, source, output, ...extra] = process.argv.slice(2);
  if (!['backup', 'restore'].includes(action) || !source || !output || extra.length) {
    console.error('Uso: node scripts/data-backup.mjs backup|restore ORIGEM DESTINO_NOVO'); process.exitCode = 1;
  } else {
    try { const result = await (action === 'backup' ? backup : restore)(source, output); console.log(`Concluído. SHA-256: ${result.sha256}. Arquivo privado; não envie ao GitHub.`); }
    catch (error) { console.error(error.code === 'EEXIST' ? 'Destino já existe. Nenhum arquivo foi sobrescrito.' : error.code ? `Falha de arquivo (${error.code}). Verifique os caminhos e permissões.` : error.message); process.exitCode = 1; }
  }
}
