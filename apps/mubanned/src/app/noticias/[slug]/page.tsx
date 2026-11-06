import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Container, PageHeader, Panel } from "@/components/ui";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = db.prepare("SELECT * FROM news WHERE slug=?").get(slug) as { title: string; category: string; body: string; published_at: string } | undefined;
  if (!n) notFound();
  return (
    <Container className="max-w-3xl">
      <PageHeader kicker={n.category} title={n.title} subtitle={new Date(n.published_at.replace(" ", "T")).toLocaleDateString("pt-BR", { dateStyle: "long" })} />
      <Panel>
        <article className="space-y-4 leading-relaxed text-parchment/90">
          {n.body.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
        </article>
      </Panel>
      <Link href="/noticias" className="mt-6 inline-block text-sm text-ash hover:text-gold-light">← Todas as notícias</Link>
    </Container>
  );
}
