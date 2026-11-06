import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { currentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { loginAction, logoutAction } from "./actions";
import { ActionForm, Submit } from "@/components/ActionForm";
export const metadata: Metadata = { title: { default: "MuBanneD - Editavel", template: "%s · MuBanneD" }, description: "MuBanneD - Editavel. Portal do jogador: rankings, eventos, notícias e comunidade." };
export const dynamic = "force-dynamic";
const nav = [["/home","Home"],["/cadastro","Cadastrar"],["/download","Downloads"],["/ranking","Ranking"],["/forum","Fórum"],["/loja","Shopping"],["/loja","GoldsWay’s"],["/revenda","Revenda"]];
const side = [["/ajuda","Ajuda (F.A.Q.)"],["/loja","GoldsWay’s"],["/informacoes","Informações"],["/equipe","Equipe"],["/comunidade/facebook","Facebook"],["/comunidade/twitter","Twitter"],["/comunidade/instagram","Instagram"],["/comunidade/twitch","Twitch"],["/comunidade/discord","Discord"]];
export default async function RootLayout({children}:{children:React.ReactNode}) {
 const user=await currentUser();
 return <html lang="pt-BR"><body><a className="skip-link" href="#conteudo">Ir ao conteúdo</a>
 <div className="portal-wrap"><header className="realm-header"><div className="castle castle-left"/><div className="castle castle-right"/><Link href="/" className="realm-brand"><img src="/brand/mubanned-logomarca-v1.png" alt="MuBanneD - Editavel" width={360} height={120}/></Link><p>Seu equipamento. Sua estratégia. Sua vitória.</p></header>
 <nav className="silver-nav" aria-label="Menu principal">{nav.map(([href,label])=><Link key={label} href={href}>{label}</Link>)}</nav>
 <div className="portal-columns"><aside className="portal-sidebar"><nav aria-label="Menu da comunidade" className="side-menu">{side.map(([href,label])=><Link key={href} href={href}><span aria-hidden="true">▸</span>{label}</Link>)}</nav>
 <section className="side-box"><h2>Painel do usuário</h2>{user?<div className="account-box"><p>Olá, <strong>{user.username}</strong></p><Link href="/painel/personagens">Gerenciar personagens</Link><Link href="/painel/jogo">Gerenciar guilds</Link><Link href="/painel/jogo">Ferramentas</Link><Link href="/suporte">Suporte</Link><Link href="/loja">Minhas compras</Link><Link href="/eventos">Eventos</Link><Link className="btn btn-gold" href="/painel">Minha conta</Link><Link href="/painel/notificacoes">Notificações</Link>{can(user.role,"admin.access")&&<Link href="/admin">Administração</Link>}<form action={logoutAction}><button className="btn btn-ghost w-full">Sair da conta</button></form></div>:<div className="account-box"><ActionForm action={loginAction} resetOnOk={false}><div><label htmlFor="side-login" className="label">Login</label><input id="side-login" name="username" autoComplete="username" className="input" required /></div><div><label htmlFor="side-pass" className="label">Senha</label><input id="side-pass" type="password" name="password" autoComplete="current-password" className="input" required /></div><Submit className="btn btn-gold w-full">Entrar na conta</Submit></ActionForm><Link href="/cadastro">Criar uma conta grátis</Link><Link href="/suporte">Preciso de ajuda para entrar</Link></div>}</section>
 <Link href="/download" className="download-tile"><strong>Jogue MuBanneD</strong><span>Download do cliente →</span></Link><section className="side-box"><h2>Servidor</h2><div className="account-box"><p>97D + 99i · Editavel</p><p className="text-xs text-ash">GameServer não conectado</p><Link href="/informacoes">Conheça o servidor →</Link></div></section></aside>
 <main id="conteudo" className="portal-content">{children}</main></div>
 <footer className="portal-footer"><nav aria-label="Rodapé">{[["/ajuda","Tutoriais"],["/eventos","Eventos"],["/suporte","Contato"],["/termos","Termos"],["/informacoes","Servidor"]].map(([h,l])=><Link href={h} key={h}>{l}</Link>)}</nav><p>© {new Date().getFullYear()} MuBanneD - Editavel</p><p>Projeto independente, sem vínculo com a Webzen. Rankings demonstrativos até a integração do GameServer.</p></footer></div></body></html>
}
