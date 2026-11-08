import Link from "next/link";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { createListingAction, closeListingAction } from "../actions";
import { ActionForm, Submit } from "@/components/ActionForm";
import { Container, PageHeader, Panel } from "@/components/ui";

export const metadata = { title: "Mercado" };
const CURRENCIES = ["Zen", "Jewel of Bless", "Jewel of Soul", "Jewel of Chaos", "Jewel of Life", "WCoin"];

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const user = await currentUser();
  const rows = db.prepare(`SELECT l.*, u.username FROM market_listings l JOIN users u ON u.id=l.seller_id
    WHERE l.status='aberto' AND l.item_name LIKE ? ORDER BY l.id DESC LIMIT 100`).all(`%${q.slice(0, 50)}%`) as { id: number; item_name: string; price_amount: number; price_currency: string; note: string; username: string; seller_id: number; created_at: string }[];
  return (
    <Container>
      <PageHeader kicker="Comércio entre jogadores" title="Mercado" subtitle="Anuncie seus itens custom e defina o preço em moedas do jogo. A negociação é feita entre jogadores, dentro do jogo." />
      <p className="mb-6 text-center text-xs text-ash">O site não converte valores em reais nem realiza saques. Negociações fora das moedas do jogo violam as regras.</p>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="Anúncios abertos">
            <form className="mb-4 flex gap-2"><input name="q" defaultValue={q} placeholder="Buscar item…" className="input" /><button className="btn btn-ghost">Buscar</button></form>
            {rows.length === 0 ? <p className="text-sm text-ash">Nenhum anúncio encontrado.</p> : (
              <div className="overflow-x-auto"><table className="mu"><thead><tr><th>Item</th><th>Preço</th><th>Vendedor</th><th>Obs.</th><th /></tr></thead><tbody>
                {rows.map((r) => (
                  <tr key={r.id}><td className="font-medium text-gold-light">{r.item_name}</td><td>{r.price_amount.toLocaleString("pt-BR")} <span className="text-ash">{r.price_currency}</span></td><td>{r.username}</td><td className="max-w-[220px] truncate text-ash">{r.note}</td>
                    <td>{user && (user.id === r.seller_id || can(user.role, "market.moderate")) && <form action={closeListingAction}><input type="hidden" name="id" value={r.id} /><button className="text-xs text-ruby-light hover:underline">{user.id === r.seller_id ? "Encerrar" : "Remover"}</button></form>}</td></tr>
                ))}
              </tbody></table></div>
            )}
          </Panel>
        </div>
        <Panel title="Novo anúncio">
          {user ? (
            <ActionForm action={createListingAction}>
              <div><label className="label">Item</label><input name="item_name" className="input" required maxLength={80} placeholder="Ex.: Asas do Lorde Rubi" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="label">Valor</label><input name="price_amount" type="number" min={1} className="input" required /></div>
                <div><label className="label">Moeda</label><select name="price_currency" className="input">{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></div>
              </div>
              <div><label className="label">Observação</label><textarea name="note" maxLength={300} rows={3} className="input" placeholder="Personagem para contato, horário…" /></div>
              <Submit className="btn btn-gold w-full">Publicar</Submit>
            </ActionForm>
          ) : <p className="text-sm text-ash"><Link href="/login?next=/mercado" className="text-gold-light hover:underline">Entre</Link> para anunciar.</p>}
        </Panel>
      </div>
    </Container>
  );
}
