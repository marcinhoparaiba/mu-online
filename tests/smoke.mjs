import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp,rm } from 'node:fs/promises';
import os from 'node:os';import path from 'node:path';
const dir=await mkdtemp(path.join(os.tmpdir(),'mu-legacy-test-'));
const port=32000+Math.floor(Math.random()*15000);
const url='http://127.0.0.1:'+port;
const admin='moderator-test@localhost.invalid',password='test-password-only-for-smoke-tests';
let child=spawn(process.execPath,['server.mjs'],{cwd:process.cwd(),env:{...process.env,PORT:String(port),MU_DATA_FILE:path.join(dir,'db.json'),MU_ADMIN_EMAIL:admin,MU_ADMIN_PASSWORD:password},stdio:'ignore'});
let alive=false;for(let i=0;i<40;i++){try{let x=await fetch(url+'/api/health');if(x.ok){alive=true;break}}catch{}await new Promise(r=>setTimeout(r,100))}
if(!alive){child.kill();throw Error('Backend de testes não iniciou')}
const call=async(p,body,cookie)=>{const r=await fetch(url+'/api'+p,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,json:await r.json(),cookie:r.headers.get('set-cookie')}};
try{
 await test('conta, senha, sessões, chat, notícias, integração pendente e segurança HTTP',async()=>{
  const gamer=await call('/auth/register',{email:'gamer@example.com',username:'GamerTeste',password:'test-password-long-987'});assert.equal(gamer.status,201);
  const playerCookie=gamer.cookie.split(';')[0];
  const playerMe=await call('/auth/me',undefined,playerCookie);assert.equal(playerMe.json.user.username,'GamerTeste');
  const oldLogin=await call('/auth/login',{email:'gamer@example.com',password:'test-password-long-987'});assert.equal(oldLogin.status,200);
  const invalidPassword=await call('/auth/password',{currentPassword:'wrong-password',password:'replacement-password-123'},playerCookie);assert.equal(invalidPassword.status,401);
  const changed=await call('/auth/password',{currentPassword:'test-password-long-987',password:'replacement-password-123'},playerCookie);assert.equal(changed.status,200);
  const oldSession=await call('/auth/me',undefined,oldLogin.cookie.split(';')[0]);assert.equal(oldSession.json.user,null);
  const newSession=await call('/auth/me',undefined,changed.cookie.split(';')[0]);assert.equal(newSession.json.user.username,'GamerTeste');
  assert.equal((await call('/auth/login',{email:'gamer@example.com',password:'test-password-long-987'})).status,401);
  assert.equal((await call('/auth/login',{email:'gamer@example.com',password:'replacement-password-123'})).status,200);
  assert.equal((await call('/auth/password',{currentPassword:'x',password:'replacement-password-123'})).status,401);
  const game=await call('/game/status');assert.equal(game.json.version,'1.0M');assert.equal(game.json.connected,false);assert.equal(game.json.darkLord.verified,false);
  assert.equal(game.json.editor.maxLevel,15);assert.equal(game.json.editor.transparentFrom,12);
  const rankings=await call('/rankings');assert.equal(rankings.json.categories.length,13);assert.equal(rankings.json.source,'unavailable');assert.ok(rankings.json.categories.every(c=>c.entries.length===0));
  for(const file of ['server.mjs','tests/smoke.mjs','game-server/config.mjs','package.json'])assert.equal((await fetch(url+'/'+file)).status,404);
  assert.equal((await fetch(url+'/public.js')).status,200);
  assert.equal((await fetch(url+'/',{headers:{cookie:'mu_session=%E0%A4%A'}})).status,200);
  const crossOrigin=await fetch(url+'/api/auth/logout',{method:'POST',headers:{origin:'https://other.example','Content-Type':'application/json'},body:'{}'});assert.equal(crossOrigin.status,403);
  const forbidden=await call('/admin/chats');assert.equal(forbidden.status,403);
  const chat=await call('/chat/start',{name:'GamerTeste',message:'Posso falar com um moderador?'});assert.equal(chat.status,201);
  const adminSession=await call('/auth/login',{email:admin,password});assert.equal(adminSession.status,200);const cook=adminSession.cookie.split(';')[0];
  const response=await call('/admin/reply',{chat_id:chat.json.chat_id,message:'Olá! Estamos respondendo pelo painel da equipe.'},cook);assert.equal(response.status,200);
  const transcript=await call('/chat/'+chat.json.chat_id+'?token='+chat.json.token);assert.equal(transcript.status,200);assert.equal(transcript.json.messages.length,2);
  assert.equal((await call('/chat/'+chat.json.chat_id+'?token=wrong')).status,404);
  assert.equal((await call('/admin/close-chat',{chat_id:chat.json.chat_id},cook)).status,200);
  assert.equal((await call('/chat/message',{chat_id:chat.json.chat_id,token:chat.json.token,message:'Testando conversa encerrada'})).status,409);
  assert.equal((await call('/chat/start',{name:'GamerTeste',message:'Novo atendimento'})).status,201);
  const news=await call('/admin/news',{title:'Novo evento PvP oficial',body:'Os eventos do projeto serão definidos em breve.'},cook);assert.equal(news.status,201);
  const published=await call('/news');assert.equal(published.json.articles.length,1);
 });
}finally{child.kill();await rm(dir,{force:true,recursive:true})}
