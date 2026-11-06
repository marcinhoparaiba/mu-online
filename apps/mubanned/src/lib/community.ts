import "server-only";
import {db} from "./db";
db.exec(`CREATE TABLE IF NOT EXISTS profiles(user_id INTEGER PRIMARY KEY REFERENCES users(id),name TEXT NOT NULL DEFAULT '',birth_date TEXT NOT NULL DEFAULT '',country TEXT NOT NULL DEFAULT 'Brasil');
CREATE TABLE IF NOT EXISTS account_logins(id INTEGER PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id),created_at TEXT NOT NULL DEFAULT (datetime('now')),platform TEXT NOT NULL DEFAULT 'Web');
CREATE TABLE IF NOT EXISTS forum_topics(id INTEGER PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id),category TEXT NOT NULL,title TEXT NOT NULL,locked INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS forum_posts(id INTEGER PRIMARY KEY,topic_id INTEGER NOT NULL REFERENCES forum_topics(id),user_id INTEGER NOT NULL REFERENCES users(id),body TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT (datetime('now')));`);
export const categories=['Notícias','Avisos','Eventos','Dúvidas','Tutoriais','Compra','Venda','Guilds','Português','English','Tiếng Việt','Español','中国人'];
export {db};
