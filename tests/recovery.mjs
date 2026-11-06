import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRecoveryService, recoveryMailer } from '../recovery-service.mjs';

test('recuperação: token com validade, uso único, revogação e nenhuma exposição de conta', async()=>{
 const store={users:[{id:'one',email:'one@example.invalid',salt:'old',hash:'old'}]},sent=[],revoked=[];
 let queue=Promise.resolve();
 const options={store,transact:fn=>{const job=queue.then(fn);queue=job.catch(()=>{});return job;},uid:()=> 'new-salt',json:(r,status,data)=>Object.assign(r,{status,data}),fail:(r,status,error)=>Object.assign(r,{status,data:{error}}),body:async req=>req.data,limit:()=>true,hash:(p,s)=>createHash('sha256').update(p+s).digest('hex'),revokeSessions:id=>revoked.push(id),mailer:{resetURL:t=>'https://example.invalid/reset.html#'+t,send:async(email,url)=>sent.push({email,url})}};
 const service=createRecoveryService(options);
 const call=async(path,data)=>{const res={};try{await service({method:'POST',data},res,new URL('http://localhost/api/auth/'+path));}catch(e){res.status=e.status||500;}return res;};
 const existing=await call('forgot',{email:'one@example.invalid'}),missing=await call('forgot',{email:'absent@example.invalid'});
 assert.deepEqual(existing,missing);assert.equal(sent.length,1);
 const token=new URL(sent[0].url).hash.slice(1);assert.equal(token.length,64);assert.ok(!JSON.stringify(store).includes(token));
 assert.equal((await call('reset',{token,password:'short'})).status,400);
 const attempts=await Promise.all([call('reset',{token,password:'replacement-long-123'}),call('reset',{token,password:'different-long-456'})]);
 assert.deepEqual(attempts.map(r=>r.status).sort(),[200,400]);assert.deepEqual(revoked,['one']);assert.equal(store.recoveryTokens.length,0);
 await call('forgot',{email:'one@example.invalid'});const expired=new URL(sent[1].url).hash.slice(1);store.recoveryTokens[0].expires=Date.now()-1;
 assert.equal((await call('reset',{token:expired,password:'replacement-long-123'})).status,400);
 const disabled=createRecoveryService({...options,mailer:null}),res={};await disabled({method:'POST',data:{email:'one@example.invalid'}},res,new URL('http://localhost/api/auth/forgot'));assert.equal(res.status,503);
 assert.equal(recoveryMailer({}),null);
 assert.throws(()=>recoveryMailer({MU_MAIL_API_KEY:'test-only',MU_MAIL_FROM:'test@example.invalid',MU_PUBLIC_URL:'http://example.invalid'}),/HTTPS/);
});
