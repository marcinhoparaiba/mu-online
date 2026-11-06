import Link from "next/link";
import { requirePerm } from "@/lib/auth";
import { db } from "@/lib/db";
import { Panel } from "@/components/ui";

export default async function Page() {
  await requirePerm("tickets.manage");
  const rows = db.prepare("SELECT t.*, u.username FROM tickets t JOIN users u ON u.id=t.user_id ORDER BY CASE t.status WHEN 'aberto' THEN 0 WHEN 'respondido' THEN 1 ELSE 2 END, t.id DESC").all() as { id: number; subject: string; category: string; status: string; username: string }[];
  return (
    <Panel title="Tickets">
      {rows.length === 0 ? <p className="text-sm text-ash">Nenhum ticket.</p> : (
        <table className="mu"><thead><tr><th>#</th><th>Assunto</th><th>Jogador</th><th>Categoria</th><th>Status</th></tr></thead><tbody>
          {rows.map((t) => <tr key={t.id}><td>{t.id}</td><td><Link href={`/suporte/${t.id}`} className="hover:text-gold-light">{t.subject}</Link></td><td>{t.username}</td><td className="text-ash">{t.category}</td><td className="capitalize">{t.status}</td></tr>)}
        </tbody></table>
      )}
    </Panel>
  );
}
