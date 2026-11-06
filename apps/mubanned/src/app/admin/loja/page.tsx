import { requirePerm } from "@/lib/auth";
import { db } from "@/lib/db";
import { brl } from "@/lib/schedule";
import { Toggle } from "@/components/Toggle";
import { Panel, TIER_NAME } from "@/components/ui";

export default async function Page() {
  await requirePerm("shop.manage");
  const rows = db.prepare("SELECT * FROM shop_packages ORDER BY tier").all() as { id: number; name: string; tier: number; price_cents: number; active: number }[];
  return (
    <Panel title="Pacotes da loja">
      <p className="mb-4 rounded border border-ruby/50 bg-ruby/10 px-3 py-2 text-sm text-ruby-light">Gateway de pagamento <strong>não configurado</strong>. Nenhuma cobrança real é feita até que um provedor seja aprovado e integrado.</p>
      <table className="mu"><thead><tr><th>Pacote</th><th>Nível</th><th>Preço</th><th>Status</th></tr></thead><tbody>
        {rows.map((p) => <tr key={p.id}><td>{p.name}</td><td>{TIER_NAME[p.tier]}</td><td>{brl(p.price_cents)}</td><td><Toggle table="shop_packages" id={p.id} active={p.active} /></td></tr>)}
      </tbody></table>
    </Panel>
  );
}
