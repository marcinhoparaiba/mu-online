import Link from "next/link";
import { db } from "@/lib/db";
import { Container, PageHeader, Panel, DemoBadge } from "@/components/ui";

export const metadata = { title: "Ranking" };
const CLASSES = ["Todas", "Dark Knight", "Dark Wizard", "Fairy Elf", "Magic Gladiator", "Dark Lord"];

export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string; cls?: string }> }) {
  const { tab = "personagens", cls = "Todas" } = await searchParams;
  const chars = (cls === "Todas"
    ? db.prepare("SELECT * FROM demo_characters ORDER BY resets DESC, level DESC").all()
    : db.prepare("SELECT * FROM demo_characters WHERE class=? ORDER BY resets DESC, level DESC").all(cls)) as { id: number; name: string; class: string; level: number; resets: number; master_level: number; guild: string | null; online: number }[];
  const guilds = db.prepare("SELECT * FROM demo_guilds ORDER BY score DESC").all() as { id: number; name: string; master: string; members: number; score: number; castle_owner: number }[];
  return (
    <Container>
      <PageHeader kicker="Glória e honra" title="Ranking" subtitle="Classificação atualizada a partir do GameServer." />
      <p className="mb-4 rounded border border-[#7a5520] bg-[#7a5520]/10 px-4 py-2 text-center text-sm text-[#f0b35a]">Os dados abaixo são <strong>fictícios</strong>. O ranking real será exibido após a conexão com o GameServer.</p>
      <div className="mb-5 flex justify-center gap-2">
        <Link href="/ranking" className={`btn ${tab !== "guilds" ? "btn-gold" : "btn-ghost"}`}>Personagens</Link>
        <Link href="/ranking?tab=guilds" className={`btn ${tab === "guilds" ? "btn-gold" : "btn-ghost"}`}>Guilds</Link>
      </div>
      {tab === "guilds" ? (
        <Panel title="Guilds" action={<DemoBadge />}>
          <div className="overflow-x-auto"><table className="mu"><thead><tr><th>#</th><th>Guild</th><th>Mestre</th><th>Membros</th><th>Pontos</th></tr></thead><tbody>
            {guilds.map((g, i) => <tr key={g.id}><td className="font-display text-gold">{i + 1}</td><td>{g.castle_owner ? "👑 " : ""}{g.name}</td><td>{g.master}</td><td>{g.members}</td><td className="text-gold-light">{g.score.toLocaleString("pt-BR")}</td></tr>)}
          </tbody></table></div>
        </Panel>
      ) : (
        <Panel title="Personagens" action={<DemoBadge />}>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {CLASSES.map((c) => <Link key={c} href={c === "Todas" ? "/ranking" : `/ranking?cls=${encodeURIComponent(c)}`} className={`rounded border px-2.5 py-1 text-xs ${c === cls ? "border-gold bg-gold/15 text-gold-light" : "border-white/10 text-ash hover:text-parchment"}`}>{c}</Link>)}
          </div>
          <div className="overflow-x-auto"><table className="mu"><thead><tr><th>#</th><th>Personagem</th><th>Classe</th><th>Level</th><th>Master</th><th>Resets</th><th>Guild</th><th>Status</th></tr></thead><tbody>
            {chars.map((c, i) => (
              <tr key={c.id}><td className="font-display text-gold">{i + 1}</td><td className="font-medium">{c.name}</td><td className="text-ash">{c.class}</td><td>{c.level}</td><td>{c.master_level}</td><td className="text-gold-light">{c.resets}</td><td>{c.guild ?? "—"}</td>
                <td>{c.online ? <span className="text-emerald-400">● Online</span> : <span className="text-ash">● Offline</span>}</td></tr>
            ))}
          </tbody></table></div>
        </Panel>
      )}
    </Container>
  );
}
