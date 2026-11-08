import { requirePerm } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminCreateBannerAction } from "../../actions";
import { ActionForm, Submit } from "@/components/ActionForm";
import { Toggle } from "@/components/Toggle";
import { Panel } from "@/components/ui";

export default async function Page() {
  await requirePerm("banners.manage");
  const rows = db.prepare("SELECT * FROM banners ORDER BY sort").all() as { id: number; title: string; theme: string; cta_href: string; active: number; sort: number }[];
  return (
    <>
      <Panel title="Novo banner da página inicial">
        <ActionForm action={adminCreateBannerAction}>
          <input name="title" placeholder="Título" className="input" required />
          <input name="subtitle" placeholder="Subtítulo" className="input" required />
          <div className="grid gap-3 sm:grid-cols-4">
            <select name="theme" className="input"><option value="ruby">Rubi</option><option value="gold">Dourado</option><option value="frost">Gelo</option></select>
            <input name="cta_label" placeholder="Texto do botão" className="input" />
            <input name="cta_href" placeholder="/eventos" defaultValue="/" className="input" />
            <input name="sort" type="number" placeholder="Ordem" className="input" />
          </div>
          <Submit>Criar banner</Submit>
        </ActionForm>
      </Panel>
      <Panel title="Banners">
        <table className="mu"><thead><tr><th>Ordem</th><th>Título</th><th>Tema</th><th>Link</th><th>Status</th></tr></thead><tbody>
          {rows.map((b) => <tr key={b.id}><td>{b.sort}</td><td>{b.title}</td><td>{b.theme}</td><td className="text-ash">{b.cta_href}</td><td><Toggle table="banners" id={b.id} active={b.active} /></td></tr>)}
        </tbody></table>
      </Panel>
    </>
  );
}
