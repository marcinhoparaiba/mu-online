import Link from "next/link";
import { db } from "@/lib/db";
import { Container, PageHeader, TIER_NAME } from "@/components/ui";

export const metadata = { title: "Catálogo de itens custom" };

export default async function Page({ searchParams }: { searchParams: Promise<{ src?: string }> }) {
  const { src = "" } = await searchParams;
  const items = (src ? db.prepare("SELECT i.*, c.name AS col FROM custom_items i LEFT JOIN collections c ON c.id=i.collection_id WHERE source=? ORDER BY tier DESC").all(src)
    : db.prepare("SELECT i.*, c.name AS col FROM custom_items i LEFT JOIN collections c ON c.id=i.collection_id ORDER BY tier DESC").all()) as { id: number; name: string; kind: string; tier: number; source: string; description: string; col: string | null }[];
  return (
    <Container>
      <PageHeader kicker="Arsenal exclusivo" title="Catálogo de itens custom" subtitle="Itens exclusivamente cosméticos, obtidos em eventos de GM ou pacotes de apoio." />
      <div className="mb-6 flex justify-center gap-2">
        {[["", "Todos"], ["gm_event", "Eventos de GM"], ["donate", "Pacotes de apoio"]].map(([v, l]) => (
          <Link key={v} href={v ? `/catalogo?src=${v}` : "/catalogo"} className={`btn px-3 py-1.5 ${src === v ? "btn-gold" : "btn-ghost"}`}>{l}</Link>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((i) => (
          <div key={i.id} className={`tier-${i.tier} panel p-5 transition hover:-translate-y-0.5`}>
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border text-3xl" style={{ borderColor: "var(--tier)", boxShadow: "0 0 24px color-mix(in srgb, var(--tier) 35%, transparent)" }}>
              {({ Asas: "🪽", Conjunto: "🛡️", Elmo: "👑", Capa: "🧥", Acessório: "🚩" } as Record<string, string>)[i.kind] ?? "✦"}
            </div>
            <p className="text-center text-[10px] uppercase tracking-[.25em]" style={{ color: "var(--tier)" }}>{TIER_NAME[i.tier]} · {i.kind}</p>
            <h2 className="mt-1 text-center font-display font-bold text-parchment">{i.name}</h2>
            <p className="mt-2 text-center text-xs text-ash">{i.description}</p>
            <p className="mt-3 text-center text-[11px] text-gold">{i.source === "gm_event" ? "Evento de GM" : "Pacote de apoio"}{i.col ? ` · ${i.col}` : ""}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
