import express from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "node:url";
import { mount } from "./features.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const db =
  globalThis.__db ??
  (globalThis.__db = (await import("better-sqlite3")).default(
    process.env.DB_PATH || path.join(root, "data", "app.sqlite"),
  ));
fs.mkdirSync(path.join(root, "data", "uploads"), { recursive: true });
db.pragma("journal_mode=WAL");
db.exec(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,fullname TEXT,username TEXT UNIQUE NOT NULL,level INTEGER DEFAULT 2,saldo INTEGER DEFAULT 0,status INTEGER DEFAULT 1,uplink TEXT,password TEXT NOT NULL,created_at TEXT,updated_at TEXT);
CREATE TABLE IF NOT EXISTS keys_code(id INTEGER PRIMARY KEY,game TEXT NOT NULL,user_key TEXT UNIQUE,user_pass TEXT,duration INTEGER,expired_date TEXT,max_devices INTEGER DEFAULT 1,devices TEXT,status INTEGER DEFAULT 1,registrator TEXT,created_at TEXT,updated_at TEXT);
CREATE TABLE IF NOT EXISTS history(id INTEGER PRIMARY KEY,keys_id TEXT,user_do TEXT,info TEXT NOT NULL,created_at TEXT,updated_at TEXT);
CREATE TABLE IF NOT EXISTS referrals(id INTEGER PRIMARY KEY,code_hash TEXT UNIQUE,set_saldo REAL DEFAULT 0,used_by TEXT,created_by TEXT,created_at TEXT,updated_at TEXT);
CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY,user_id INTEGER NOT NULL,login_at INTEGER,expires_at INTEGER NOT NULL);
`);
// Existing databases may predate login_at; backfill it without changing session IDs.
try { db.prepare("ALTER TABLE sessions ADD COLUMN login_at INTEGER").run(); } catch {}
db.prepare("UPDATE sessions SET login_at=COALESCE(login_at, expires_at-1800000) WHERE login_at IS NULL").run();
const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const json = (res, data, status = 200) =>
  res.status(status).json({ ok: status < 400, ...data });
const now = () => new Date().toISOString().slice(0, 19).replace("T", " ");
const clean = (s) => (typeof s === "string" ? s.trim() : "");
function auth(req, res, next) {
  const id = req.cookies.sid,
    s =
      id &&
      db
        .prepare(
          "SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.id=? AND s.expires_at>? AND u.status=1",
        )
        .get(id, Date.now());
  if (!s) return json(res, { error: "Unauthorized" }, 401);
  req.user = s;
  next();
}
function role(level) {
  return (req, res, next) =>
    req.user.level === level ? next() : json(res, { error: "Forbidden" }, 403);
}
const publicUser = (u) => ({
  id: u.id,
  fullname: u.fullname,
  username: u.username,
  level: u.level,
  saldo: u.saldo,
  status: u.status,
  uplink: u.uplink,
  created_at: u.created_at,
  updated_at: u.updated_at,
});
app.post("/login", (req, res) => {
  const u = db
    .prepare("SELECT * FROM users WHERE username=?")
    .get(clean(req.body.username));
  const p = String(req.body.password || "");
  if (!u || !bcrypt.compareSync(p, u.password.replace(/^\$2y\$/, "\$2a$")))
    return json(res, { error: "Invalid credentials" }, 401);
  if (!u.status) return json(res, { error: "Invalid credentials" }, 401);
  const sid = crypto.randomBytes(32).toString("base64url");
  const loginAt = Date.now();
  const expiresAt = loginAt + (req.body.stay_log ? 86400000 : 1800000);
  db.prepare("INSERT INTO sessions(id,user_id,login_at,expires_at) VALUES(?,?,?,?)").run(
    sid, u.id, loginAt, expiresAt,
  );
  res.cookie("sid", sid, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: req.body.stay_log ? 86400000 : 1800000,
  });
  json(res, {
    user: publicUser(u),
  });
});
app.get("/session", auth, (req, res) => json(res, { user: publicUser(req.user) }));
app.post("/register", (req, res) => {
  const x = req.body, username = clean(x.username), password = String(x.password || ""), referral = clean(x.referral);
  if (!/^[a-z0-9]{4,25}$/i.test(username) || password.length < 6 || password.length > 45 || password !== String(x.password2 || "") || !/^[a-z0-9]{6,}$/i.test(referral))
    return json(res, { error: "Please check the form", errors: { referral: "Invalid registration data" } }, 400);
  try {
    const result = db.transaction(() => {
      const code = db.prepare("SELECT * FROM referrals WHERE used_by IS NULL").all().find((r) => r.code_hash === referral || bcrypt.compareSync(referral, String(r.code_hash).replace(/^\$2y\$/, "$2a$")));
      if (!code) throw Error("Wrong referral, please try again.");
      const r = db.prepare("INSERT INTO users(fullname,username,level,saldo,status,uplink,password,created_at) VALUES(?,?,?,?,?,?,?,?)").run(clean(x.fullname), username, 2, code.set_saldo || 0, 1, code.created_by || null, bcrypt.hashSync(password, 12), now());
      db.prepare("UPDATE referrals SET used_by=?,updated_at=? WHERE id=? AND used_by IS NULL").run(username, now(), code.id);
      return r.lastInsertRowid;
    })();
    json(res, { id: result }, 201);
  } catch (e) {
    json(res, { error: e.message === "Wrong referral, please try again." ? e.message : "Username already exists" }, e.message === "Wrong referral, please try again." ? 400 : 409);
  }
});
function logout(req, res) {
  db.prepare("DELETE FROM sessions WHERE id=?").run(req.cookies.sid);
  res.clearCookie("sid");
  return json(res, { message: "Logged out" });
}
app.post("/logout", auth, logout);
app.get("/logout", auth, logout);
app.get("/dashboard", auth, (req, res) => {
  const sessionRow = db.prepare("SELECT login_at,expires_at FROM sessions WHERE id=?").get(req.cookies.sid);
  return json(res, {
    user: publicUser(req.user),
    login_at: sessionRow?.login_at,
    expires_at: sessionRow?.expires_at,
    history: db
      .prepare("SELECT * FROM history WHERE user_do=? OR ?=1 ORDER BY id DESC LIMIT 10")
      .all(req.user.username, req.user.level === 1 ? 1 : 0),
  });
});
app.get("/settings", auth, (req, res) => json(res, { user: publicUser(req.user) }));
app.patch("/settings", auth, (req, res) => {
  const full = clean(req.body.fullname);
  if (full)
    db.prepare("UPDATE users SET fullname=?,updated_at=? WHERE id=?").run(
      full,
      now(),
      req.user.id,
    );
  if (req.body.password) {
    if (
      !bcrypt.compareSync(
        String(req.body.current || ""),
        req.user.password.replace(/^\$2y\$/, "$2a$"),
      )
    )
      return json(res, { error: "Wrong current password" }, 400);
    db.prepare("UPDATE users SET password=?,updated_at=? WHERE id=?").run(
      bcrypt.hashSync(String(req.body.password), 12),
      now(),
      req.user.id,
    );
  }
  json(res, { message: "Updated" });
});
function list(table, where = "", params = []) {
  const page = Math.max(1, +params.pop() || 1),
    limit = Math.min(100, Math.max(1, +params.pop() || 25)),
    q = clean(params.pop()),
    sort = ["id", "username", "created_at", "user_key"].includes(params.pop())
      ? "id"
      : "id";
  return {
    items: db
      .prepare(
        `SELECT * FROM ${table} ${where}${q ? " AND (username LIKE ? OR user_key LIKE ?)" : ""} ORDER BY ${sort} DESC LIMIT ? OFFSET ?`,
      )
      .all(
        ...params,
        ...(q ? [`%${q}%`, `%${q}%`] : []),
        limit,
        (page - 1) * limit,
      ),
    page,
    limit,
  };
}
app.get("/users", auth, role(1), (req, res) =>
  json(
    res,
    { ...list("users", "WHERE 1=1", [req.query.q, req.query.sort, req.query.limit, req.query.page]), items: list("users", "WHERE 1=1", [req.query.q, req.query.sort, req.query.limit, req.query.page]).items.map(publicUser) },
  ),
);
app.get("/users/:id", auth, role(1), (req, res) => {
  const user = db
    .prepare(
      "SELECT id,fullname,username,level,saldo,status,uplink,created_at,updated_at FROM users WHERE id=?",
    )
    .get(req.params.id);
  return user ? json(res, { user }) : json(res, { error: "Not found" }, 404);
});
app.post("/users", auth, role(1), (req, res) => {
  try {
    const x = req.body;
    const r = db
      .prepare(
        "INSERT INTO users(fullname,username,level,saldo,status,uplink,password,created_at) VALUES(?,?,?,?,?,?,?,?)",
      )
      .run(
        x.fullname || "",
        x.username,
        +x.level || 2,
        +x.saldo || 0,
        x.status ?? 1,
        x.uplink || null,
        bcrypt.hashSync(x.password, 12),
        now(),
      );
    json(res, { id: r.lastInsertRowid }, 201);
  } catch (e) {
    json(res, { error: "Username already exists" }, 409);
  }
});
app.patch("/users/:id", auth, role(1), (req, res) => {
  const x = req.body;
  try {
    const result = db.prepare(
      "UPDATE users SET username=COALESCE(?,username),fullname=COALESCE(?,fullname),level=COALESCE(?,level),saldo=COALESCE(?,saldo),status=COALESCE(?,status),uplink=COALESCE(?,uplink),updated_at=? WHERE id=?",
    ).run(
      clean(x.username) || null,
      x.fullname,
      x.level,
      x.saldo,
      x.status,
      x.uplink,
      now(),
      req.params.id,
    );
    return result.changes
      ? json(res, { message: "Updated" })
      : json(res, { error: "Not found" }, 404);
  } catch {
    return json(res, { error: "Username already exists" }, 409);
  }
});
app.delete("/users/:id", auth, role(1), (req, res) => {
  db.prepare("DELETE FROM users WHERE id=?").run(req.params.id);
  json(res, { message: "Deleted" });
});
app.get("/referrals", auth, role(1), (req, res) => {
  const items = db.prepare("SELECT id AS id_reff,code_hash AS code,set_saldo,used_by,created_by,created_at,updated_at FROM referrals ORDER BY id DESC").all();
  json(res, { items });
});
app.post("/referrals", auth, role(1), (req, res) => {
  const saldo = Number(req.body.set_saldo);
  if (!Number.isFinite(saldo) || saldo < 0) return json(res, { error: "Invalid currency, cannot set to minus." }, 400);
  const code = crypto.randomBytes(8).toString("base64url").replace(/[^a-z0-9]/gi, "").slice(0, 6).padEnd(6, "A");
  const hash = bcrypt.hashSync(code, 10);
  db.prepare("INSERT INTO referrals(code_hash,set_saldo,created_by,created_at) VALUES(?,?,?,?)").run(hash, saldo < 1 ? 0 : saldo, req.user.username, now());
  json(res, { code, referral: code }, 201);
});
mount(app, db, { auth, role, json, root, now });
app.use((err, req, res, next) =>
  json(
    res,
    {
      error:
        err.message === "Unexpected end of form"
          ? "Invalid upload"
          : "Request failed",
    },
    400,
  ),
);
export default app;
