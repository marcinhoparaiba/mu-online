import Link from "next/link";
import { requirePerm } from "@/lib/auth";
import { can, ROLE_LABEL, type Role, type Permission } from "@/lib/permissions";
import { Container } from "@/components/ui";

const LINKS: [string, string, Permission][] = [
  ["/admin", "Visão geral", "admin.access"], ["/admin/noticias", "Notícias", "news.manage"], ["/admin/banners", "Banners", "banners.manage"],
  ["/admin/eventos", "Eventos", "events.manage"], ["/admin/promocoes", "Promoções", "promotions.manage"], ["/admin/loja", "Loja", "shop.manage"],
  ["/admin/tickets", "Tickets", "tickets.manage"], ["/admin/notificacoes", "Notificações", "notifications.send"], ["/admin/usuarios", "Usuários", "users.manage"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const u = await requirePerm("admin.access");
  return (
    <Container className="pt-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#3a301d] pb-4">
        <h1 className="font-display text-2xl font-bold text-gold-grad">Painel administrativo</h1>
        <span className="badge border-gold-dark text-gold-light">{ROLE_LABEL[u.role as Role]}</span>
      </div>
      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <nav className="panel flex flex-row flex-wrap gap-1 p-2 md:flex-col">
          {LINKS.filter(([, , p]) => can(u.role, p)).map(([h, l]) => <Link key={h} href={h} className="rounded px-3 py-2 text-sm text-parchment/80 hover:bg-gold/10 hover:text-gold-light">{l}</Link>)}
        </nav>
        <div className="min-w-0 space-y-6">{children}</div>
      </div>
    </Container>
  );
}
