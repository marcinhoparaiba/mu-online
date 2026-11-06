import Link from "next/link";
import { requirePerm } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminCreateNewsAction, adminDeleteNewsAction } from "../../actions";
import { ActionForm, Submit } from "@/components/ActionForm";
import { Panel } from "@/components/ui";

export default async function Page() {
  await requirePerm("news.manage");
  const rows = db.prepare("SELECT id,slug,title,category,published_at FROM news ORDER BY published_at DESC").all() as { id: number; slug: string; title: string; category: string; published_at: string }[];
  return (
    <>
      <Panel title="Publicar notícia">
        <ActionForm action={adminCreateNewsAction}>
          <div className="grid gap-3 sm:grid-cols-3">
            <input name="title" placeholder="Título" className="input sm:col-span-2" required />
            <select name="category" className="input">{["Anúncio", "Evento", "Guia", "Manutenção"].map((c) => <option key={c}>{c}</option>)}</select>
          </div>
          <input name="summary" placeholder="Resumo" className="input" required maxLength={300} />
          <textarea name="body" placeholder="Conteúdo (parágrafos separados por linha em branco)" rows={8} className="input" required />
          <label className="flex items-center gap-2 text-sm text-ash"><input type="checkbox" name="notify" /> Notificar todos os jogadores</label>
          <Submit>Publicar</Submit>
        </ActionForm>
      </Panel>
      <Panel title="Notícias">
        <table className="mu"><tbody>{rows.map((n) => (
          <tr key={n.id}><td><Link href={`/noticias/${n.slug}`} className="hover:text-gold-light">{n.title}</Link></td><td className="text-ash">{n.category}</td>
            <td><form action={adminDeleteNewsAction}><input type="hidden" name="id" value={n.id} /><button className="text-xs text-ruby-light hover:underline">Excluir</button></form></td></tr>
        ))}</tbody></table>
      </Panel>
    </>
  );
}
