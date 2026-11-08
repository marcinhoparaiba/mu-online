import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { registerAction } from "../actions";
import { ActionForm, Submit } from "@/components/ActionForm";
import { Container, Panel, PageHeader } from "@/components/ui";

export const metadata = { title: "Cadastro" };

export default async function Page() {
  if (await currentUser()) redirect("/painel");
  return (
    <Container className="max-w-xl">
      <PageHeader kicker="Junte-se ao reino" title="Criar conta" subtitle="Cadastro gratuito. Uma conta do site será vinculada à conta do jogo quando o GameServer estiver conectado." />
      <Panel title="Dados da conta">
        <ActionForm action={registerAction}>
          <div><label className="label" htmlFor="u">Login (4–10 caracteres)</label><input id="u" name="username" className="input" required minLength={4} maxLength={10} pattern="[A-Za-z0-9_]+" autoComplete="username" /></div>
          <div><label className="label" htmlFor="e">E-mail</label><input id="e" name="email" type="email" className="input" required autoComplete="email" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label" htmlFor="p">Senha</label><input id="p" name="password" type="password" className="input" required minLength={8} autoComplete="new-password" /></div>
            <div><label className="label" htmlFor="p2">Confirmar</label><input id="p2" name="password2" type="password" className="input" required minLength={8} autoComplete="new-password" /></div>
          </div>
          <label className="flex items-start gap-2 text-sm text-ash"><input type="checkbox" name="terms" className="mt-1 accent-[#c9a24a]" /> Li e aceito as regras do servidor.</label>
          <Submit className="btn btn-ruby w-full">Criar conta</Submit>
          <p className="text-center text-sm text-ash">Já tem conta? <Link href="/login" className="text-gold-light hover:underline">Entrar</Link></p>
        </ActionForm>
      </Panel>
    </Container>
  );
}
