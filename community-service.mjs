import { roles, can, roleName, participationTitle } from './community-policy.js';
import { exportEvent } from './calendar-export.mjs';
export function createCommunityService({ store, transact, uid, json, fail, body, limit, revokeSessions = () => {} }) {
  store.community ??= { profiles: {}, notifications: [], messages: [], reports: [], audit: [] };
  const c = store.community;
  c.events ??= [];
  const text = (v, min, max) => typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;
  const deny = (status, message) => { throw Object.assign(new Error(message), { status }); };
  const visible = () => (store.forum?.topics || []).filter(t => !t.hidden);
  const postCount = id => visible().filter(t => t.countsPosts !== false).reduce((sum,t) => sum + t.posts.filter(p => p.authorId === id && !p.hidden).length, 0);
  const reputation = id => visible().flatMap(t => t.posts).filter(p => p.authorId === id && !p.hidden).reduce((sum,p) => sum + (p.likes || []).length, 0);
  const profile = u => ({ id: u.id, username: u.username, role: u.role, roleName: roleName(u.role), createdAt: u.created_at, bio: c.profiles[u.id]?.bio || '', signature: c.profiles[u.id]?.signature || '', posts: postCount(u.id), reputation: reputation(u.id), title: participationTitle(postCount(u.id)) });
  const notify = (userId, message, topicId = null) => {
    c.notifications.push({ id: uid(), userId, message, topicId, read: false, at: new Date().toISOString() });
    const own = c.notifications.filter(n => n.userId === userId);
    if (own.length > 200) { const discard = new Set(own.slice(0, own.length - 200).map(n => n.id)); c.notifications = c.notifications.filter(n => !discard.has(n.id)); }
  };
  const audit = (user, action, targetId, reason, previous) => c.audit.push({ id: uid(), by: user.id, action, targetId, reason, previous, at: new Date().toISOString() });
  const pageOf = url => Math.max(1, Math.min(10000, parseInt(url.searchParams.get('page'),10) || 1));
  const paginate = (items, url) => { const page = pageOf(url); return { entries: items.slice((page-1)*20,page*20), page, pages: Math.ceil(items.length/20), total: items.length }; };
  async function service(req, res, url, user) {
    const p = url.pathname, m = req.method;
    if (!p.startsWith('/api/community/') && !p.startsWith('/api/admin/community/')) return false;
    const adminPath = p.startsWith('/api/admin/');
    if (adminPath && !can(user,'moderate') && !can(user,'users')) { fail(res,403,'Acesso restrito à equipe.'); return true; }
    if (m === 'GET' && p === '/api/community/roles') { json(res,200,{ roles }); return true; }
    if (m === 'GET' && p === '/api/community/members') {
      const q=(url.searchParams.get('q')||'').toLocaleLowerCase('pt-BR').slice(0,100);
      let entries=store.users.filter(u => !q || u.username.toLocaleLowerCase('pt-BR').includes(q)).map(profile);
      if(url.searchParams.get('staff')==='true') entries=entries.filter(u=>u.role!=='player').sort((a,b)=>(roles.find(r=>r.id===b.role)?.level||0)-(roles.find(r=>r.id===a.role)?.level||0));
      else entries.sort((a,b)=>a.username.localeCompare(b.username));
      json(res,200,paginate(entries,url));return true;
    }
    if(m==='GET' && p==='/api/community/leaders') {
      const metric=url.searchParams.get('metric')==='reputation'?'reputation':'posts';
      json(res,200,{metric,...paginate(store.users.map(profile).filter(u=>u[metric]>0).sort((a,b)=>b[metric]-a[metric]||a.username.localeCompare(b.username)),url)});return true;
    }
    if(m==='GET' && p==='/api/community/activity') { json(res,200,paginate(visible().flatMap(t=>t.posts.filter(p=>!p.hidden).map(p=>({topicId:t.id,title:t.title,author:profile(store.users.find(u=>u.id===p.authorId)||{id:p.authorId,username:'Conta indisponível',role:'player'}),at:p.createdAt}))).sort((a,b)=>b.at.localeCompare(a.at)),url));return true; }
    if(m==='GET' && p==='/api/community/events'){json(res,200,paginate(c.events.slice().sort((a,b)=>a.startsAt.localeCompare(b.startsAt)).map(e=>({...e,attendees:undefined,going:e.attendees.length,joined:e.attendees.includes(user?.id)})),url));return true;}
    const calendar=/^\/api\/community\/events\/([a-f0-9]{32})\/calendar\.ics$/.exec(p);
    if(m==='GET' && calendar){
      const event=c.events.find(e=>e.id===calendar[1]);
      if(!event){fail(res,404,'Evento não encontrado.');return true;}
      res.writeHead(200,{'Content-Type':'text/calendar; charset=utf-8','Content-Disposition':`attachment; filename="mu-banned-${event.id}.ics"`,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
      res.end(exportEvent(event));return true;
    }
    const member=/^\/api\/community\/members\/([a-f0-9]{32})$/.exec(p);
    if(m==='GET' && member) {const u=store.users.find(u=>u.id===member[1]);if(!u)fail(res,404,'Membro não encontrado.');else json(res,200,{member:profile(u)});return true;}
    if(!user){fail(res,401,'Entre na sua conta para continuar.');return true;}
    if(m==='POST' && !limit(req,'community-write',40)){fail(res,429,'Aguarde um minuto.');return true;}
    if(m==='POST' && p==='/api/community/events'){
      if(!can(user,'official')){fail(res,403,'Somente a equipe de publicação agenda eventos.');return true;}
      const x=await body(req);const start=typeof x.startsAt==='string'?Date.parse(x.startsAt):NaN,end=typeof x.endsAt==='string'?Date.parse(x.endsAt):NaN;
      if(!text(x.title,4,120)||!text(x.description,10,3000)||!Number.isFinite(start)||!Number.isFinite(end)||end<=start||!text(x.reason,5,500)){fail(res,400,'Título, descrição, datas válidas (fim após início) e motivo obrigatórios.');return true;}
      await transact(()=>{const event={id:uid(),title:x.title.trim(),description:x.description.trim(),startsAt:new Date(start).toISOString(),endsAt:new Date(end).toISOString(),by:user.id,status:'scheduled',attendees:[]};c.events.push(event);audit(user,'event-created',event.id,x.reason.trim());});json(res,201,{ok:true});return true;
    }
    if(m==='POST' && p==='/api/community/events/join'){
      const x=await body(req);if(typeof x.enabled!=='boolean'){fail(res,400,'Preferência inválida.');return true;}
      await transact(()=>{const e=c.events.find(e=>e.id===x.id);if(!e)deny(404,'Evento não encontrado.');if(e.status!=='scheduled'||Date.parse(e.endsAt)<Date.now())deny(409,'Evento encerrado ou cancelado.');e.attendees=e.attendees.filter(id=>id!==user.id);if(x.enabled)e.attendees.push(user.id);});json(res,200,{ok:true});return true;
    }
    if(m==='POST' && p==='/api/community/events/cancel'){
      if(!can(user,'official')){fail(res,403,'Permissão de publicação necessária.');return true;}const x=await body(req);if(!text(x.reason,5,500)){fail(res,400,'Informe motivo.');return true;}
      await transact(()=>{const e=c.events.find(e=>e.id===x.id);if(!e)deny(404,'Evento não encontrado.');e.status='cancelled';audit(user,'event-cancelled',e.id,x.reason.trim());});json(res,200,{ok:true});return true;
    }
    if(m==='POST' && p==='/api/community/profile') {
      const x=await body(req);if(!text(x.bio,0,1000)||!text(x.signature,0,300)){fail(res,400,'Biografia até 1000 e assinatura até 300 caracteres.');return true;}
      await transact(()=>{c.profiles[user.id]={...(c.profiles[user.id]||{}),bio:x.bio.trim(),signature:x.signature.trim()};});json(res,200,{member:profile(user)});return true;
    }
    if(m==='GET' && p==='/api/community/notifications'){json(res,200,{...paginate(c.notifications.filter(n=>n.userId===user.id).slice().reverse(),url),unread:c.notifications.filter(n=>n.userId===user.id&&!n.read).length});return true;}
    if(m==='POST' && p==='/api/community/notifications/read'){const x=await body(req);await transact(()=>{c.notifications.filter(n=>n.userId===user.id&&(!x.id||n.id===x.id)).forEach(n=>n.read=true);});json(res,200,{ok:true});return true;}
    if(m==='GET' && p==='/api/community/messages'){json(res,200,paginate(c.messages.filter(n=>n.from===user.id||n.to===user.id).slice().reverse().map(n=>({...n,fromName:store.users.find(u=>u.id===n.from)?.username,toName:store.users.find(u=>u.id===n.to)?.username})),url));return true;}
    if(m==='GET' && p==='/api/community/messages/preferences'){json(res,200,{blocked:!!c.profiles[user.id]?.messagesBlocked});return true;}
    if(m==='POST' && p==='/api/community/messages'){
      const x=await body(req);if(!text(x.body,1,3000)||!text(x.username,3,25)){fail(res,400,'Informe destinatário e mensagem de até 3000 caracteres.');return true;}
      if(!limit(req,'private-message',10)){fail(res,429,'Limite de mensagens por minuto atingido.');return true;}
      await transact(()=>{const to=store.users.find(u=>u.username.toLowerCase()===x.username.toLowerCase());if(!to||to.id===user.id)deny(400,'Destinatário inválido.');if(c.profiles[to.id]?.messagesBlocked)deny(403,'Este membro não recebe mensagens privadas.');c.messages.push({id:uid(),from:user.id,to:to.id,body:x.body.trim(),at:new Date().toISOString()});notify(to.id,'Você recebeu uma mensagem privada.');});json(res,201,{ok:true});return true;
    }
    if(m==='POST' && p==='/api/community/messages/preferences'){const x=await body(req);if(typeof x.blocked!=='boolean'){fail(res,400,'Preferência inválida.');return true;}await transact(()=>{c.profiles[user.id]={...(c.profiles[user.id]||{}),messagesBlocked:x.blocked};});json(res,200,{ok:true});return true;}
    if(m==='POST' && p==='/api/community/reports'){
      const x=await body(req);if(!text(x.reason,5,1000)||!text(x.topicId,32,32)){fail(res,400,'Informe tópico e motivo de 5 a 1000 caracteres.');return true;}
      if(!limit(req,'report',5)){fail(res,429,'Aguarde para enviar outra denúncia.');return true;}
      await transact(()=>{const t=store.forum.topics.find(t=>t.id===x.topicId&&!t.hidden);if(!t||x.postId&&!t.posts.some(p=>p.id===x.postId&&!p.hidden))deny(404,'Conteúdo não encontrado.');c.reports.push({id:uid(),by:user.id,topicId:t.id,postId:x.postId||null,reason:x.reason.trim(),status:'open',at:new Date().toISOString()});});json(res,201,{ok:true});return true;
    }
    if(m==='GET' && p==='/api/admin/community/reports'){json(res,200,paginate(c.reports.slice().reverse(),url));return true;}
    if(m==='POST' && p==='/api/admin/community/reports'){
      const x=await body(req);if(!text(x.reason,5,500)){fail(res,400,'Informe o motivo da resolução.');return true;}await transact(()=>{const r=c.reports.find(r=>r.id===x.id);if(!r)deny(404,'Denúncia não encontrada.');r.status='resolved';r.resolution=x.reason.trim();r.resolvedBy=user.id;audit(user,'report-resolved',r.id,x.reason.trim());});json(res,200,{ok:true});return true;
    }
    if(m==='GET' && p==='/api/admin/community/audit'){json(res,200,paginate(c.audit.slice().reverse(),url));return true;}
    if(m==='POST' && p==='/api/admin/community/users'){
      if(!can(user,'users')){fail(res,403,'Somente administrador pode alterar cargos e suspensões.');return true;}
      const x=await body(req);if(!text(x.reason,5,500)||!['role','suspend','restore'].includes(x.action)){fail(res,400,'Ação e motivo obrigatórios.');return true;}
      await transact(()=>{const target=store.users.find(u=>u.id===x.userId);if(!target)deny(404,'Membro não encontrado.');if(target.id===user.id)deny(409,'Não altere seu próprio acesso administrativo.');if(target.role==='admin'&&store.users.filter(u=>u.role==='admin'&&(!u.suspendedUntil||Date.parse(u.suspendedUntil)<Date.now())).length<=1)deny(409,'Preserve ao menos um administrador ativo.');
        const previous={role:target.role,suspendedUntil:target.suspendedUntil||null};
        if(x.action==='role'){if(!roles.some(r=>r.id===x.role))deny(400,'Cargo inválido.');target.role=x.role;}
        if(x.action==='suspend'){if(!Number.isInteger(x.days)||x.days<1||x.days>365)deny(400,'Suspensão de 1 a 365 dias.');target.suspendedUntil=new Date(Date.now()+x.days*86400000).toISOString();}
        if(x.action==='restore')delete target.suspendedUntil;
        audit(user,x.action,target.id,x.reason.trim(),previous);revokeSessions(target.id);
      });json(res,200,{ok:true});return true;
    }
    fail(res,404,'Recurso da comunidade não encontrado.');return true;
  }
  return { service, notify, profile };
}
