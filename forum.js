const $ = id => document.getElementById(id);
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let user = null, categories = [], currentTopic = null, revision = 0;
async function api(path, options = {}) {
  const response = await fetch('/api' + path, { credentials: 'same-origin', ...options, headers: { 'Content-Type': 'application/json', ...options.headers } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Fórum indisponível. Verifique se o servidor web está funcionando.');
  return data;
}
const post = (path, data) => api(path, { method: 'POST', body: JSON.stringify(data) });
const date = value => new Date(value).toLocaleString('pt-BR');
const meta = topic => `${escape(topic.author.username)} · ${escape(date(topic.createdAt))} · ${topic.replies} resposta(s)${topic.locked ? ' · Fechado' : ''}`;
const loginLink = '<p class="muted-note">Use sua conta do site para participar. <a href="index.html#entrar">Entrar</a> ou <a href="index.html#cadastro">criar conta</a>.</p>';
function newTopicForm(categoryId) {
  if (!user) return loginLink;
  const available = categories.filter(c => !c.staffOnly || user.role === 'admin');
  if (!available.length) return '';
  return `<details class="simple-panel forum-form"><summary>Criar tópico</summary><form id="topic-form" class="form-grid"><label>Categoria<select name="categoryId">${available.map(c => `<option value="${c.id}" ${c.id === categoryId ? 'selected' : ''}>${escape(c.name)}</option>`).join('')}</select></label><label>Título<input class="entry" name="title" required minlength="4" maxlength="120"></label><label>Mensagem<textarea class="entry" name="body" required minlength="10" maxlength="6000"></textarea></label><p class="dim tiny">Texto simples. HTML não será executado.</p><button class="btn-gold">PUBLICAR TÓPICO</button></form></details>`;
}
function pages(data, prefix) {
  if (data.pages < 2) return '';
  return `<nav class="forum-pages" aria-label="Páginas">${data.page > 1 ? `<a class="btn-outline" href="#${prefix}${data.page - 1}">ANTERIOR</a>` : ''}<span>Página ${data.page} de ${data.pages}</span>${data.page < data.pages ? `<a class="btn-outline" href="#${prefix}${data.page + 1}">PRÓXIMA</a>` : ''}</nav>`;
}
async function render() {
  const ticket = ++revision;
  const [kind, id = '', pageValue = '1'] = location.hash.slice(1).split('/');
  const page = Math.max(1, Number.parseInt(pageValue, 10) || 1);
  const content = $('forum-content');
  content.setAttribute('aria-busy', 'true');
  currentTopic = null;
  try {
    if (kind === 'topic') {
      if (!/^[a-f0-9]{32}$/.test(id)) throw new Error('Endereço de tópico inválido.');
      const data = await api(`/forum/topics/${id}?page=${page}`);
      if (ticket !== revision) return;
      currentTopic = data.topic;
      const topic = data.topic;
      document.title = topic.title + ' | Fórum MuBanneD';
      content.innerHTML = `<a href="#category/${topic.categoryId}">← Voltar à categoria</a><h1>${escape(topic.title)}</h1><p class="forum-meta">${meta(topic)}${topic.hidden ? ' · Oculto' : ''}</p>${data.posts.map(p => `<article class="forum-post"><header><strong>${escape(p.author.username)}</strong> · ${p.author.role === 'admin' ? 'Equipe' : 'Membro'} <span class="forum-meta">${escape(date(p.createdAt))}</span></header><p>${escape(p.body)}</p></article>`).join('')}${pages(data, `topic/${id}/`)}${topic.locked || topic.hidden ? '<p class="muted-note">Tópico fechado ou oculto para novas respostas.</p>' : user ? '<form id="reply-form" class="simple-panel form-grid forum-form"><label>Sua resposta<textarea class="entry" name="body" required maxlength="6000"></textarea></label><button class="btn-gold">RESPONDER</button></form>' : loginLink}${user?.role === 'admin' ? `<details class="simple-panel"><summary>Moderação</summary><form id="moderation-form" class="form-grid"><label>Ação<select class="entry" name="action"><option value="${topic.locked ? 'unlock' : 'lock'}">${topic.locked ? 'Reabrir' : 'Fechar'} tópico</option><option value="${topic.hidden ? 'restore' : 'hide'}">${topic.hidden ? 'Restaurar' : 'Ocultar'} tópico</option></select></label><label>Motivo<textarea class="entry" name="reason" required minlength="5" maxlength="500"></textarea></label><button class="btn-outline">APLICAR E REGISTRAR</button></form></details>` : ''}`;
    } else {
      const categoryId = kind === 'category' ? id : '';
      if (categoryId && !categories.some(c => c.id === categoryId)) throw new Error('Categoria não encontrada.');
      const query = kind === 'search' ? decodeURIComponent(id) : '';
      const data = await api('/forum/topics?' + new URLSearchParams({ category: categoryId, q: query, page: String(page) }));
      if (ticket !== revision) return;
      document.title = 'Fórum | MuBanneD - Editavel';
      content.innerHTML = `<h1>${escape(query ? `Busca: ${query}` : categories.find(c => c.id === categoryId)?.name || 'Comunidade MuBanneD')}</h1><p class="dim">${data.total} tópico(s)</p>${data.topics.map(t => `<a class="topic-card" href="#topic/${t.id}"><h2>${escape(t.title)}</h2><div class="forum-meta">${meta(t)}</div></a>`).join('') || '<div class="simple-panel">Nenhum tópico encontrado.</div>'}${pages(data, `${kind || 'all'}/${encodeURIComponent(id)}/`)}${newTopicForm(categoryId)}`;
    }
    $('forum-categories').innerHTML = categories.map(c => `<a href="#category/${c.id}" ${kind === 'category' && c.id === id ? 'aria-current="page"' : ''}>${escape(c.name)}${c.staffOnly ? ' · Equipe' : ''}</a>`).join('');
  } catch (error) {
    if (ticket === revision) content.innerHTML = `<section class="simple-panel"><h1>Não foi possível abrir o fórum</h1><p>${escape(error.message)}</p><button class="btn-outline" id="retry-forum">TENTAR NOVAMENTE</button></section>`;
  } finally { if (ticket === revision) content.setAttribute('aria-busy', 'false'); }
}
document.addEventListener('submit', async event => {
  const form = event.target;
  if (form.id === 'search-form') { event.preventDefault(); location.hash = 'search/' + encodeURIComponent($('forum-search').value.trim()); return; }
  if (!['topic-form', 'reply-form', 'moderation-form'].includes(form.id)) return;
  event.preventDefault();
  const button = form.querySelector('button'); button.disabled = true;
  try {
    const values = Object.fromEntries(new FormData(form));
    if (form.id === 'topic-form') { const data = await post('/forum/topics', values); location.hash = 'topic/' + data.topic.id; }
    if (form.id === 'reply-form') { await post(`/forum/topics/${currentTopic.id}/replies`, values); await render(); }
    if (form.id === 'moderation-form') { await post(`/admin/forum/topics/${currentTopic.id}`, values); await render(); }
  } catch (error) { $('toast').textContent = error.message; $('toast').classList.add('show'); setTimeout(() => $('toast').classList.remove('show'), 5000); }
  finally { button.disabled = false; }
});
document.addEventListener('click', event => { if (event.target.closest('#retry-forum')) start(); });
window.addEventListener('hashchange', render);
async function start() {
  try {
    const [me, data] = await Promise.all([api('/auth/me'), api('/forum/categories')]);
    user = me.user; categories = data.categories;
    $('forum-session').textContent = user ? `Olá, ${user.username} · ${user.role === 'admin' ? 'Equipe' : 'Membro'}` : 'Visitante · Entre na sua conta para participar';
    await render();
  } catch (error) { $('forum-session').textContent = 'Fórum desconectado'; $('forum-content').innerHTML = `<div class="simple-panel"><h1>Fórum indisponível</h1><p>${escape(error.message)}</p><button id="retry-forum" class="btn-outline">TENTAR NOVAMENTE</button></div>`; }
}
start();
