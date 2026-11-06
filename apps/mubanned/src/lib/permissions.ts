export type Role = "player" | "support" | "gm" | "admin";
export type Permission =
  | "admin.access" | "news.manage" | "banners.manage" | "events.manage" | "promotions.manage"
  | "shop.manage" | "tickets.manage" | "users.manage" | "market.moderate" | "notifications.send";

const MATRIX: Record<Role, Permission[]> = {
  player: [],
  support: ["admin.access", "tickets.manage", "market.moderate"],
  gm: ["admin.access", "news.manage", "events.manage", "banners.manage", "tickets.manage", "market.moderate", "notifications.send"],
  admin: ["admin.access", "news.manage", "banners.manage", "events.manage", "promotions.manage", "shop.manage",
    "tickets.manage", "users.manage", "market.moderate", "notifications.send"],
};

export const ROLES: Role[] = ["player", "support", "gm", "admin"];
export const ROLE_LABEL: Record<Role, string> = { player: "Jogador", support: "Suporte", gm: "Game Master", admin: "Administrador" };

export function can(role: string | undefined, perm: Permission): boolean {
  return !!role && (MATRIX[role as Role] ?? []).includes(perm);
}
