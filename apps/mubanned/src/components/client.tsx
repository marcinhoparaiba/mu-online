"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export function Embers({ count = 26 }: { count?: number }) {
  const [items, setItems] = useState<{ left: number; dur: number; delay: number; size: number }[]>([]);
  useEffect(() => {
    setItems(Array.from({ length: count }, () => ({
      left: Math.random() * 100, dur: 9 + Math.random() * 12, delay: -Math.random() * 20, size: 1.5 + Math.random() * 2.5,
    })));
  }, [count]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((e, i) => (
        <span key={i} className="ember" style={{ left: `${e.left}%`, animationDuration: `${e.dur}s`, animationDelay: `${e.delay}s`, width: e.size, height: e.size }} />
      ))}
    </div>
  );
}

export function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  if (now === null) return <span className="tabular-nums">--:--:--</span>;
  const diff = Math.max(0, new Date(target).getTime() - now);
  const d = Math.floor(diff / 86400000), h = Math.floor(diff / 3600000) % 24, m = Math.floor(diff / 60000) % 60, s = Math.floor(diff / 1000) % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return <span className="tabular-nums">{d > 0 ? `${d}d ` : ""}{p(h)}:{p(m)}:{p(s)}</span>;
}

export function LocalTime({ iso, withDay = false }: { iso: string; withDay?: boolean }) {
  const [txt, setTxt] = useState("");
  useEffect(() => {
    const d = new Date(iso);
    setTxt(d.toLocaleString("pt-BR", withDay ? { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" } : { hour: "2-digit", minute: "2-digit" }));
  }, [iso, withDay]);
  return <span suppressHydrationWarning>{txt}</span>;
}

type Banner = { id: number; title: string; subtitle: string; theme: string; cta_label: string; cta_href: string };
const THEMES: Record<string, string> = {
  ruby: "radial-gradient(ellipse at 70% 40%, rgba(214,58,75,.55), transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(90,10,20,.8), transparent 60%), linear-gradient(135deg,#1a0508,#07060a)",
  gold: "radial-gradient(ellipse at 70% 40%, rgba(236,210,142,.40), transparent 55%), radial-gradient(ellipse at 15% 85%, rgba(125,96,38,.6), transparent 60%), linear-gradient(135deg,#1a1306,#07060a)",
  frost: "radial-gradient(ellipse at 70% 40%, rgba(120,170,230,.35), transparent 55%), radial-gradient(ellipse at 15% 85%, rgba(30,50,90,.7), transparent 60%), linear-gradient(135deg,#060b14,#07060a)",
};

export function HeroSlider({ banners }: { banners: Banner[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % banners.length), 7000);
    return () => clearInterval(t);
  }, [banners.length]);
  const b = banners[i];
  if (!b) return null;
  return (
    <div className="relative h-[420px] overflow-hidden md:h-[520px]">
      {banners.map((x, k) => (
        <div key={x.id} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: k === i ? 1 : 0, background: THEMES[x.theme] ?? THEMES.ruby }}>
          <HeroFigure theme={x.theme} />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/30 to-transparent" />
      <Embers />
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16">
        <div key={b.id} className="max-w-2xl fade-up">
          <p className="mb-3 font-display text-xs uppercase tracking-[.4em] text-gold">MuBanneD - Editavel · 97D+99i</p>
          <h2 className="font-display text-4xl font-black leading-tight text-gold-grad md:text-6xl">{b.title}</h2>
          <p className="mt-4 text-lg text-parchment/85">{b.subtitle}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={b.cta_href} className="btn btn-ruby">{b.cta_label}</Link>
            <Link href="/download" className="btn btn-ghost">Baixar cliente</Link>
          </div>
        </div>
        <div className="mt-8 flex gap-2">
          {banners.map((x, k) => (
            <button key={x.id} aria-label={`Banner ${k + 1}`} onClick={() => setI(k)}
              className={`h-1.5 transition-all ${k === i ? "w-10 bg-gold" : "w-5 bg-ash/40 hover:bg-ash"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Silhueta estilizada de guerreiro com asas (SVG original, sem arte proprietária). */
function HeroFigure({ theme }: { theme: string }) {
  const c = theme === "frost" ? "#9cc4f0" : theme === "gold" ? "#ecd28e" : "#ff6a78";
  return (
    <svg aria-hidden viewBox="0 0 600 600" className="absolute right-[-80px] top-1/2 h-[130%] -translate-y-1/2 opacity-70 md:right-[5%]">
      <defs>
        <radialGradient id={`g-${theme}`} cx="50%" cy="45%" r="50%">
          <stop offset="0" stopColor={c} stopOpacity=".55" /><stop offset="1" stopColor={c} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`w-${theme}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={c} stopOpacity=".9" /><stop offset="1" stopColor="#000" stopOpacity=".2" />
        </linearGradient>
      </defs>
      <circle cx="300" cy="270" r="260" fill={`url(#g-${theme})`} className="glow-pulse" />
      <path d="M300 230 C210 150 120 120 40 150 C110 175 150 210 170 260 C120 250 80 265 50 300 C120 295 170 310 205 345 C170 360 150 390 140 430 C200 395 250 360 290 320 Z" fill={`url(#w-${theme})`} opacity=".75" />
      <path d="M300 230 C390 150 480 120 560 150 C490 175 450 210 430 260 C480 250 520 265 550 300 C480 295 430 310 395 345 C430 360 450 390 460 430 C400 395 350 360 310 320 Z" fill={`url(#w-${theme})`} opacity=".75" />
      <g fill="#050407">
        <circle cx="300" cy="170" r="30" />
        <path d="M270 200 L330 200 L355 330 L330 470 L310 470 L300 360 L290 470 L270 470 L245 330 Z" />
        <path d="M262 215 L225 320 L240 325 L278 230 Z" /><path d="M338 215 L375 320 L360 325 L322 230 Z" />
        <rect x="372" y="120" width="8" height="230" transform="rotate(12 376 235)" />
      </g>
      <path d="M300 140 l-14 -26 l14 10 l14 -10 z" fill={c} opacity=".9" />
    </svg>
  );
}

export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(!open)} className="btn btn-ghost px-3 py-2">☰</button>
      {open && (
        <nav className="absolute left-0 right-0 top-full z-50 border-b border-[#3a301d] bg-coal/98 px-4 py-3 shadow-2xl">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block border-b border-white/5 py-2.5 font-display text-sm uppercase tracking-widest text-parchment hover:text-gold-light">{l.label}</Link>
          ))}
        </nav>
      )}
    </div>
  );
}

export function EventCountdownList({ items }: { items: { id: number; name: string; kind: string; next: string }[] }) {
  const sorted = useMemo(() => [...items].sort((a, b) => a.next.localeCompare(b.next)), [items]);
  return (
    <ul className="divide-y divide-white/5">
      {sorted.map((e) => (
        <li key={e.id} className="flex items-center justify-between gap-3 py-2.5">
          <div>
            <p className="font-display text-sm text-parchment">{e.name}</p>
            <p className="text-xs text-ash">{e.kind} · <LocalTime iso={e.next} withDay /></p>
          </div>
          <span className="rounded border border-gold-dark/60 bg-black/40 px-2 py-1 font-mono text-sm text-gold-light"><Countdown target={e.next} /></span>
        </li>
      ))}
    </ul>
  );
}
