import { can } from './community-policy.js';
export function createShopService({store,transact,uid,json,fail,body,limit}){
 store.shop??={products:[],carts:{},orders:[],audit:[]};const shop=store.shop;
 const deny=(status,message)=>{throw Object.assign(new Error(message),{status});};
 const publicProduct=p=>({id:p.id,name:p.name,description:p.description,category:p.category,priceCents:p.priceCents,active:p.active,updatedAt:p.updatedAt});
 const cartOf=id=>{
  const lines=(shop.carts[id]||[]).map(l=>{const p=shop.products.find(p=>p.id===l.productId);return {productId:l.productId,quantity:l.quantity,product:p?publicProduct(p):null,subtotalCents:p?.priceCents===null||!p?null:p.priceCents*l.quantity};});
  return {lines,totalCents:lines.some(l=>l.subtotalCents===null)?null:lines.reduce((s,l)=>s+l.subtotalCents,0),currency:'BRL'};
 };
 return async function(req,res,url,user){
  const p=url.pathname,m=req.method;if(!p.startsWith('/api/shop/')&&!p.startsWith('/api/admin/shop/'))return false;
  if(m==='GET'&&p==='/api/shop/catalog'){json(res,200,{products:shop.products.filter(p=>p.active).map(publicProduct),paymentsEnabled:false,deliveryEnabled:false,mode:'local-draft',message:'Catálogo em preparação. Pedidos são rascunhos, sem cobrança ou entrega de itens.'});return true;}
  if(!user){fail(res,401,'Entre na sua conta do site.');return true;}
  if(p.startsWith('/api/admin/')&&!can(user,'catalog')){fail(res,403,'Você não possui permissão de catálogo.');return true;}
  if(m==='POST'&&!limit(req,'shop-write',30)){fail(res,429,'Aguarde um minuto.');return true;}
  if(m==='GET'&&p==='/api/shop/cart'){json(res,200,cartOf(user.id));return true;}
  if(m==='POST'&&p==='/api/shop/cart'){
   const x=await body(req);if(typeof x.productId!=='string'||!Number.isInteger(x.quantity)||x.quantity<0||x.quantity>20){fail(res,400,'Quantidade entre 0 e 20.');return true;}
   await transact(()=>{const product=shop.products.find(p=>p.id===x.productId);if(!product||(!product.active&&x.quantity>0))deny(404,'Produto indisponível.');const current=shop.carts[user.id]||[];const next=current.filter(l=>l.productId!==x.productId);if(x.quantity)next.push({productId:x.productId,quantity:x.quantity});if(next.length>30)deny(400,'Limite de 30 produtos por carrinho.');shop.carts[user.id]=next;});json(res,200,cartOf(user.id));return true;
  }
  if(m==='GET'&&p==='/api/shop/orders'){json(res,200,{orders:shop.orders.filter(o=>o.userId===user.id).slice(-100).reverse(),paymentsEnabled:false,deliveryEnabled:false});return true;}
  if(m==='POST'&&p==='/api/shop/orders'){
   const x=await body(req);if(typeof x.idempotencyKey!=='string'||!/^[a-zA-Z0-9_-]{16,80}$/.test(x.idempotencyKey)){fail(res,400,'Chave de pedido inválida.');return true;}
   const order=await transact(()=>{const old=shop.orders.find(o=>o.userId===user.id&&o.idempotencyKey===x.idempotencyKey);if(old)return old;
    const cart=cartOf(user.id);if(!cart.lines.length)deny(409,'Carrinho vazio.');if(cart.lines.some(l=>!l.product?.active||l.subtotalCents===null))deny(409,'Revise os produtos indisponíveis ou sem preço.');
    const order={id:uid(),userId:user.id,idempotencyKey:x.idempotencyKey,status:'draft',createdAt:new Date().toISOString(),currency:'BRL',totalCents:cart.totalCents,lines:cart.lines.map(l=>({productId:l.productId,name:l.product.name,quantity:l.quantity,unitPriceCents:l.product.priceCents,subtotalCents:l.subtotalCents})),paymentStatus:'disabled',deliveryStatus:'disabled'};
    shop.orders.push(order);shop.carts[user.id]=[];return order;
   });json(res,201,{order,paymentsEnabled:false,deliveryEnabled:false});return true;
  }
  if(m==='POST'&&p==='/api/shop/orders/cancel'){
   const x=await body(req);await transact(()=>{const o=shop.orders.find(o=>o.id===x.id&&o.userId===user.id);if(!o)deny(404,'Pedido não encontrado.');if(o.status==='cancelled')return;o.status='cancelled';o.cancelledAt=new Date().toISOString();});json(res,200,{ok:true});return true;
  }
  if(m==='POST'&&p==='/api/shop/checkout'){fail(res,503,'Pagamentos e entrega estão desativados. Nenhuma cobrança foi criada.');return true;}
  if(m==='GET'&&p==='/api/admin/shop/products'){json(res,200,{products:shop.products.map(publicProduct)});return true;}
  if(m==='POST'&&p==='/api/admin/shop/products'){
   const x=await body(req);if(typeof x.name!=='string'||x.name.trim().length<3||x.name.length>100||typeof x.description!=='string'||x.description.length>2000||!['cosmeticos','campanhas','servicos'].includes(x.category)||typeof x.active!=='boolean'||(x.priceCents!==null&&(!Number.isInteger(x.priceCents)||x.priceCents<0||x.priceCents>100000000))||typeof x.reason!=='string'||x.reason.trim().length<5||x.reason.length>500){fail(res,400,'Preencha nome, descrição, categoria, preço em centavos ou null e motivo.');return true;}
   const product=await transact(()=>{let product;if(x.id){product=shop.products.find(p=>p.id===x.id);if(!product)deny(404,'Produto não encontrado.');}const previous=product?{...product}:null;if(!product){product={id:uid()};shop.products.push(product);}Object.assign(product,{name:x.name.trim(),description:x.description.trim(),category:x.category,priceCents:x.priceCents,active:x.active,updatedAt:new Date().toISOString()});shop.audit.push({id:uid(),by:user.id,productId:product.id,action:previous?'updated':'created',previous,reason:x.reason.trim(),at:product.updatedAt});return product;});json(res,200,{product:publicProduct(product)});return true;
  }
  if(m==='GET'&&p==='/api/admin/shop/audit'){json(res,200,{entries:shop.audit.slice(-100).reverse()});return true;}
  fail(res,404,'Recurso da loja não encontrado.');return true;
 };
}
