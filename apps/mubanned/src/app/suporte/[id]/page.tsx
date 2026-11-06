import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { can } from "@/lib/permissions";
import { replyTicketAction, setTicketStatusAction } from "../../actions";
import { ActionForm, Submit } from "@/components/ActionForm";
import { Container, PageHeader, Panel } from "@/components/ui";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const u = await requireUser();
  const id = Number((await params).id);
  const t = db.prepare("SELECT * FROM tickets WHERE id=?").get(id) as { id: number; user_id: number; subject: string; category: string; status: string } | undefined;
  const staff = can(u.role, "tickets.manage");
  if (!t || (t.user_id !== u.id && !staff)) notFound();
  const msgs = db.prepare("SELECT m.*, u.username, u.role FROM ticket_messages m JOIN users u ON u.id=m.user_id WHERE ticket_id=? ORDER BY m.id").all(id) as { id: number; body: string; username: string; role: string; created_at: string }[];
  return (
    <Container className="max-w-3xl">
      <PageHeader kicker={`Ticket #${t.id} · ${t.category}`} title={t.subject} subtitle={`Status: ${t.status}`} />
      <div className="space-y-3">
        {msgs.map((m) => (
          <div key={m.id} className={`panel p-4 ${m.role !== "player" ? "border-gold-dark" : ""}`}>
            <p className="text-xs text-ash"><strong className={m.role !== "player" ? "text-gold-light" : "text-parchment"}>{m.username}</strong>{m.role !== "player" && " · Equipe"} · {new Date(m.created_at.replace(" ", "T") + "Z").toLocaleString("pt-BR")}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm">{m.body}</p>
          </div>
        ))}
      </div>
      {t.status !== "fechado" && (
        <Panel title="Responder" className="mt-6">
          <ActionForm action={replyTicketAction}>
            <input type="hidden" name="ticket_id" value={t.id} />
            <textarea name="body" rows={4} className="input" required maxLength={4000} />
            <Submit>Enviar</Submit>
          </ActionForm>
        </Panel>
      )}
      {staff && (
        <form action={setTicketStatusAction} className="mt-4 flex items-center gap-2">
          <input type="hidden" name="ticket_id" value={t.id} />
          <select name="status" defaultValue={t.status} className="input w-auto">{["aberto", "respondido", "fechado"].map((s) => <option key={s}>{s}</option>)}</select>
          <button className="btn btn-ghost">Alterar status</button>
        </form>
      )}
      <Link href={staff ? "/admin/tickets" : "/suporte"} className="mt-6 inline-block text-sm text-ash hover:text-gold-light">← Voltar</Link>
    </Container>
  );
}
