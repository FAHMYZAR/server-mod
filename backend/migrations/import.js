import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const mappings = {
  users: {
    target: "users",
    columns: [
      "id",
      "fullname",
      "username",
      "level",
      "saldo",
      "status",
      "uplink",
      "password",
      "created_at",
      "updated_at",
    ],
  },
  keys_code: {
    target: "keys_code",
    columns: [
      "id",
      "game",
      "user_key",
      "user_pass",
      "duration",
      "expired_date",
      "max_devices",
      "devices",
      "status",
      "registrator",
      "created_at",
      "updated_at",
    ],
  },
  history: {
    target: "history",
    columns: ["id", "keys_id", "user_do", "info", "created_at", "updated_at"],
  },
  referral_code: {
    target: "referrals",
    columns: [
      "id",
      "code_hash",
      "set_saldo",
      "used_by",
      "created_by",
      "created_at",
      "updated_at",
    ],
  },
};

function parseValues(source) {
  const rows = [];
  let row = null,
    value = "",
    quoted = false,
    escape = false;
  const pushValue = () => {
    const raw = value.trim();
    row.push(
      quotedValue === null && /^NULL$/i.test(raw) ? null : (quotedValue ?? raw),
    );
    value = "";
    quotedValue = null;
  };
  let quotedValue = null;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (escape) {
      value += ch === "n" ? "\n" : ch;
      escape = false;
      continue;
    }
    if (quoted) {
      if (ch === "\\") {
        escape = true;
        continue;
      }
      if (ch === "'" && source[i + 1] === "'") {
        value += "'";
        i++;
        continue;
      }
      if (ch === "'") {
        quoted = false;
        quotedValue = value;
        continue;
      }
      value += ch;
      continue;
    }
    if (ch === "'") {
      quoted = true;
      value = "";
      continue;
    }
    if (ch === "(") {
      row = [];
      value = "";
      quotedValue = null;
      continue;
    }
    if (!row) continue;
    if (ch === ",") {
      pushValue();
      continue;
    }
    if (ch === ")") {
      pushValue();
      rows.push(row);
      row = null;
      continue;
    }
    value += ch;
  }
  return rows;
}

function createSchema(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,fullname TEXT,username TEXT UNIQUE COLLATE NOCASE NOT NULL,level INTEGER DEFAULT 2,saldo INTEGER DEFAULT 0,status INTEGER DEFAULT 1,uplink TEXT,password TEXT NOT NULL,created_at TEXT,updated_at TEXT);
CREATE TABLE IF NOT EXISTS keys_code(id INTEGER PRIMARY KEY,game TEXT NOT NULL,user_key TEXT UNIQUE COLLATE NOCASE,user_pass TEXT,duration INTEGER,expired_date TEXT,max_devices INTEGER DEFAULT 1,devices TEXT,status INTEGER DEFAULT 1,registrator TEXT,created_at TEXT,updated_at TEXT);
CREATE TABLE IF NOT EXISTS history(id INTEGER PRIMARY KEY,keys_id TEXT,user_do TEXT,info TEXT NOT NULL,created_at TEXT,updated_at TEXT);
CREATE TABLE IF NOT EXISTS referrals(id INTEGER PRIMARY KEY,code_hash TEXT UNIQUE,set_saldo INTEGER DEFAULT 0,used_by TEXT,created_by TEXT,created_at TEXT,updated_at TEXT);
CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY,user_id INTEGER NOT NULL,expires_at INTEGER NOT NULL);`);
}

export function importDump(db, file = process.env.MYSQL_DUMP_PATH) {
  if (!file || !fs.existsSync(file))
    throw Error("Set MYSQL_DUMP_PATH to a MySQL dump");
  createSchema(db);
  const sql = fs.readFileSync(file, "utf8");
  const counts = {};
  db.transaction(() => {
    for (const [source, mapping] of Object.entries(mappings)) {
      const match = sql.match(
        new RegExp(
          `INSERT INTO \\x60${source}\\x60[\\s\\S]*? VALUES\\s*([\\s\\S]*?);`,
        ),
      );
      const rows = match ? parseValues(match[1]) : [];
      counts[mapping.target] = rows.length;
      db.prepare(`DELETE FROM ${mapping.target}`).run();
      const statement = db.prepare(
        `INSERT INTO ${mapping.target}(${mapping.columns.join(",")}) VALUES(${mapping.columns.map(() => "?").join(",")})`,
      );
      for (const row of rows) statement.run(...row);
    }
  })();
  return counts;
}

if (
  import.meta.url ===
  new URL(`file://${path.resolve(process.argv[1]).replace(/\\/g, "/")}`).href
) {
  const target = path.resolve(process.env.DB_PATH || "data/app.sqlite");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const database = new Database(target);
  console.log(JSON.stringify(importDump(database), null, 2));
  database.close();
}
