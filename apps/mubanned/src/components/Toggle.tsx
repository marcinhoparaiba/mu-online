import { adminToggleAction } from "@/app/actions";

export function Toggle({ table, id, active }: { table: string; id: number; active: number }) {
  return (
    <form action={adminToggleAction}>
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <button className={`badge ${active ? "border-emerald-500/60 text-emerald-400" : "border-white/20 text-ash"}`}>{active ? "Ativo" : "Inativo"}</button>
    </form>
  );
}
