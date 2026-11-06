import { requirePerm } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminCreatePromotionAction } from "../../actions";
import { ActionForm, Submit } from "@/components/ActionForm";
import { Toggle } from "@/components/Toggle";
import { Panel } from "@/components/ui";

export default async function Page() {
  await requirePerm("promotions.manage");
  const rows = db.prepare("SELECT * FROM promotions ORDER BY id DESC").all() as { id: number; title: string; ends_at: string | null; active: number }[];
  return (
    <>
      <Panel title="Nova promoção">
        <ActionForm action={adminCreatePromotionAction}>
          <input name="title" placeholder="Título" className="input" required />
          <input name="description" placeholder="Descrição" className="input" required />
          <div><label className="label">Termina em</label><input name="ends_at" type="datetime-local" className="input" /></div>
          <Submit>Criar promoção</Submit>
        </ActionForm>
      </Panel>
      <Panel title="Promoções">
        <table className="mu"><tbody>{rows.map((p) => <tr key={p.id}><td>{p.title}</td><td className="text-ash">{p.ends_at ?? "—"}</td><td><Toggle table="promotions" id={p.id} active={p.active} /></td></tr>)}</tbody></table>
      </Panel>
    </>
  );
}
