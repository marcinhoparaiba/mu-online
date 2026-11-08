import "server-only";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { hashPassword } from "./password";

/**
 * Banco local de desenvolvimento (SQLite embutido no Node 22+).
 * Para produção, troque por PostgreSQL mantendo as mesmas consultas em src/lib/repo.ts.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "mu-ec-reborn.db");

declare global {
  // eslint-disable-next-line no-var
  var __muDb: DatabaseSync | undefined;
}

function open(): DatabaseSync {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new DatabaseSync(DB_FILE, { timeout: 15000 });
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  // Transação exclusiva: vários processos (build/dev) podem abrir o banco ao mesmo tempo.
  db.exec("BEGIN IMMEDIATE");
  try { migrate(db); seed(db); db.exec("COMMIT"); } catch (e) { db.exec("ROLLBACK"); throw e; }
  return db;
}

export const db: DatabaseSync = globalThis.__muDb ?? (globalThis.__muDb = open());

function migrate(db: DatabaseSync) {
  db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL COLLATE NOCASE, email TEXT UNIQUE NOT NULL COLLATE NOCASE,
    pass_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'player', created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS login_attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, window_start INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, category TEXT NOT NULL,
    summary TEXT NOT NULL, body TEXT NOT NULL, published_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS banners (
    id INTEGER PRIMARY KEY, title TEXT NOT NULL, subtitle TEXT NOT NULL, theme TEXT NOT NULL DEFAULT 'ruby',
    cta_label TEXT NOT NULL DEFAULT 'Saiba mais', cta_href TEXT NOT NULL DEFAULT '/', active INTEGER NOT NULL DEFAULT 1, sort INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS promotions (
    id INTEGER PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, ends_at TEXT, active INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, kind TEXT NOT NULL,
    schedule TEXT NOT NULL, duration_min INTEGER NOT NULL DEFAULT 15, active INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS collections (
    id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, period TEXT NOT NULL, description TEXT NOT NULL, theme TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS shop_packages (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, tier INTEGER NOT NULL, price_cents INTEGER NOT NULL,
    description TEXT NOT NULL, contents TEXT NOT NULL, collection_id INTEGER REFERENCES collections(id), active INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS custom_items (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, kind TEXT NOT NULL, tier INTEGER NOT NULL, source TEXT NOT NULL,
    description TEXT NOT NULL, collection_id INTEGER REFERENCES collections(id)
  );
  CREATE TABLE IF NOT EXISTS market_listings (
    id INTEGER PRIMARY KEY, seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, item_name TEXT NOT NULL,
    price_amount INTEGER NOT NULL, price_currency TEXT NOT NULL, note TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'aberto',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY, title TEXT NOT NULL, season TEXT NOT NULL, winner TEXT NOT NULL, kind TEXT NOT NULL, date TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, subject TEXT NOT NULL,
    category TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'aberto', created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS ticket_messages (
    id INTEGER PRIMARY KEY, ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id), body TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, title TEXT NOT NULL, body TEXT NOT NULL,
    href TEXT, read INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS notification_reads (
    notification_id INTEGER NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, PRIMARY KEY (notification_id, user_id)
  );
  CREATE TABLE IF NOT EXISTS demo_characters (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, class TEXT NOT NULL, level INTEGER NOT NULL, resets INTEGER NOT NULL,
    master_level INTEGER NOT NULL DEFAULT 0, guild TEXT, online INTEGER NOT NULL DEFAULT 0, owner_id INTEGER REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS demo_guilds (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, master TEXT NOT NULL, members INTEGER NOT NULL, score INTEGER NOT NULL, castle_owner INTEGER NOT NULL DEFAULT 0
  );
  `);
}

function seed(db: DatabaseSync) {
  const has = db.prepare("SELECT COUNT(*) AS n FROM news").get() as { n: number };
  if (has.n > 0) return;

  // Conta administradora de demonstração: senha aleatória gravada em data/, nunca exibida no site.
  const adminPass = randomBytes(9).toString("base64url");
  db.prepare("INSERT INTO users (username, email, pass_hash, role) VALUES (?,?,?,?)")
    .run("admin", "admin@mu-ec-reborn.local", hashPassword(adminPass), "admin");
  fs.writeFileSync(path.join(DATA_DIR, "ADMIN_CREDENCIAIS_DEMO.txt"),
    `Conta administradora de DEMONSTRAÇÃO (somente desenvolvimento local)\nusuario: admin\nsenha: ${adminPass}\n\nTroque ou apague antes de publicar o site.\n`);

  const news = db.prepare("INSERT INTO news (slug,title,category,summary,body,published_at) VALUES (?,?,?,?,?,?)");
  const n = [
    ["abertura-temporada-1", "Temporada 1: os portões de Lorencia se abrem", "Anúncio", "Data de abertura, regras da temporada e o que esperar do MuBanneD - Editavel.", "O MuBanneD - Editavel chega com a experiência clássica 97D+99i, rates equilibradas e foco total em jogabilidade justa. Itens comuns podem ser editados gratuitamente; itens custom são exclusivamente cosméticos e vêm de eventos de GM ou pacotes de apoio.\n\nEsta é uma notícia de demonstração.", "2026-11-01 18:00:00"],
    ["guia-iniciante", "Guia do iniciante: do Lorencia ao Lost Tower", "Guia", "Rotas de upagem, distribuição de pontos e dicas para os primeiros resets.", "Comece em Lorencia, avance para Noria e Devias. Participe do Blood Castle assim que possível.\n\nConteúdo de demonstração.", "2026-11-02 12:00:00"],
    ["evento-halloween", "Coleção Noite das Almas encerrada", "Evento", "Agradecemos a participação na coleção de Halloween.", "A coleção temática foi encerrada. Os itens permanecem negociáveis no Mercado.\n\nConteúdo de demonstração.", "2026-11-03 20:00:00"],
    ["manutencao-semanal", "Manutenção programada de quinta-feira", "Manutenção", "Janela de manutenção das 05h às 07h (horário de Brasília).", "Durante a manutenção o servidor ficará indisponível.\n\nConteúdo de demonstração.", "2026-11-04 09:00:00"],
  ];
  for (const r of n) news.run(...r);

  const b = db.prepare("INSERT INTO banners (title,subtitle,theme,cta_label,cta_href,sort) VALUES (?,?,?,?,?,?)");
  b.run("O Renascer do Continente", "MU clássico 97D+99i. Jogabilidade justa, sem vantagens pagas.", "ruby", "Criar conta", "/cadastro", 1);
  b.run("Castle Siege aos domingos", "Reúna sua guild e conquiste a coroa de Valley of Loren.", "gold", "Ver calendário", "/eventos", 2);
  b.run("Coleção Natal Sombrio", "Asas e conjuntos cosméticos exclusivos da temporada de inverno.", "frost", "Ver coleção", "/colecoes", 3);

  const p = db.prepare("INSERT INTO promotions (title,description,ends_at) VALUES (?,?,?)");
  p.run("Semana de Abertura", "Taxa de drop de Jewels dobrada em eventos de invasão (demonstração).", "2026-11-15 23:59:00");
  p.run("Pacote Fundador", "Moldura de perfil exclusiva para quem apoiar na primeira temporada (demonstração).", "2026-12-01 23:59:00");

  // schedule: "every:<min>:<offset>" | "daily:HH:MM,HH:MM" | "weekly:<dow>:HH:MM" (dow 0=domingo)
  const e = db.prepare("INSERT INTO events (name,description,kind,schedule,duration_min) VALUES (?,?,?,?,?)");
  e.run("Blood Castle", "Derrote o portão e a estátua para salvar o Arcanjo.", "Arena", "every:120:0", 15);
  e.run("Devil Square", "Sobreviva às ondas de monstros na praça do demônio.", "Arena", "every:120:60", 15);
  e.run("Chaos Castle", "Batalha campal: o último de pé vence.", "PvP", "daily:13:00,19:00,22:00", 10);
  e.run("Golden Invasion", "Monstros dourados invadem os continentes.", "Invasão", "daily:10:00,16:00,21:00", 30);
  e.run("Red Dragon", "O Dragão Vermelho ataca Lorencia.", "Invasão", "daily:12:00,20:00", 20);
  e.run("Castle Siege", "Guilds disputam o controle do castelo.", "Guerra", "weekly:0:20:00", 90);
  e.run("Evento de GM: Caça ao Tesouro", "GMs escondem baús com itens custom cosméticos.", "GM", "weekly:6:21:00", 60);

  const c = db.prepare("INSERT INTO collections (slug,name,period,description,theme) VALUES (?,?,?,?,?)");
  c.run("natal-sombrio", "Natal Sombrio", "Dezembro", "Neve negra, sinos de ferro e chamas azuis.", "frost");
  c.run("noite-das-almas", "Noite das Almas", "Outubro", "Abóboras amaldiçoadas e asas de morcego.", "ruby");
  c.run("carnaval-de-lorencia", "Carnaval de Lorencia", "Fevereiro", "Máscaras douradas e plumas encantadas.", "gold");
  c.run("aniversario", "Aniversário do Reino", "Junho", "Celebração anual do servidor.", "gold");

  const sp = db.prepare("INSERT INTO shop_packages (name,tier,price_cents,description,contents,collection_id) VALUES (?,?,?,?,?,?)");
  sp.run("Pacote Aventureiro", 1, 1990, "Visual simples com brilho sutil.", JSON.stringify(["Capa do Aventureiro", "Moldura de perfil bronze"]), null);
  sp.run("Pacote Cavaleiro", 2, 3790, "Conjunto com aura metálica.", JSON.stringify(["Conjunto Cavaleiro de Ferro (visual)", "Pet visual Corvo", "Moldura prata"]), null);
  sp.run("Pacote Lorde", 3, 7990, "Asas animadas e efeito de partículas.", JSON.stringify(["Asas do Lorde Rubi (visual)", "Conjunto Lorde (visual)", "Título 'Lorde'", "Moldura ouro"]), null);
  sp.run("Pacote Imperador", 4, 14990, "O mais sofisticado: efeitos de luz completos.", JSON.stringify(["Asas Imperiais Douradas (visual)", "Conjunto Imperador (visual)", "Montaria visual Grifo", "Título 'Imperador'", "Moldura animada"]), null);

  const ci = db.prepare("INSERT INTO custom_items (name,kind,tier,source,description,collection_id) VALUES (?,?,?,?,?,?)");
  ci.run("Asas do Lorde Rubi", "Asas", 3, "donate", "Asas cosméticas com brilho rubi. Sem atributos extras.", null);
  ci.run("Asas Imperiais Douradas", "Asas", 4, "donate", "Asas cosméticas com partículas douradas.", null);
  ci.run("Conjunto Cavaleiro de Ferro", "Conjunto", 2, "donate", "Aparência metálica envelhecida.", null);
  ci.run("Coroa de Gelo Negro", "Elmo", 3, "gm_event", "Recompensa de evento de GM — Natal Sombrio.", 1);
  ci.run("Asas de Morcego Ancestral", "Asas", 2, "gm_event", "Recompensa de evento de GM — Noite das Almas.", 2);
  ci.run("Máscara do Folião Dourado", "Elmo", 2, "gm_event", "Recompensa de evento — Carnaval.", 3);
  ci.run("Capa do Aventureiro", "Capa", 1, "donate", "Capa simples com leve brilho.", null);
  ci.run("Estandarte do Reino", "Acessório", 3, "gm_event", "Entregue no Aniversário do Reino.", 4);

  const a = db.prepare("INSERT INTO achievements (title,season,winner,kind,date) VALUES (?,?,?,?,?)");
  a.run("Campeão do Torneio PvP", "Pré-temporada", "DarkLordBR (fictício)", "Campeonato", "2026-10-20");
  a.run("Primeira conquista do Castelo", "Pré-temporada", "Guild Aurora (fictícia)", "Castle Siege", "2026-10-26");
  a.run("Primeiro a 100 resets", "Pré-temporada", "ElfaLunar (fictício)", "Marco", "2026-10-30");

  const classes = ["Dark Knight", "Dark Wizard", "Fairy Elf", "Magic Gladiator", "Dark Lord"];
  const names = ["Kratos", "Merlinda", "ElfaLunar", "Gladius", "DarkLordBR", "Valquiria", "Necrom", "Arqueira", "Tyrion", "Zephyr", "Morgana", "Ragnar", "Seraph", "Lilith", "Brutus"];
  const guilds = ["Aurora", "Phoenix", "Legion", "Valhalla", null];
  const ch = db.prepare("INSERT INTO demo_characters (name,class,level,resets,master_level,guild,online) VALUES (?,?,?,?,?,?,?)");
  names.forEach((nm, i) => ch.run(nm, classes[i % 5], 400 - i * 7, 120 - i * 6, Math.max(0, 200 - i * 12), guilds[i % 5], i % 3 === 0 ? 1 : 0));
  const g = db.prepare("INSERT INTO demo_guilds (name,master,members,score,castle_owner) VALUES (?,?,?,?,?)");
  g.run("Aurora", "Kratos", 38, 15420, 1); g.run("Phoenix", "Merlinda", 31, 12880, 0);
  g.run("Legion", "Gladius", 27, 9950, 0); g.run("Valhalla", "Ragnar", 22, 8120, 0);

  db.prepare("INSERT INTO notifications (user_id,title,body,href) VALUES (NULL,?,?,?)")
    .run("Bem-vindo ao MuBanneD - Editavel", "Confira o calendário de eventos da semana.", "/eventos");
}
