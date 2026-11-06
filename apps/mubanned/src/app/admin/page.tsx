import { db } from "@/lib/db";
import { gameServer } from "@/lib/gameserver";
import { Panel } from "@/components/ui";

export default async function Page() {
  const c = (sql: string) => (db.prepare(sql).get() as { n: number }).n;
  const st = await gameServer.status();
  const stats = [
    ["Contas", c("SELECT COUNT(*) n FROM users")], ["Tickets abertos", c("SELECT COUNT(*) n FROM tickets WHERE status='aberto'")],
    ["Anúncios no mercado", c("SELECT COUNT(*) n FROM market_listings WHERE status='aberto'")], ["Notícias", c("SELECT COUNT(*) n FROM news")],
  ];
  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([k, v]) => <div key={k} className="panel p-4"><p className="label">{k}</p><p className="font-display text-3xl text-gold-light">{v}</p></div>)}
      </div>
      <Panel title="Integração com GameServer">
        <p className="text-sm">Status: <strong className={st.connected ? "text-emerald-400" : "text-ruby-light"}>{st.connected ? "Conectado" : "Não conectado"}</strong> · fonte de dados: <code>{st.source}</code></p>
        <p className="mt-2 text-sm text-ash">Rankings, status e personagens exibem dados fictícios. Para integrar, implemente um adaptador em <code>src/lib/gameserver</code> (ex.: leitura do banco MuOnline em SQL Server).</p>
      </Panel>
    </>
  );
}
