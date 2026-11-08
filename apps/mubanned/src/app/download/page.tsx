import { Container, PageHeader, Panel } from "@/components/ui";

export const metadata = { title: "Download" };

export default function Page() {
  return (
    <Container>
      <PageHeader kicker="Prepare-se para a batalha" title="Download do cliente" subtitle="Cliente completo do MuBanneD - Editavel com launcher e atualizador automático." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Cliente completo">
            <div className="grid gap-3 sm:grid-cols-2">
              {["Espelho principal", "Espelho alternativo"].map((m) => (
                <div key={m} className="rounded border border-white/10 bg-black/30 p-4">
                  <p className="font-display text-gold-light">{m}</p>
                  <p className="text-xs text-ash">Versão — · Tamanho —</p>
                  <button disabled className="btn btn-ghost mt-3 w-full cursor-not-allowed opacity-60">Em breve</button>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-ash">Os links serão configurados quando o cliente oficial for publicado. Sempre baixe apenas por esta página.</p>
          </Panel>
          <Panel title="Como instalar">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-parchment/85">
              <li>Baixe o cliente completo e extraia em uma pasta sem acentos (ex.: <code className="text-gold-light">C:\MuBanneD - Editavel</code>).</li>
              <li>Execute o <strong>Launcher</strong> e aguarde a atualização automática.</li>
              <li>Entre com o login e senha cadastrados neste site.</li>
              <li>Se houver um alerta de segurança, interrompa a instalação e consulte o suporte oficial.</li>
            </ol>
          </Panel>
        </div>
        <Panel title="Requisitos">
          <table className="mu"><tbody>
            {[["Sistema", "Windows 7 ou superior"], ["Processador", "Dual Core 2 GHz"], ["Memória", "2 GB RAM"], ["Vídeo", "512 MB, DirectX 9"], ["Espaço", "≈ 2 GB"]].map(([k, v]) => <tr key={k}><td className="text-ash">{k}</td><td>{v}</td></tr>)}
          </tbody></table>
        </Panel>
      </div>
    </Container>
  );
}
