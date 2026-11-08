import "server-only";
import { db } from "../db";

/**
 * Camada de integração com o GameServer MU 97D+99i.
 * Hoje existe apenas o MockAdapter, que lê dados FICTÍCIOS do banco local.
 * Futuro: SqlServerAdapter lendo a base MuOnline (Character, Guild, MEMB_INFO, MEMB_STAT)
 * e um conector para entrega de itens via GameServer/JoinServer.
 */
export type ServerStatus = { connected: boolean; playersOnline: number; source: "demo" | "gameserver" };

export interface GameServerAdapter {
  readonly connected: boolean;
  status(): Promise<ServerStatus>;
}

class MockAdapter implements GameServerAdapter {
  readonly connected = false;
  async status(): Promise<ServerStatus> {
    const r = db.prepare("SELECT COUNT(*) AS n FROM demo_characters WHERE online=1").get() as { n: number };
    return { connected: false, playersOnline: r.n, source: "demo" };
  }
}

export const gameServer: GameServerAdapter = new MockAdapter();
