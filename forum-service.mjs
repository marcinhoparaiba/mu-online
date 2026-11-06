/** Fórum inicial persistido pelo armazenamento de teste do portal. */
const categories = [
  { id: 'anuncios', name: 'Anúncios oficiais', staffOnly: true },
  { id: 'eventos', name: 'Eventos e torneios', staffOnly: true },
  { id: 'duvidas', name: 'Dúvidas e ajuda', staffOnly: false },
  { id: 'comunidade', name: 'Comunidade e guildas', staffOnly: false },
  { id: 'sugestoes', name: 'Sugestões', staffOnly: false },
];

export function createForumService({ store, transact, uid, json, fail, body, limit }) {
  store.forum ??= { topics: [], audit: [] };
  const author = id => {
    const u = store.users.find(user => user.id === id);
    return { username: u?.username || 'Conta indisponível', role: u?.role || 'player' };
  };
  const summary = t => ({ id: t.id, categoryId: t.categoryId, title: t.title, author: author(t.authorId), createdAt: t.createdAt, updatedAt: t.updatedAt, locked: t.locked, replies: t.posts.length - 1 });
  const validText = (value, min, max) => typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;
  const page = url => Math.max(1, Math.min(10000, Number.parseInt(url.searchParams.get('page'), 10) || 1));
  const audit = (action, user, topicId, extra = {}) => store.forum.audit.push({ id: uid(), action, by: user.id, topicId, at: new Date().toISOString(), ...extra });
  const deny = (status, message) => { throw Object.assign(new Error(message), { status }); };

  return async function forum(req, res, url, user) {
    const p = url.pathname;
    if (!p.startsWith('/api/forum/') && !p.startsWith('/api/admin/forum/')) return false;
    const admin = user?.role === 'admin';
    if (p.startsWith('/api/admin/') && !admin) { fail(res, 403, 'Acesso restrito à equipe.'); return true; }
    if (req.method === 'GET' && p === '/api/forum/categories') {
      json(res, 200, { categories: categories.map(c => ({ ...c, topics: store.forum.topics.filter(t => !t.hidden && t.categoryId === c.id).length })) });
      return true;
    }
    if (req.method === 'GET' && p === '/api/forum/topics') {
      const category = url.searchParams.get('category');
      const q = (url.searchParams.get('q') || '').trim().slice(0, 100).toLocaleLowerCase('pt-BR');
      const list = store.forum.topics.filter(t => !t.hidden && (!category || t.categoryId === category) && (!q || `${t.title}\n${t.posts.map(post => post.body).join('\n')}`.toLocaleLowerCase('pt-BR').includes(q))).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      const current = page(url);
      json(res, 200, { topics: list.slice((current - 1) * 20, current * 20).map(summary), page: current, total: list.length, pages: Math.ceil(list.length / 20) });
      return true;
    }
    const match = /^\/api\/forum\/topics\/([a-f0-9]{32})$/.exec(p);
    if (req.method === 'GET' && match) {
      const topic = store.forum.topics.find(t => t.id === match[1] && (!t.hidden || admin));
      if (!topic) { fail(res, 404, 'Tópico não encontrado.'); return true; }
      const current = page(url);
      json(res, 200, { topic: { ...summary(topic), hidden: topic.hidden }, posts: topic.posts.slice((current - 1) * 30, current * 30).map(post => ({ id: post.id, body: post.body, createdAt: post.createdAt, author: author(post.authorId) })), page: current, pages: Math.ceil(topic.posts.length / 30) });
      return true;
    }
    if (req.method === 'POST' && p === '/api/forum/topics') {
      if (!user) { fail(res, 401, 'Entre na sua conta para criar um tópico.'); return true; }
      if (!limit(req, 'forum-create', 5)) { fail(res, 429, 'Aguarde um minuto para criar outro tópico.'); return true; }
      const x = await body(req);
      const category = categories.find(c => c.id === x.categoryId);
      if (!category || !validText(x.title, 4, 120) || !validText(x.body, 10, 6000)) { fail(res, 400, 'Escolha uma categoria, um título de 4–120 caracteres e texto de 10–6000.'); return true; }
      if (category.staffOnly && !admin) { fail(res, 403, 'Apenas a equipe pode publicar nesta categoria.'); return true; }
      const now = new Date().toISOString();
      const topic = { id: uid(), categoryId: category.id, title: x.title.trim(), authorId: user.id, createdAt: now, updatedAt: now, locked: false, hidden: false, posts: [{ id: uid(), authorId: user.id, body: x.body.trim(), createdAt: now }] };
      await transact(() => { store.forum.topics.push(topic); audit('topic-created', user, topic.id); });
      json(res, 201, { topic: summary(topic) });
      return true;
    }
    const reply = /^\/api\/forum\/topics\/([a-f0-9]{32})\/replies$/.exec(p);
    if (req.method === 'POST' && reply) {
      if (!user) { fail(res, 401, 'Entre na sua conta para responder.'); return true; }
      if (!limit(req, 'forum-reply', 15)) { fail(res, 429, 'Muitas respostas. Aguarde um minuto.'); return true; }
      const x = await body(req);
      if (!validText(x.body, 1, 6000)) { fail(res, 400, 'A resposta deve ter de 1 a 6000 caracteres.'); return true; }
      const post = { id: uid(), authorId: user.id, body: x.body.trim(), createdAt: new Date().toISOString() };
      await transact(() => {
        const topic = store.forum.topics.find(t => t.id === reply[1] && !t.hidden);
        if (!topic) deny(404, 'Tópico não encontrado.');
        if (topic.locked) deny(409, 'Este tópico foi fechado pela equipe.');
        topic.posts.push(post); topic.updatedAt = post.createdAt; audit('reply-created', user, topic.id, { postId: post.id });
      });
      json(res, 201, { ok: true });
      return true;
    }
    const moderation = /^\/api\/admin\/forum\/topics\/([a-f0-9]{32})$/.exec(p);
    if (req.method === 'POST' && moderation) {
      const x = await body(req);
      if (!['lock', 'unlock', 'hide', 'restore'].includes(x.action) || !validText(x.reason, 5, 500)) { fail(res, 400, 'Informe uma ação válida e o motivo (5–500 caracteres).'); return true; }
      await transact(() => {
        const topic = store.forum.topics.find(t => t.id === moderation[1]);
        if (!topic) deny(404, 'Tópico não encontrado.');
        const previous = { hidden: topic.hidden, locked: topic.locked };
        if (x.action === 'lock' || x.action === 'unlock') topic.locked = x.action === 'lock';
        else topic.hidden = x.action === 'hide';
        audit(x.action, user, topic.id, { reason: x.reason.trim(), previous });
      });
      json(res, 200, { ok: true });
      return true;
    }
    if (req.method === 'GET' && p === '/api/admin/forum/audit') {
      const current = page(url);
      const list = store.forum.audit.slice().reverse();
      json(res, 200, { entries: list.slice((current - 1) * 50, current * 50), page: current, total: list.length });
      return true;
    }
    fail(res, 404, 'Rota do fórum não encontrada.');
    return true;
  };
}
