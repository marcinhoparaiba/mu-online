import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { markNotificationsReadAction } from "../../actions";
import { Container, Panel, PageHeader } from "@/components/ui";

export const metadata = { title: "Notificações" };

export default async function Page() {
  const u = await requireUser();
  const rows = db.prepare(`SELECT n.*, EXISTS(SELECT 1 FROM notification_reads r WHERE r.notification_id=n.id AND r.user_id=?) AS is_read
    FROM notifications n WHERE n.user_id=? OR n.user_id IS NULL ORDER BY n.id DESC LIMIT 50`).all(u.id, u.id) as { id: number; title: string; body: string; href: string | null; created_at: string; is_read: number }[];
  return (
    <Container className="max-w-3xl">
      <PageHeader title="Notificações" />
      <Panel title="Caixa de entrada" action={<form action={markNotificationsReadAction}><button className="text-[11px] text-ash hover:text-gold-light">Marcar todas como lidas</button></form>}>
        <ul className="divide-y divide-white/5">
          {rows.map((n) => (
            <li key={n.id} className={`py-3 ${n.is_read ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-2">{!n.is_read && <span className="h-2 w-2 rounded-full bg-ruby-light" />}<p className="font-display text-sm text-gold-light">{n.title}</p></div>
              <p className="text-sm text-parchment/80">{n.body}</p>
              <div className="mt-1 flex gap-3 text-[11px] text-ash"><span>{new Date(n.created_at.replace(" ", "T") + "Z").toLocaleString("pt-BR")}</span>{n.href && <Link className="hover:text-gold-light" href={n.href}>Abrir →</Link>}</div>
            </li>
          ))}
        </ul>
      </Panel>
    </Container>
  );
}
