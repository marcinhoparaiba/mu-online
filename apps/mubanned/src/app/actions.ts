"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/lib/community";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, destroySession, requireUser, requirePerm, rateLimit } from "@/lib/auth";
import { can, ROLES } from "@/lib/permissions";

export type FormState = { error?: string; ok?: string } | null;
const s = (f: FormData, k: string, max = 2000) => String(f.get(k) ?? "").trim().slice(0, max);
const ip = async () => (await headers()).get("x-forwarded-for")?.split(",")[0] ?? "local";

function notify(userId: number | null, title: string, body: string, href?: string) {
  db.prepare("INSERT INTO notifications (user_id,title,body,href) VALUES (?,?,?,?)").run(userId, title, body, href ?? null);
}

/* ---------- Conta ---------- */
export async function registerAction(_: FormState, f: FormData): Promise<FormState> {
  const username = s(f, "username", 20), email = s(f, "email", 120).toLowerCase(), pw = String(f.get("password") ?? ""), pw2 = String(f.get("password2") ?? "");
  if (!/^[A-Za-z0-9_]{4,10}$/.test(username)) return { error: "Login deve ter 4 a 10 caracteres (letras, números ou _), padrão do MU." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "E-mail inválido." };
  if (pw.length < 8 || pw.length > 72) return { error: "A senha deve ter entre 8 e 72 caracteres." };
  if (pw !== pw2) return { error: "As senhas não conferem." };
  if (f.get("terms") !== "on") return { error: "É necessário aceitar as regras do servidor." };
  if (!rateLimit(`reg:${await ip()}`, 5, 60 * 60 * 1000)) return { error: "Muitos cadastros deste endereço. Tente mais tarde." };
  const exists = db.prepare("SELECT 1 FROM users WHERE username=? OR email=?").get(username, email);
  if (exists) return { error: "Login ou e-mail já cadastrado." };
  const r = db.prepare("INSERT INTO users (username,email,pass_hash) VALUES (?,?,?)").run(username, email, hashPassword(pw));
  notify(Number(r.lastInsertRowid), "Conta criada", "Bem-vindo(a) ao MuBanneD - Editavel! Baixe o cliente para começar.", "/download");
  await createSession(Number(r.lastInsertRowid));
  redirect("/painel");
}

export async function loginAction(_: FormState, f: FormData): Promise<FormState> {
  const username = s(f, "username", 20), pw = String(f.get("password") ?? "");
  if (!rateLimit(`login:${await ip()}:${username.toLowerCase()}`)) return { error: "Muitas tentativas. Aguarde 10 minutos." };
  const u = db.prepare("SELECT id, pass_hash FROM users WHERE username=?").get(username) as { id: number; pass_hash: string } | undefined;
  if (!u || !verifyPassword(pw, u.pass_hash)) return { error: "Login ou senha incorretos." };
  db.prepare("INSERT INTO account_logins(user_id) VALUES(?)").run(u.id);
  await createSession(u.id);
  const next = s(f, "next", 200);
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/painel");
}

export async function logoutAction() { await destroySession(); redirect("/"); }

export async function changePasswordAction(_: FormState, f: FormData): Promise<FormState> {
  const u = await requireUser();
  const cur = String(f.get("current") ?? ""), nw = String(f.get("new") ?? "");
  if (f.has("confirm") && nw !== String(f.get("confirm"))) return { error: "As senhas não conferem." };
  const row = db.prepare("SELECT pass_hash FROM users WHERE id=?").get(u.id) as { pass_hash: string };
  if (!verifyPassword(cur, row.pass_hash)) return { error: "Senha atual incorreta." };
  if (nw.length < 8 || nw.length > 72) return { error: "A nova senha deve ter entre 8 e 72 caracteres." };
  db.prepare("UPDATE users SET pass_hash=? WHERE id=?").run(hashPassword(nw), u.id);
  db.prepare("DELETE FROM sessions WHERE user_id=?").run(u.id);
  await createSession(u.id);
  return { ok: "Senha alterada. Outras sessões foram encerradas." };
}

export async function markNotificationsReadAction() {
  const u = await requireUser();
  db.prepare("INSERT OR IGNORE INTO notification_reads (notification_id,user_id) SELECT id, ? FROM notifications WHERE user_id=? OR user_id IS NULL").run(u.id, u.id);
  revalidatePath("/", "layout");
}

/* ---------- Suporte ---------- */
export async function createTicketAction(_: FormState, f: FormData): Promise<FormState> {
  const u = await requireUser();
  const subject = s(f, "subject", 120), category = s(f, "category", 40), body = s(f, "body", 4000);
  if (subject.length < 4 || body.length < 10) return { error: "Preencha assunto e descrição (mínimo 10 caracteres)." };
  if (!["Conta", "Bug", "Denúncia", "Doação", "Outros"].includes(category)) return { error: "Categoria inválida." };
  if (!rateLimit(`ticket:${u.id}`, 5, 60 * 60 * 1000)) return { error: "Limite de tickets por hora atingido." };
  const r = db.prepare("INSERT INTO tickets (user_id,subject,category) VALUES (?,?,?)").run(u.id, subject, category);
  db.prepare("INSERT INTO ticket_messages (ticket_id,user_id,body) VALUES (?,?,?)").run(r.lastInsertRowid, u.id, body);
  redirect(`/suporte/${r.lastInsertRowid}`);
}

export async function replyTicketAction(_: FormState, f: FormData): Promise<FormState> {
  const u = await requireUser();
  const id = Number(f.get("ticket_id")), body = s(f, "body", 4000);
  const t = db.prepare("SELECT id,user_id,status FROM tickets WHERE id=?").get(id) as { id: number; user_id: number; status: string } | undefined;
  const staff = can(u.role, "tickets.manage");
  if (!t || (t.user_id !== u.id && !staff)) return { error: "Ticket não encontrado." };
  if (t.status === "fechado") return { error: "Ticket fechado." };
  if (body.length < 2) return { error: "Mensagem vazia." };
  db.prepare("INSERT INTO ticket_messages (ticket_id,user_id,body) VALUES (?,?,?)").run(id, u.id, body);
  if (staff && t.user_id !== u.id) {
    db.prepare("UPDATE tickets SET status='respondido' WHERE id=?").run(id);
    notify(t.user_id, `Ticket #${id} respondido`, "A equipe respondeu seu ticket.", `/suporte/${id}`);
  } else db.prepare("UPDATE tickets SET status='aberto' WHERE id=?").run(id);
  revalidatePath(`/suporte/${id}`);
  return { ok: "Mensagem enviada." };
}

export async function setTicketStatusAction(f: FormData) {
  await requirePerm("tickets.manage");
  const st = s(f, "status");
  if (!["aberto", "respondido", "fechado"].includes(st)) return;
  db.prepare("UPDATE tickets SET status=? WHERE id=?").run(st, Number(f.get("ticket_id")));
  revalidatePath("/admin/tickets");
}

/* ---------- Mercado (sem conversão para reais, sem saques) ---------- */
const CURRENCIES = ["Zen", "Jewel of Bless", "Jewel of Soul", "Jewel of Chaos", "Jewel of Life", "WCoin"];
export async function createListingAction(_: FormState, f: FormData): Promise<FormState> {
  const u = await requireUser();
  const item = s(f, "item_name", 80), amount = Math.floor(Number(f.get("price_amount"))), cur = s(f, "price_currency", 40), note = s(f, "note", 300);
  if (item.length < 3) return { error: "Informe o nome do item." };
  if (!Number.isFinite(amount) || amount < 1 || amount > 2_000_000_000) return { error: "Valor inválido." };
  if (!CURRENCIES.includes(cur)) return { error: "Moeda inválida. Use apenas moedas do jogo." };
  const open = db.prepare("SELECT COUNT(*) n FROM market_listings WHERE seller_id=? AND status='aberto'").get(u.id) as { n: number };
  if (open.n >= 10) return { error: "Limite de 10 anúncios abertos." };
  db.prepare("INSERT INTO market_listings (seller_id,item_name,price_amount,price_currency,note) VALUES (?,?,?,?,?)").run(u.id, item, amount, cur, note);
  revalidatePath("/mercado");
  return { ok: "Anúncio publicado." };
}

export async function closeListingAction(f: FormData) {
  const u = await requireUser();
  const id = Number(f.get("id"));
  const l = db.prepare("SELECT seller_id FROM market_listings WHERE id=?").get(id) as { seller_id: number } | undefined;
  if (!l || (l.seller_id !== u.id && !can(u.role, "market.moderate"))) return;
  db.prepare("UPDATE market_listings SET status=? WHERE id=?").run(l.seller_id === u.id ? "encerrado" : "removido", id);
  revalidatePath("/mercado");
}

/* ---------- Loja: pagamentos NÃO configurados ---------- */
export async function checkoutAction(_: FormState, f: FormData): Promise<FormState> {
  await requireUser();
  void f;
  return { error: "Pagamentos ainda não estão habilitados. Nenhuma cobrança foi feita." };
}

/* ---------- Admin ---------- */
const slugify = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);

export async function adminCreateNewsAction(_: FormState, f: FormData): Promise<FormState> {
  await requirePerm("news.manage");
  const title = s(f, "title", 140), category = s(f, "category", 30), summary = s(f, "summary", 300), body = s(f, "body", 20000);
  if (title.length < 4 || summary.length < 4 || body.length < 4) return { error: "Preencha todos os campos." };
  let slug = slugify(title) || "noticia";
  if (db.prepare("SELECT 1 FROM news WHERE slug=?").get(slug)) slug += "-" + Date.now().toString(36);
  db.prepare("INSERT INTO news (slug,title,category,summary,body) VALUES (?,?,?,?,?)").run(slug, title, category || "Anúncio", summary, body);
  if (f.get("notify") === "on") notify(null, title, summary, `/noticias/${slug}`);
  revalidatePath("/"); revalidatePath("/noticias");
  return { ok: "Notícia publicada." };
}
export async function adminDeleteNewsAction(f: FormData) {
  await requirePerm("news.manage");
  db.prepare("DELETE FROM news WHERE id=?").run(Number(f.get("id")));
  revalidatePath("/admin/noticias");
}

export async function adminCreateBannerAction(_: FormState, f: FormData): Promise<FormState> {
  await requirePerm("banners.manage");
  const title = s(f, "title", 80), subtitle = s(f, "subtitle", 200), theme = s(f, "theme", 10), label = s(f, "cta_label", 30), href = s(f, "cta_href", 200);
  if (!title || !subtitle) return { error: "Título e subtítulo obrigatórios." };
  if (!href.startsWith("/")) return { error: "O link deve ser interno (começar com /)." };
  db.prepare("INSERT INTO banners (title,subtitle,theme,cta_label,cta_href,sort) VALUES (?,?,?,?,?,?)")
    .run(title, subtitle, ["ruby", "gold", "frost"].includes(theme) ? theme : "ruby", label || "Saiba mais", href, Number(f.get("sort")) || 9);
  revalidatePath("/");
  return { ok: "Banner criado." };
}
export async function adminToggleAction(f: FormData) {
  const table = s(f, "table");
  const perm = { banners: "banners.manage", events: "events.manage", promotions: "promotions.manage", shop_packages: "shop.manage" } as const;
  if (!(table in perm)) return;
  await requirePerm(perm[table as keyof typeof perm]);
  db.prepare(`UPDATE ${table} SET active = 1 - active WHERE id=?`).run(Number(f.get("id")));
  revalidatePath("/", "layout");
}

export async function adminCreateEventAction(_: FormState, f: FormData): Promise<FormState> {
  await requirePerm("events.manage");
  const name = s(f, "name", 60), description = s(f, "description", 300), kind = s(f, "kind", 20), schedule = s(f, "schedule", 100), dur = Number(f.get("duration_min")) || 15;
  if (!/^(every:\d{1,4}:\d{1,4}|daily:\d{1,2}:\d{2}(,\d{1,2}:\d{2})*|weekly:[0-6]:\d{1,2}:\d{2})$/.test(schedule)) return { error: "Agenda inválida. Ex.: every:120:0 · daily:13:00,19:00 · weekly:0:20:00" };
  if (!name) return { error: "Nome obrigatório." };
  db.prepare("INSERT INTO events (name,description,kind,schedule,duration_min) VALUES (?,?,?,?,?)").run(name, description, kind || "GM", schedule, dur);
  revalidatePath("/eventos");
  return { ok: "Evento criado." };
}

export async function adminCreatePromotionAction(_: FormState, f: FormData): Promise<FormState> {
  await requirePerm("promotions.manage");
  const title = s(f, "title", 80), description = s(f, "description", 300), ends = s(f, "ends_at", 20);
  if (!title || !description) return { error: "Preencha título e descrição." };
  db.prepare("INSERT INTO promotions (title,description,ends_at) VALUES (?,?,?)").run(title, description, ends ? ends.replace("T", " ") : null);
  revalidatePath("/");
  return { ok: "Promoção criada." };
}

export async function adminSetRoleAction(f: FormData) {
  const me = await requirePerm("users.manage");
  const id = Number(f.get("id")), role = s(f, "role");
  if (id === me.id || !ROLES.includes(role as never)) return;
  db.prepare("UPDATE users SET role=? WHERE id=?").run(role, id);
  revalidatePath("/admin/usuarios");
}

export async function adminSendNotificationAction(_: FormState, f: FormData): Promise<FormState> {
  await requirePerm("notifications.send");
  const title = s(f, "title", 80), body = s(f, "body", 300), target = s(f, "username", 20), href = s(f, "href", 200);
  if (!title || !body) return { error: "Preencha título e mensagem." };
  let uid: number | null = null;
  if (target) {
    const u = db.prepare("SELECT id FROM users WHERE username=?").get(target) as { id: number } | undefined;
    if (!u) return { error: "Usuário não encontrado." };
    uid = u.id;
  }
  notify(uid, title, body, href.startsWith("/") ? href : undefined);
  return { ok: uid ? "Notificação enviada ao jogador." : "Notificação enviada a todos." };
}
