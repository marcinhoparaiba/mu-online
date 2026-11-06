/** Fórum inicial persistido pelo armazenamento de teste do portal. */
import { can } from './community-policy.js';
export const categories = [
  {
    "id": "anuncios",
    "name": "Notícias oficiais",
    "group": "Oficial",
    "staffOnly": true,
    "countsPosts": true
  },
  {
    "id": "avisos",
    "name": "Avisos",
    "group": "Oficial",
    "staffOnly": true,
    "countsPosts": true
  },
  {
    "id": "eventos",
    "name": "Eventos e torneios",
    "group": "Oficial",
    "staffOnly": true,
    "countsPosts": true
  },
  {
    "id": "promocoes",
    "name": "Campanhas",
    "group": "Oficial",
    "staffOnly": true,
    "countsPosts": true
  },
  {
    "id": "manutencoes",
    "name": "Manutenções",
    "group": "Oficial",
    "staffOnly": true,
    "countsPosts": true
  },
  {
    "id": "international",
    "name": "International community",
    "group": "Oficial",
    "staffOnly": false,
    "countsPosts": true
  },
  {
    "id": "duvidas",
    "name": "Dúvidas e ajuda",
    "group": "Suporte",
    "staffOnly": false,
    "countsPosts": true
  },
  {
    "id": "problemas",
    "name": "Problemas",
    "group": "Suporte",
    "staffOnly": false,
    "countsPosts": true
  },
  {
    "id": "elogios",
    "name": "Elogios",
    "group": "Suporte",
    "staffOnly": false,
    "countsPosts": true
  },
  {
    "id": "tutoriais-jogo",
    "name": "Tutoriais do jogo",
    "group": "Tutoriais",
    "staffOnly": true,
    "countsPosts": true
  },
  {
    "id": "tutoriais-forum",
    "name": "Tutoriais do fórum",
    "group": "Tutoriais",
    "staffOnly": true,
    "countsPosts": true
  },
  {
    "id": "tutoriais-computador",
    "name": "Tutoriais de computador",
    "group": "Tutoriais",
    "staffOnly": true,
    "countsPosts": true
  },
  {
    "id": "tutoriais-seguranca",
    "name": "Tutoriais de segurança",
    "group": "Tutoriais",
    "staffOnly": true,
    "countsPosts": true
  },
  {
    "id": "tutoriais-problemas",
    "name": "Soluções de problemas",
    "group": "Tutoriais",
    "staffOnly": true,
    "countsPosts": true
  },
  {
    "id": "tutoriais-site",
    "name": "Tutoriais do site",
    "group": "Tutoriais",
    "staffOnly": true,
    "countsPosts": true
  },
  {
    "id": "compra",
    "name": "Compra de itens no jogo",
    "group": "Comércio",
    "staffOnly": false,
    "countsPosts": false
  },
  {
    "id": "venda",
    "name": "Venda de itens no jogo",
    "group": "Comércio",
    "staffOnly": false,
    "countsPosts": false
  },
  {
    "id": "troca",
    "name": "Troca de itens no jogo",
    "group": "Comércio",
    "staffOnly": false,
    "countsPosts": false
  },
  {
    "id": "galeria",
    "name": "Galeria de exposição",
    "group": "Design",
    "staffOnly": false,
    "countsPosts": true
  },
  {
    "id": "design",
    "name": "Área livre de design",
    "group": "Design",
    "staffOnly": false,
    "countsPosts": false
  },
  {
    "id": "wallpapers",
    "name": "Wallpapers",
    "group": "Design",
    "staffOnly": false,
    "countsPosts": true
  },
  {
    "id": "comunidade",
    "name": "Comunidade e guildas",
    "group": "Convivência",
    "staffOnly": false,
    "countsPosts": true
  },
  {
    "id": "sugestoes",
    "name": "Sugestões",
    "group": "Convivência",
    "staffOnly": false,
    "countsPosts": true
  },
  {
    "id": "barzinho",
    "name": "Barzinho de Lorencia",
    "group": "Convivência",
    "staffOnly": false,
    "countsPosts": true
  }
];

export function createForumService({ store, transact, uid, json, fail, body, limit, notify = () => {}, profile }) {
  store.forum ??= { topics: [], audit: [] };
  const author = id => {
    const u = store.users.find(user => user.id === id);
    return u && profile ? profile(u) : { id, username: u?.username || 'Conta indisponível', role: u?.role || 'player' };
  };
  const summary = t => ({ id: t.id, categoryId: t.categoryId, title: t.title, author: author(t.authorId), createdAt: t.createdAt, updatedAt: t.updatedAt, locked: t.locked, pinned: !!t.pinned, answered: !!t.answered, replies: t.posts.filter(p=>!p.hidden).length - 1 });
  const validText = (value, min, max) => typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;
  const page = url => Math.max(1, Math.min(10000, Number.parseInt(url.searchParams.get('page'), 10) || 1));
  const audit = (action, user, topicId, extra = {}) => store.forum.audit.push({ id: uid(), action, by: user.id, topicId, at: new Date().toISOString(), ...extra });
  const deny = (status, message) => { throw Object.assign(new Error(message), { status }); };

  return async function forum(req, res, url, user) {
    const p = url.pathname;
    if (!p.startsWith('/api/forum/') && !p.startsWith('/api/admin/forum/')) return false;
    const admin = can(user,'moderate');
    if (p.startsWith('/api/admin/') && !admin) { fail(res, 403, 'Acesso restrito à equipe.'); return true; }
    if (req.method === 'GET' && p === '/api/forum/categories') {
      json(res, 200, { categories: categories.map(c => ({ ...c, topics: store.forum.topics.filter(t => !t.hidden && t.categoryId === c.id).length })) });
      return true;
    }
    if (req.method === 'GET' && p === '/api/forum/topics') {
      const category = url.searchParams.get('category');
      const q = (url.searchParams.get('q') || '').trim().slice(0, 100).toLocaleLowerCase('pt-BR');
      const list = store.forum.topics.filter(t => !t.hidden && (!category || t.categoryId === category) && (!q || `${t.title}\n${t.posts.filter(post=>!post.hidden).map(post => post.body).join('\n')}`.toLocaleLowerCase('pt-BR').includes(q))).sort((a, b) => Number(!!b.pinned)-Number(!!a.pinned)||b.updatedAt.localeCompare(a.updatedAt));
      const current = page(url);
      json(res, 200, { topics: list.slice((current - 1) * 20, current * 20).map(summary), page: current, total: list.length, pages: Math.ceil(list.length / 20) });
      return true;
    }
    const match = /^\/api\/forum\/topics\/([a-f0-9]{32})$/.exec(p);
    if (req.method === 'GET' && match) {
      const topic = store.forum.topics.find(t => t.id === match[1] && (!t.hidden || admin));
      if (!topic) { fail(res, 404, 'Tópico não encontrado.'); return true; }
      const current = page(url);
      json(res, 200, { topic: { ...summary(topic), hidden: topic.hidden }, posts: topic.posts.filter(post=>!post.hidden||admin).slice((current - 1) * 30, current * 30).map(post => ({ id: post.id, body: post.hidden&&!admin?'Conteúdo oculto':post.body, hidden:!!post.hidden, editedAt:post.editedAt||null, likes:(post.likes||[]).length, liked:!!post.likes?.includes(user?.id), createdAt: post.createdAt, author: author(post.authorId) })), page: current, pages: Math.ceil(topic.posts.filter(p=>!p.hidden||admin).length / 30), following:!!topic.followers?.includes(user?.id), bookmarked:!!topic.bookmarks?.includes(user?.id) });
      return true;
    }
    if (req.method === 'POST' && p === '/api/forum/topics') {
      if (!user) { fail(res, 401, 'Entre na sua conta para criar um tópico.'); return true; }
      if (!limit(req, 'forum-create', 5)) { fail(res, 429, 'Aguarde um minuto para criar outro tópico.'); return true; }
      const x = await body(req);
      const category = categories.find(c => c.id === x.categoryId);
      if (!category || !validText(x.title, 4, 120) || !validText(x.body, 10, 6000)) { fail(res, 400, 'Escolha uma categoria, um título de 4–120 caracteres e texto de 10–6000.'); return true; }
      if (category.staffOnly && !can(user,'official')) { fail(res, 403, 'Apenas a equipe pode publicar nesta categoria.'); return true; }
      const now = new Date().toISOString();
      const topic = { id: uid(), categoryId: category.id, title: x.title.trim(), authorId: user.id, createdAt: now, updatedAt: now, locked: false, hidden: false, countsPosts:category.countsPosts, posts: [{ id: uid(), authorId: user.id, body: x.body.trim(), createdAt: now }] };
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
        topic.posts.push(post);for(const id of new Set([topic.authorId,...(topic.followers||[])]))if(id!==user.id)notify(id,'Nova resposta: '+topic.title,topic.id); topic.updatedAt = post.createdAt; audit('reply-created', user, topic.id, { postId: post.id });
      });
      json(res, 201, { ok: true });
      return true;
    }
    const topicAction = /^\/api\/forum\/topics\/([a-f0-9]{32})\/(follow|bookmark)$/.exec(p);
    if(req.method==='GET' && p==='/api/forum/bookmarks'){
      if(!user)fail(res,401,'Entre na sua conta.');else json(res,200,{topics:store.forum.topics.filter(t=>!t.hidden&&t.bookmarks?.includes(user.id)).map(summary)});return true;
    }
    if(req.method==='POST' && topicAction){
      if(!user){fail(res,401,'Entre na sua conta.');return true;}
      const x=await body(req);if(typeof x.enabled!=='boolean'){fail(res,400,'Preferência inválida.');return true;}
      await transact(()=>{const t=store.forum.topics.find(t=>t.id===topicAction[1]&&!t.hidden);if(!t)deny(404,'Tópico não encontrado.');const key=topicAction[2]==='follow'?'followers':'bookmarks';t[key]=(t[key]||[]).filter(id=>id!==user.id);if(x.enabled)t[key].push(user.id);});json(res,200,{ok:true});return true;
    }
    const postAction=/^\/api\/forum\/topics\/([a-f0-9]{32})\/posts\/([a-f0-9]{32})\/(like|edit)$/.exec(p);
    if(req.method==='POST' && postAction){
      if(!user){fail(res,401,'Entre na sua conta.');return true;}
      if(!limit(req,'forum-post-action',30)){fail(res,429,'Aguarde um minuto.');return true;}
      const x=await body(req);
      await transact(()=>{const t=store.forum.topics.find(t=>t.id===postAction[1]&&!t.hidden);const post=t?.posts.find(p=>p.id===postAction[2]&&!p.hidden);if(!post)deny(404,'Mensagem não encontrada.');
        if(postAction[3]==='like'){if(post.authorId===user.id)deny(409,'Não é possível curtir a própria mensagem.');if(typeof x.enabled!=='boolean')deny(400,'Preferência inválida.');post.likes=(post.likes||[]).filter(id=>id!==user.id);if(x.enabled)post.likes.push(user.id);}
        else {if(post.authorId!==user.id)deny(403,'Somente o autor pode editar a mensagem.');if(t.locked||Date.now()-Date.parse(post.createdAt)>900000)deny(409,'Edição disponível por 15 minutos em tópicos abertos.');if(!validText(x.body,1,6000))deny(400,'Mensagem de 1 a 6000 caracteres.');audit('post-edited',user,t.id,{postId:post.id,previousBody:post.body});post.body=x.body.trim();post.editedAt=new Date().toISOString();}
      });json(res,200,{ok:true});return true;
    }
    const postModeration=/^\/api\/admin\/forum\/topics\/([a-f0-9]{32})\/posts\/([a-f0-9]{32})$/.exec(p);
    if(req.method==='POST' && postModeration){
      const x=await body(req);if(!['hide','restore'].includes(x.action)||!validText(x.reason,5,500)){fail(res,400,'Ação e motivo obrigatórios.');return true;}
      await transact(()=>{const t=store.forum.topics.find(t=>t.id===postModeration[1]);const post=t?.posts.find(p=>p.id===postModeration[2]);if(!post)deny(404,'Mensagem não encontrada.');if(t.posts[0].id===post.id)deny(409,'Modere o tópico para ocultar a mensagem inicial.');const previous=!!post.hidden;post.hidden=x.action==='hide';audit('post-'+x.action,user,t.id,{postId:post.id,reason:x.reason.trim(),previous});});json(res,200,{ok:true});return true;
    }
    const moderation = /^\/api\/admin\/forum\/topics\/([a-f0-9]{32})$/.exec(p);
    if (req.method === 'POST' && moderation) {
      const x = await body(req);
      if (!['lock', 'unlock', 'hide', 'restore', 'pin', 'unpin', 'answer', 'unanswer', 'move'].includes(x.action) || !validText(x.reason, 5, 500)) { fail(res, 400, 'Informe uma ação válida e o motivo (5–500 caracteres).'); return true; }
      await transact(() => {
        const topic = store.forum.topics.find(t => t.id === moderation[1]);
        if (!topic) deny(404, 'Tópico não encontrado.');
        const previous = { hidden: topic.hidden, locked: topic.locked, pinned:!!topic.pinned, answered:!!topic.answered, categoryId:topic.categoryId };
        if (x.action === 'lock' || x.action === 'unlock') topic.locked = x.action === 'lock';
        else if(['hide','restore'].includes(x.action))topic.hidden = x.action === 'hide';
        else if(['pin','unpin'].includes(x.action))topic.pinned=x.action==='pin';
        else if(['answer','unanswer'].includes(x.action))topic.answered=x.action==='answer';
        else {const category=categories.find(c=>c.id===x.categoryId);if(!category)deny(400,'Categoria inválida.');topic.categoryId=category.id;topic.countsPosts=category.countsPosts;}
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
