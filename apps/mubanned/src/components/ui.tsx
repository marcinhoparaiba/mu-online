import type { ReactNode } from "react";

export function Panel({ title, children, className = "", action }: { title?: ReactNode; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <section className={`panel ${className}`}>
      {title && (
        <header className="panel-title justify-between">
          <span className="flex-1">{title}</span>
          {action}
        </header>
      )}
      <div className="p-4 md:p-5">{children}</div>
    </section>
  );
}

export function PageHeader({ title, subtitle, kicker }: { title: string; subtitle?: string; kicker?: string }) {
  return (
    <div className="relative mb-8 overflow-hidden border-b border-[#3a301d] pb-8 pt-12 text-center fade-up">
      {kicker && <p className="mb-2 font-display text-xs uppercase tracking-[.35em] text-ruby-light">{kicker}</p>}
      <h1 className="font-display text-3xl font-bold text-gold-grad md:text-5xl">{title}</h1>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-ash">{subtitle}</p>}
      <div className="divider-ornate mx-auto mt-6 w-64" />
    </div>
  );
}

export function DemoBadge({ label = "Dados fictícios" }: { label?: string }) {
  return <span className="badge badge-demo" title="Ainda não há GameServer conectado">{label}</span>;
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 ${className}`}>{children}</div>;
}

export function FormMessage({ state }: { state?: { error?: string; ok?: string } | null }) {
  if (!state) return null;
  if (state.error) return <p role="alert" className="rounded border border-ruby/60 bg-ruby/10 px-3 py-2 text-sm text-ruby-light">{state.error}</p>;
  if (state.ok) return <p className="rounded border border-gold-dark bg-gold/10 px-3 py-2 text-sm text-gold-light">{state.ok}</p>;
  return null;
}

export const TIER_NAME = ["", "Bronze", "Prata", "Ouro", "Rubi Imperial"];
