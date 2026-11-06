import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { brl } from "@/lib/schedule";
import { checkoutAction } from "../actions";
import { ActionForm, Submit } from "@/components/ActionForm";
import { Container, PageHeader, TIER_NAME } from "@/components/ui";
import Link from "next/link";

export const metadata = { title: "Loja de cosméticos" };

export default async function Page() {
  const user = await currentUser();
  const packs = db.prepare("SELECT * FROM shop_packages WHERE active=1 ORDER BY tier").all() as { id: number; name: string; tier: number; price_cents: number; description: string; contents: string }[];
  return (
    <Container>
      <PageHeader kicker="Apoie o servidor" title="Loja de cosméticos" subtitle="Pacotes exclusivamente visuais. Quanto maior o nível, mais sofisticado o visual — nunca mais forte." />
      <div className="mb-8 grid gap-3 text-center text-sm sm:grid-cols-3">
        {["Sem vantagem competitiva", "Itens comuns editáveis grátis no jogo", "Itens custom negociáveis no Mercado"].map((t) => (
          <div key={t} className="rounded border border-gold-dark/40 bg-black/30 px-4 py-3 text-gold-light">◆ {t}</div>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {packs.map((p) => (
          <div key={p.id} className={`tier-${p.tier} panel flex flex-col overflow-hidden`} style={{ borderColor: "color-mix(in srgb, var(--tier) 55%, #000)" }}>
            <div className="relative h-36" style={{ background: `radial-gradient(ellipse at 50% 60%, color-mix(in srgb, var(--tier) ${20 + p.tier * 12}%, transparent), transparent 70%), #0a090c` }}>
              <svg viewBox="0 0 100 60" className="absolute inset-0 m-auto h-24 w-auto" aria-hidden>
                <path d="M50 30 C35 12 15 8 3 14 C18 18 24 26 26 34 C34 32 42 32 50 38 C58 32 66 32 74 34 C76 26 82 18 97 14 C85 8 65 12 50 30 Z" fill="var(--tier)" opacity={0.35 + p.tier * 0.15} />
                {p.tier >= 3 && <circle cx="50" cy="30" r={p.tier * 4} fill="none" stroke="var(--tier)" strokeOpacity=".5" className="glow-pulse" />}
              </svg>
              <span className="absolute left-3 top-3 badge" style={{ color: "var(--tier)", borderColor: "var(--tier)" }}>{TIER_NAME[p.tier]}</span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h2 className="font-display text-lg font-bold text-parchment">{p.name}</h2>
              <p className="text-sm text-ash">{p.description}</p>
              <ul className="mt-3 flex-1 space-y-1 text-sm">{(JSON.parse(p.contents) as string[]).map((c) => <li key={c} className="text-parchment/85">✦ {c}</li>)}</ul>
              <p className="mt-4 font-display text-2xl text-gold-light">{brl(p.price_cents)}</p>
              {user ? (
                <ActionForm action={checkoutAction} className="mt-3 space-y-2" resetOnOk={false}>
                  <input type="hidden" name="package_id" value={p.id} />
                  <Submit className="btn btn-ruby w-full">Adquirir</Submit>
                </ActionForm>
              ) : <Link href="/login?next=/loja" className="btn btn-ghost mt-3 w-full">Entre para adquirir</Link>}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-ash">Pagamentos ainda não estão configurados — nenhum valor é cobrado. A entrega dos itens no jogo dependerá da integração com o GameServer.</p>
    </Container>
  );
}
