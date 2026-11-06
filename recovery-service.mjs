import { createHash, randomBytes } from 'node:crypto';
const digest = token => createHash('sha256').update(token).digest('hex');
/** Adapter opcional. Sem configuração não há envio nem fingimento de e-mail entregue. */
export function recoveryMailer(env=process.env){
 if(!env.MU_MAIL_API_KEY||!env.MU_MAIL_FROM||!env.MU_PUBLIC_URL)return null;
 const base=new URL(env.MU_PUBLIC_URL);
 if(base.protocol!=='https:'||base.username||base.password||base.search||base.hash)throw Error('MU_PUBLIC_URL deve ser uma URL HTTPS pública sem credenciais, query ou fragmento.');
 return {
  resetURL:token=>{const url=new URL('/reset.html',base);url.hash=token;return url.toString();},
  send:async(email,url)=>{
   const response=await fetch('https://api.resend.com/emails',{method:'POST',signal:AbortSignal.timeout(10000),headers:{Authorization:'Bearer '+env.MU_MAIL_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:env.MU_MAIL_FROM,to:[email],subject:'Recuperação de acesso — MuBanneD',text:`Foi solicitada a recuperação da sua conta do site MuBanneD.\n\nAbra este link em até 15 minutos:\n${url}\n\nSe não foi você, ignore. A equipe nunca solicita sua senha. Este procedimento não altera a conta do GameServer.`})});
   if(!response.ok)throw Error('mail_delivery_failed');
  }
 };
}
export function createRecoveryService({store,transact,uid,json,fail,body,limit,hash,revokeSessions,mailer}){
 store.recoveryTokens??=[];
 return async(req,res,url)=>{
  const p=url.pathname;if(!['/api/auth/forgot','/api/auth/reset'].includes(p))return false;
  if(req.method!=='POST'){fail(res,405,'Use POST.');return true;}
  if(!limit(req,p,5)){fail(res,429,'Muitas tentativas. Aguarde um minuto.');return true;}
  const x=await body(req);
  if(p.endsWith('/forgot')){
   if(!mailer){fail(res,503,'Recuperação por e-mail ainda não configurada. Fale com a equipe pelo suporte.');return true;}
   if(typeof x.email!=='string'||x.email.length>160){fail(res,400,'Informe seu e-mail.');return true;}
   const user=store.users.find(u=>u.email===x.email.toLowerCase());
   if(user&&(!user.suspendedUntil||Date.parse(user.suspendedUntil)<=Date.now())){
    const token=randomBytes(32).toString('hex'),expires=Date.now()+900000;
    await transact(()=>{store.recoveryTokens=store.recoveryTokens.filter(t=>t.expires>Date.now()&&t.userId!==user.id);store.recoveryTokens.push({tokenHash:digest(token),userId:user.id,expires});});
    try{await mailer.send(user.email,mailer.resetURL(token));}catch{console.error('Falha no serviço de recuperação por e-mail; verifique a configuração do provedor.');}
   }
   json(res,200,{ok:true,message:'Se houver uma conta para este endereço e o envio estiver disponível, você receberá instruções. Verifique também o spam.'});return true;
  }
  if(typeof x.token!=='string'||!/^[a-f0-9]{64}$/.test(x.token)||typeof x.password!=='string'||x.password.length<10||x.password.length>256){fail(res,400,'Link inválido ou senha fora do limite de 10 a 256 caracteres.');return true;}
  await transact(()=>{const record=store.recoveryTokens.find(t=>t.tokenHash===digest(x.token)&&t.expires>Date.now());const user=record&&store.users.find(u=>u.id===record.userId&&(!u.suspendedUntil||Date.parse(u.suspendedUntil)<=Date.now()));if(!user)throw Object.assign(Error('Link inválido, expirado ou já utilizado.'),{status:400});user.salt=uid();user.hash=hash(x.password,user.salt);store.recoveryTokens=store.recoveryTokens.filter(t=>t.userId!==user.id);revokeSessions(user.id);});
  json(res,200,{ok:true,message:'Senha alterada. Entre novamente na sua conta.'});return true;
 };
}
