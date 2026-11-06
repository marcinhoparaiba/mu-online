import { requirePerm } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROLES, ROLE_LABEL, type Role } from "@/lib/permissions";
import { adminSetRoleAction } from "../../actions";
import { Panel } from "@/components/ui";

export default async function Page() {
  const me = await requirePerm("users.manage");
  const rows = db.prepare("SELECT id,username,email,role FROM users ORDER BY id DESC LIMIT 200").all() as { id: number; username: string; email: string; role: string }[];
  return (
    <Panel title="Usuários e permissões">
      <div className="overflow-x-auto"><table className="mu"><thead><tr><th>Login</th><th>E-mail</th><th>Cargo</th></tr></thead><tbody>
        {rows.map((u) => (
          <tr key={u.id}><td>{u.username}</td><td className="text-ash">{u.email}</td>
            <td>{u.id === me.id ? ROLE_LABEL[u.role as Role] : (
              <form action={adminSetRoleAction} className="flex gap-2"><input type="hidden" name="id" value={u.id} />
                <select name="role" defaultValue={u.role} className="input w-auto py-1">{ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</select>
                <button className="btn btn-ghost px-2 py-1">Salvar</button></form>
            )}</td></tr>
        ))}
      </tbody></table></div>
    </Panel>
  );
}
