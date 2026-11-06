import { db } from "@/lib/db";
import { Container, PageHeader, DemoBadge } from "@/components/ui";

export const metadata = { title: "Hall da Fama" };
const ICON: Record<string, string> = { Campeonato: "🏆", "Castle Siege": "🏰", Marco: "⭐" };

export default async function Page() {
  const rows = db.prepare("SELECT * FROM achievements ORDER BY date DESC").all() as { id: number; title: string; season: string; winner: string; kind: string; date: string }[];
  return (
    <Container className="max-w-4xl">
      <PageHeader kicker="Lendas do reino" title="Hall da Fama" subtitle="Histórico de conquistas, campeonatos e marcos do servidor." />
      <div className="mb-4 text-center"><DemoBadge label="Registros fictícios de demonstração" /></div>
      <ol className="relative space-y-5 border-l border-gold-dark/50 pl-8">
        {rows.map((a) => (
          <li key={a.id} className="panel p-5">
            <span className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full border border-gold bg-coal text-xs">{ICON[a.kind] ?? "◆"}</span>
            <p className="text-[11px] uppercase tracking-widest text-ash">{a.season} · {new Date(a.date + "T12:00").toLocaleDateString("pt-BR")}</p>
            <h2 className="font-display text-lg font-bold text-gold-light">{a.title}</h2>
            <p className="text-sm">{a.winner}</p>
          </li>
        ))}
      </ol>
    </Container>
  );
}
