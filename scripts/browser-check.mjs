import {spawn} from 'node:child_process';
import {mkdtemp,rm,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import os from 'node:os';
import assert from 'node:assert/strict';
const cwd=fileURLToPath(new URL('../',import.meta.url));
if(typeof WebSocket==='undefined')throw Error('A revisão no navegador requer Node.js 22+ e Chromium.');
const dir=await mkdtemp(path.join(os.tmpdir(),'mu-browser-'));
const port=48000+Math.floor(Math.random()*1000);
const server=spawn(process.execPath,['server.mjs'],{cwd,env:{...process.env,PORT:String(port),MU_DATA_FILE:path.join(dir,'store.json'),MU_ADMIN_EMAIL:'browser-admin@example.invalid',MU_ADMIN_PASSWORD:'browser-admin-password-12345'},stdio:['ignore','pipe','pipe']});
const chrome=spawn(process.env.CHROME_BIN||'/usr/bin/chromium',['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-debugging-port=0','--user-data-dir='+path.join(dir,'chrome'),'about:blank'],{stdio:['ignore','ignore','pipe']});
let socket, seq=0;const pending=new Map();let exceptions=[];
const delay=ms=>new Promise(r=>setTimeout(r,ms));
try{
 const wsUrl=await new Promise((resolve,reject)=>{let log='';const timer=setTimeout(()=>reject(Error('Chrome timeout')),15000);chrome.stderr.on('data',b=>{log+=b;const match=log.match(/DevTools listening on (ws:\/\/\S+)/);if(match){clearTimeout(timer);resolve(match[1]);}});chrome.on('error',reject);});
 for(let i=0;i<80;i++){try{if((await fetch('http://127.0.0.1:'+port+'/api/health')).ok)break}catch{}await delay(100);}
 socket=new WebSocket(wsUrl);await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j;});
 socket.onmessage=({data})=>{const msg=JSON.parse(data);if(msg.id){const task=pending.get(msg.id);pending.delete(msg.id);if(msg.error)task?.reject(Error(JSON.stringify(msg.error)));else task?.resolve(msg.result);}else if(msg.method==='Runtime.exceptionThrown')exceptions.push(msg.params.exceptionDetails.text+' '+JSON.stringify(msg.params.exceptionDetails.exception?.description));};
 const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));});
 const {targetId}=await send('Target.createTarget',{url:'about:blank'});
 const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
 const cdp=(m,p)=>send(m,p,sessionId);
 await cdp('Page.enable');await cdp('Runtime.enable');
 const evaluate=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 const navigate=async route=>{await cdp('Page.navigate',{url:`http://127.0.0.1:${port}/${route}`});for(let i=0;i<80;i++){await delay(100);if(await evaluate("document.readyState==='complete'"))break;}await delay(500);};
 const browserApi=(p,data)=>evaluate(`fetch('/api'+${JSON.stringify(p)},{method:${JSON.stringify(data===undefined?'GET':'POST')},headers:{'Content-Type':'application/json'},body:${data===undefined?'undefined':JSON.stringify(JSON.stringify(data))}}).then(async r=>({status:r.status,data:await r.json()}))`);
 const waitFor=async expression=>{for(let i=0;i<60;i++){if(await evaluate(expression))return;await delay(100);}throw Error('UI timeout: '+expression);};
 await navigate('shop.html');
 assert.equal((await browserApi('/auth/login',{email:'browser-admin@example.invalid',password:'browser-admin-password-12345'})).status,200);
 const seedProduct=await browserApi('/admin/shop/products',{name:'Cosmético de teste visual',description:'Produto sintético para revisão do navegador.',category:'cosmeticos',priceCents:1590,active:true,reason:'Revisão automatizada'});assert.equal(seedProduct.status,200);
 await browserApi('/auth/logout',{});
 assert.equal((await browserApi('/auth/register',{email:'browser-player@example.invalid',username:'BrowserPlayer',password:'browser-player-password-9876'})).status,201);
 const output=process.env.MU_REVIEW_DIR||path.join(dir,'screenshots');await mkdir(output,{recursive:true});
 for(const [width,height,label]of [[1440,960,'desktop'],[390,844,'mobile'],[320,760,'narrow']]){
  await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<700});
  await navigate('intro.html');
  assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,'intro horizontal overflow '+label);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.hero-art')).backgroundImage.includes('intro-hero.webp')"),true);
  await evaluate("document.getElementById('level-range').value=12;document.getElementById('level-range').dispatchEvent(new Event('input',{bubbles:true}))");
  assert.equal(await evaluate("document.getElementById('forge-sword').classList.contains('transparent')"),true);
  await evaluate("document.getElementById('level-range').value=11;document.getElementById('level-range').dispatchEvent(new Event('input',{bubbles:true}))");
  assert.equal(await evaluate("document.getElementById('forge-sword').classList.contains('transparent')"),false);
  await evaluate("document.getElementById('effects-toggle').click()");
  assert.equal(await evaluate("document.documentElement.classList.contains('reduced-effects')"),true);
  await evaluate("document.getElementById('effects-toggle').click()");
  if(width!==320){await delay(1500);const shot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(output,'intro-'+label+'.png'),Buffer.from(shot.data,'base64'));}
  await navigate('index.html#ranking');
  assert.equal(await evaluate("document.querySelectorAll('[data-full-rank]').length"),13);
  assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,'site horizontal overflow '+label);
  await navigate('portal.html#editor');
  await evaluate("document.getElementById('level-slider').value=15;document.getElementById('level-slider').dispatchEvent(new Event('input',{bubbles:true}))");
  assert.equal(await evaluate("document.querySelector('.preview-panel h3').textContent.endsWith('+15')"),true);
  await evaluate("document.querySelector('[data-action=\"save-item\"]').click();location.hash='personagens'");await delay(200);
  await evaluate("location.hash='editor'");await delay(200);
  assert.equal(await evaluate("document.getElementById('level-slider').value"),'15');
  await navigate('portal.html#colecoes');
  assert.equal(await evaluate("document.querySelectorAll('#app article').length"),9);
  await navigate('forum.html');
  assert.equal(await evaluate("document.querySelectorAll('#forum-categories a').length"),24);
  assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,'forum overflow '+label);
  assert.equal(await evaluate("getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()"),'#0c0a0d');
  assert.equal(await evaluate("document.getElementById('category-drawer').open"),width>720);
  if(width!==320){const shot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(output,'forum-'+label+'.png'),Buffer.from(shot.data,'base64'));}
  
  for(const route of ['index.html#recuperar','index.html#privacidade','index.html#informacoes','forum.html#members','forum.html#hierarchy','forum.html#leaders/posts','forum.html#calendar','forum.html#messages','forum.html#online','shop.html']){
   await navigate(route);assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,'overflow '+route+' '+label);assert.equal(await evaluate("document.body.textContent.includes('Não foi possível abrir')"),false,'route failure '+route);
  }
  if(width!==320){const shot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(output,'shop-'+label+'.png'),Buffer.from(shot.data,'base64'));}
  if(width===1440){
   await waitFor("!!document.querySelector('[data-add]')");await evaluate("document.querySelector('[data-add]').click()");await delay(300);
   await navigate('shop.html#cart');await waitFor("!!document.getElementById('draft-order')");
   assert.equal(await evaluate("document.querySelector('.shop-total').textContent.includes('15,90')"),true);
   await evaluate("document.getElementById('draft-order').requestSubmit()");await waitFor("location.hash==='#orders'&&document.querySelector('.order-lines')!==null");
   assert.equal(await evaluate("document.getElementById('shop-content').textContent.includes('Rascunho')"),true);
   await navigate('forum.html#category/duvidas');
   await evaluate("document.querySelector('#topic-form [name=title]').value='Tópico de navegador';document.querySelector('#topic-form [name=body]').value='Mensagem de revisão automatizada';document.querySelector('#topic-form').requestSubmit()");
   await waitFor("location.hash.startsWith('#topic/')&&document.querySelector('.forum-post')!==null");
   await evaluate("document.querySelector('[data-topic-action=bookmark]').click()");await delay(300);
   await navigate('forum.html#bookmarks');assert.equal(await evaluate("document.querySelectorAll('.topic-card').length"),1);
   await navigate('forum.html#members');await evaluate("[...document.querySelectorAll('#forum-content a')].find(a=>a.textContent==='BrowserPlayer').click()");await waitFor("!!document.getElementById('profile-form')");
   await evaluate("document.querySelector('#profile-form [name=bio]').value='<script>window.BAD=true</script>';document.querySelector('#profile-form [name=signature]').value='Revisão';document.querySelector('#profile-form').requestSubmit()");await delay(300);assert.equal(await evaluate('window.BAD===undefined'),true);
  }
  console.log('PASS',label,width+'x'+height,'intro, editor +15, comunidade e loja');
 }
 
 await browserApi('/auth/logout',{});await browserApi('/auth/login',{email:'browser-admin@example.invalid',password:'browser-admin-password-12345'});
 for(const route of ['forum.html#manage','forum.html#reports','forum.html#audit','forum.html#forum-audit','shop.html#manage','shop.html#audit','staff.html']){
  await navigate(route);assert.equal(await evaluate("document.body.textContent.includes('Não foi possível abrir')"),false,'admin route failure '+route);assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,'admin overflow '+route);
 }
 console.log('PASS telas administrativas, catálogo, cargos e auditoria');
 assert.deepEqual(exceptions,[],'browser exceptions');
 console.log('PASS no uncaught JavaScript exceptions');
}finally{
 socket?.close();chrome.kill('SIGTERM');server.kill('SIGTERM');await delay(500);await rm(dir,{recursive:true,force:true});
}
