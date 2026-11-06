import { db } from "@/lib/db";
import { nextOccurrences, describeSchedule, type EventRow } from "@/lib/schedule";
import { Countdown, LocalTime } from "@/components/client";
import { Container, PageHeader } from "@/components/ui";

export const metadata = { title: "Calendário de eventos" };
const KIND_COLOR: Record<string, string> = { Arena: "#d63a4b", PvP: "#e0884f", Invasão: "#c9a24a", Guerra: "#b04ad6", GM: "#4fb3e0" };

export default async function Page() {
  const events = db.prepare("SELECT * FROM events WHERE active=1").all() as EventRow[];
  const now = new Date();
  const rows = events.map((e) => ({ ...e, next: nextOccurrences(e.schedule, now, 4).map((d) => d.toISOString()) }))
    .sort((a, b) => (a.next[0] ?? "").localeCompare(b.next[0] ?? ""));
  return (
    <Container>
      <PageHeader kicker="Agenda automática" title="Calendário de eventos" subtitle="Horários calculados automaticamente a partir das regras de cada evento e exibidos no seu fuso horário." />
      <div className="grid gap-5 md:grid-cols-2">
        {rows.map((e) => (
          <div key={e.id} className="panel p-5 fade-up" style={{ borderLeft: `3px solid ${KIND_COLOR[e.kind] ?? "#c9a24a"}` }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="badge" style={{ color: KIND_COLOR[e.kind], borderColor: KIND_COLOR[e.kind] }}>{e.kind}</span>
                <h2 className="mt-2 font-display text-xl font-bold text-gold-light">{e.name}</h2>
                <p className="text-sm text-ash">{e.description}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-ash">Começa em</p>
                <p className="font-mono text-2xl text-parchment">{e.next[0] && <Countdown target={e.next[0]} />}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/5 pt-3 text-xs text-ash">
              <span className="mr-2">{describeSchedule(e.schedule)} · {e.duration_min} min</span>
              {e.next.map((d) => <span key={d} className="rounded border border-white/10 bg-black/30 px-2 py-0.5 text-parchment/80"><LocalTime iso={d} withDay /></span>)}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
