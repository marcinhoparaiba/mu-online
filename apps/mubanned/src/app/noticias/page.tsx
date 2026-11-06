import Link from "next/link";
import { db } from "@/lib/db";
import { Container, PageHeader } from "@/components/ui";

export const metadata = { title: "Notícias" };
const CATS = ["Todas", "Anúncio", "Evento", "Guia", "Manutenção"];

export default async function Page({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c = "Todas" } = await searchParams;
  const rows = (c === "Todas"
    ? db.prepare("SELECT * FROM news ORDER BY published_at DESC").all()
    : db.prepare("SELECT * FROM news WHERE category=? ORDER BY published_at DESC").all(c)) as { id: number; slug: string; title: string; category: string; summary: string; published_at: string }[];
  return (
    <Container>
      <PageHeader kicker="Crônicas do reino" title="Notícias" />
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {CATS.map((x) => <Link key={x} href={x === "Todas" ? "/noticias" : `/noticias?c=${encodeURIComponent(x)}`} className={`btn px-3 py-1.5 ${x === c ? "btn-gold" : "btn-ghost"}`}>{x}</Link>)}
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {rows.map((n) => (
          <Link key={n.id} href={`/noticias/${n.slug}`} className="panel group block overflow-hidden fade-up">
            <div className="h-36 bg-[radial-gradient(ellipse_at_70%_30%,rgba(201,162,74,.35),transparent_60%),linear-gradient(135deg,#1d1418,#08070a)]" />
            <div className="p-5">
              <span className="badge border-ruby-light/50 text-ruby-light">{n.category}</span>
              <h2 className="mt-2 font-display text-lg font-bold group-hover:text-gold-light">{n.title}</h2>
              <p className="mt-1 text-sm text-ash">{n.summary}</p>
              <p className="mt-3 text-[11px] text-ash">{new Date(n.published_at.replace(" ", "T")).toLocaleDateString("pt-BR")}</p>
            </div>
          </Link>
        ))}
        {rows.length === 0 && <p className="text-ash">Nenhuma notícia nesta categoria.</p>}
      </div>
    </Container>
  );
}
