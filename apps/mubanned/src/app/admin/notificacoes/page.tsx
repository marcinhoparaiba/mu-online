import { requirePerm } from "@/lib/auth";
import { adminSendNotificationAction } from "../../actions";
import { ActionForm, Submit } from "@/components/ActionForm";
import { Panel } from "@/components/ui";

export default async function Page() {
  await requirePerm("notifications.send");
  return (
    <Panel title="Enviar notificação">
      <ActionForm action={adminSendNotificationAction}>
        <input name="title" placeholder="Título" className="input" required maxLength={80} />
        <textarea name="body" placeholder="Mensagem" rows={3} className="input" required maxLength={300} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="username" placeholder="Login do jogador (vazio = todos)" className="input" />
          <input name="href" placeholder="Link interno opcional (/eventos)" className="input" />
        </div>
        <Submit>Enviar</Submit>
      </ActionForm>
    </Panel>
  );
}
