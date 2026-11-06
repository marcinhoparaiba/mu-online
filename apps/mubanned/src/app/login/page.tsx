import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { loginAction } from "../actions";
import { ActionForm, Submit } from "@/components/ActionForm";
import { Container, Panel, PageHeader } from "@/components/ui";

export const metadata = { title: "Entrar" };

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await currentUser()) redirect("/painel");
  const { next = "" } = await searchParams;
  return (
    <Container className="max-w-md">
      <PageHeader kicker="Bem-vindo de volta" title="Entrar" />
      <Panel title="Acesso à conta">
        <ActionForm action={loginAction} resetOnOk={false}>
          <input type="hidden" name="next" value={next} />
          <div><label className="label" htmlFor="u">Login</label><input id="u" name="username" className="input" required autoComplete="username" /></div>
          <div><label className="label" htmlFor="p">Senha</label><input id="p" name="password" type="password" className="input" required autoComplete="current-password" /></div>
          <Submit className="btn btn-gold w-full">Entrar</Submit>
          <p className="text-center text-sm text-ash">Novo por aqui? <Link href="/cadastro" className="text-gold-light hover:underline">Criar conta</Link></p>
        </ActionForm>
      </Panel>
    </Container>
  );
}
