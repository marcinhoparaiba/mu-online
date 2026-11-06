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
const server=spawn(process.execPath,['server.mjs'],{cwd,env:{...process.env,PORT:String(port),MU_DATA_FILE:path.join(dir,'store.json')},stdio:['ignore','pipe','pipe']});
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
  console.log('PASS',label,width+'x'+height,'intro, editor +15, rankings, fórum');
 }
 assert.deepEqual(exceptions,[],'browser exceptions');
 console.log('PASS no uncaught JavaScript exceptions');
}finally{
 socket?.close();chrome.kill('SIGTERM');server.kill('SIGTERM');await delay(500);await rm(dir,{recursive:true,force:true});
}
