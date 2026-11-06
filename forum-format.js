/** Formatação limitada: sempre escapa HTML antes de inserir tags conhecidas. */
const escape = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function formatPost(text){
 return String(text).split('\n').map(line=>{
  const quoted=line.startsWith('> ');if(quoted)line=line.slice(2);
  const html=line.split(/(`[^`]*`)/g).map((part,i)=>{
   if(i%2)return '<code>'+escape(part.slice(1,-1))+'</code>';
   return escape(part).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>');
  }).join('');
  return quoted?'<blockquote>'+html+'</blockquote>':html;
 }).join('\n');
}
