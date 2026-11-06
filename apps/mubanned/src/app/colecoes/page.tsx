import { db } from "@/lib/db";
import { Container, PageHeader } from "@/components/ui";

export const metadata = { title: "Coleções temáticas" };
const BG: Record<string, string> = {
  frost: "radial-gradient(ellipse at 70% 30%, rgba(120,170,230,.4), transparent 60%), linear-gradient(135deg,#071020,#07060a)",
  ruby: "radial-gradient(ellipse at 70% 30%, rgba(214,58,75,.45), transparent 60%), linear-gradient(135deg,#1a0508,#07060a)",
  gold: "radial-gradient(ellipse at 70% 30%, rgba(236,210,142,.38), transparent 60%), linear-gradient(135deg,#1a1306,#07060a)",
};

export default async function Page() {
  const cols = db.prepare("SELECT * FROM collections").all() as { id: number; slug: string; name: string; period: string; description: string; theme: string }[];
  const items = db.prepare("SELECT name, collection_id FROM custom_items WHERE collection_id IS NOT NULL").all() as { name: string; collection_id: number }[];
  return (
    <Container>
      <PageHeader kicker="Datas comemorativas" title="Coleções temáticas" subtitle="Itens cosméticos sazonais liberados em eventos especiais ao longo do ano." />
      <div className="grid gap-6 md:grid-cols-2">
        {cols.map((c) => (
          <div key={c.id} className="panel overflow-hidden">
            <div className="relative h-44 p-6" style={{ background: BG[c.theme] ?? BG.gold }}>
              <p className="font-display text-xs uppercase tracking-[.35em] text-parchment/70">{c.period}</p>
              <h2 className="mt-1 font-display text-3xl font-black text-gold-grad">{c.name}</h2>
              <p className="mt-2 max-w-sm text-sm text-parchment/80">{c.description}</p>
            </div>
            <div className="p-5">
              <p className="label">Itens da coleção</p>
              <ul className="text-sm">{items.filter((i) => i.collection_id === c.id).map((i) => <li key={i.name}>✦ {i.name}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
