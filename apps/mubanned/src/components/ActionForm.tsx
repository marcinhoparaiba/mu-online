"use client";
import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/app/actions";
import { FormMessage } from "./ui";

export function ActionForm({ action, children, className = "space-y-4", resetOnOk = true }: {
  action: (s: FormState, f: FormData) => Promise<FormState>; children: ReactNode; className?: string; resetOnOk?: boolean;
}) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.ok && resetOnOk) ref.current?.reset(); }, [state, resetOnOk]);
  return (
    <form ref={ref} action={formAction} className={className}>
      <FormMessage state={state} />
      {children}
    </form>
  );
}

export function Submit({ children, className = "btn btn-gold" }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className={`${className} disabled:opacity-60`}>{pending ? "Aguarde…" : children}</button>;
}
