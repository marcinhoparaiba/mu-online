import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createTicketAction } from "../actions";
import { ActionForm, Submit } from "@/components/ActionForm";
import { Container, PageHeader, Panel } from "@/components/ui";

export const metadata = { title: "Suporte" };
const FAQ = [
  ["Esqueci minha senha", "Abra um ticket na categoria Conta informando o e-mail cadastrado."],
  ["Itens custom dão vantagem?", "Não. Todos os itens custom são exclusivamente visuais."],
  ["Posso vender itens por dinheiro real?", "Não. O Mercado aceita apenas moedas do jogo."],
];

export default async function Page() {
  const user = await currentUser();
  const mine = user ? db.prepare("SELECT id,subject,category,status,created_at FROM tickets WHERE user_id=? ORDER BY id DESC").all(user.id) as { id: number; subject: string; category: string; status: string }[] : [];
  return (
    <Container>
      <PageHeader kicker="Central de ajuda" title="Suporte" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Abrir ticket">
            {user ? (
              <ActionForm action={createTicketAction}>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-2"><label className="label">Assunto</label><input name="subject" className="input" required maxLength={120} /></div>
                  <div><label className="label">Categoria</label><select name="category" className="input">{["Conta", "Bug", "Denúncia", "Doação", "Outros"].map((c) => <option key={c}>{c}</option>)}</select></div>
                </div>
                <div><label className="label">Descrição</label><textarea name="body" rows={5} className="input" required minLength={10} maxLength={4000} /></div>
                <Submit>Enviar ticket</Submit>
              </ActionForm>
            ) : <p className="text-sm text-ash"><Link href="/login?next=/suporte" className="text-gold-light hover:underline">Entre</Link> para abrir um ticket.</p>}
          </Panel>
          {user && (
            <Panel title="Meus tickets">
              {mine.length === 0 ? <p className="text-sm text-ash">Nenhum ticket ainda.</p> : (
                <table className="mu"><thead><tr><th>#</th><th>Assunto</th><th>Categoria</th><th>Status</th></tr></thead><tbody>
                  {mine.map((t) => <tr key={t.id}><td>{t.id}</td><td><Link href={`/suporte/${t.id}`} className="hover:text-gold-light">{t.subject}</Link></td><td className="text-ash">{t.category}</td><td className="capitalize">{t.status}</td></tr>)}
                </tbody></table>
              )}
            </Panel>
          )}
        </div>
        <Panel title="Perguntas frequentes">
          <div className="space-y-2">{FAQ.map(([q, a]) => (
            <details key={q} className="rounded border border-white/5 bg-black/30 p-3"><summary className="cursor-pointer font-display text-sm text-gold-light">{q}</summary><p className="mt-2 text-sm text-ash">{a}</p></details>
          ))}</div>
        </Panel>
      </div>
    </Container>
  );
}
