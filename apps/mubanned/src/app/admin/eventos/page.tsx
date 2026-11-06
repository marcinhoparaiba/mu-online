import { requirePerm } from "@/lib/auth";
import { db } from "@/lib/db";
import { describeSchedule } from "@/lib/schedule";
import { adminCreateEventAction } from "../../actions";
import { ActionForm, Submit } from "@/components/ActionForm";
import { Toggle } from "@/components/Toggle";
import { Panel } from "@/components/ui";

export default async function Page() {
  await requirePerm("events.manage");
  const rows = db.prepare("SELECT * FROM events ORDER BY name").all() as { id: number; name: string; kind: string; schedule: string; duration_min: number; active: number }[];
  return (
    <>
      <Panel title="Novo evento">
        <ActionForm action={adminCreateEventAction}>
          <div className="grid gap-3 sm:grid-cols-3">
            <input name="name" placeholder="Nome" className="input" required />
            <select name="kind" className="input">{["Arena", "PvP", "Invasão", "Guerra", "GM"].map((k) => <option key={k}>{k}</option>)}</select>
            <input name="duration_min" type="number" placeholder="Duração (min)" className="input" />
          </div>
          <input name="description" placeholder="Descrição" className="input" />
          <input name="schedule" placeholder="every:120:0 · daily:13:00,19:00 · weekly:0:20:00" className="input font-mono" required />
          <p className="text-xs text-ash">every:&lt;min&gt;:&lt;offset&gt; repete a cada N minutos desde 00:00 · daily lista horários · weekly:&lt;dia 0=dom&gt;:HH:MM</p>
          <Submit>Criar evento</Submit>
        </ActionForm>
      </Panel>
      <Panel title="Eventos">
        <table className="mu"><thead><tr><th>Evento</th><th>Tipo</th><th>Agenda</th><th>Status</th></tr></thead><tbody>
          {rows.map((e) => <tr key={e.id}><td>{e.name}</td><td>{e.kind}</td><td className="text-ash">{describeSchedule(e.schedule)} · {e.duration_min}min</td><td><Toggle table="events" id={e.id} active={e.active} /></td></tr>)}
        </tbody></table>
      </Panel>
    </>
  );
}
