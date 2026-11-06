import Link from "next/link";
import {db} from "@/lib/db";
import {ClassicRanking} from "@/components/ClassicRanking";
export default function Home(){
 const news=db.prepare("SELECT slug,title,category,published_at FROM news ORDER BY published_at DESC LIMIT 10").all() as {slug:string;title:string;category:string;published_at:string}[];
 const players=db.prepare("SELECT name,class,resets,level,master_level FROM demo_characters ORDER BY resets DESC LIMIT 15").all().map(r=>({...r})) as {name:string;class:string;resets:number;level:number;master_level:number}[];
 return <div className="reference-home"><Link href="/loja" className="reference-banner"><img src="/reference/banner.jpg" alt="Coleção de equipamentos — Shopping"/><span>MuBanneD - Editavel · Shopping</span></Link><ClassicRanking players={players}/><p className="ranking-note">Atenção: rankings demonstrativos. GameServer ainda não conectado.</p><section className="reference-news"><h2>Últimas notícias...</h2>{news.map(n=><Link key={n.slug} href={'/noticias/'+n.slug}>[{new Date(n.published_at.replace(' ','T')).toLocaleDateString('pt-BR')}] [{n.category}] {n.title.replaceAll('MU EC Reborn','MuBanneD - Editavel')}</Link>)}</section></div>
}