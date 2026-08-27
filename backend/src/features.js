import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
export function mount(app, db, { auth, role, json, root, now }) {
  const owner = (u) =>
    u.level === 1 ? ["1=1", []] : ["registrator=?", [u.username]];
  app.get("/keys", auth, (req, res) => {
    const [w, p] = owner(req.user),
      q = String(req.query.q || ""),
      limit = Math.min(100, +req.query.limit || 25),
      page = Math.max(1, +req.query.page || 1);
    json(res, {
      items: db
        .prepare(
          `SELECT * FROM keys_code WHERE ${w} AND (user_key LIKE ? OR game LIKE ?) ORDER BY id DESC LIMIT ? OFFSET ?`,
        )
        .all(...p, `%${q}%`, `%${q}%`, limit, (page - 1) * limit),
      page,
      limit,
    });
  });
  const prices = { 1: 0.3, 3: 0.5, 7: 2, 14: 4, 30: 7, 60: 14 },
    loops = { 1: 1, 2: 5, 3: 10, 4: 25, 5: 50, 6: 100 };
  app.post("/keys/generate", auth, (req, res) => {
    try {
      const out = db.transaction(() => {
        const duration = +req.body.duration,
          max = +req.body.max_devices,
          count = loops[req.body.loopcount] || +req.body.count || 1,
          cost = (prices[duration] ?? NaN) * max * count;
        if (!Number.isFinite(cost) || max < 1 || count < 1 || count > 100)
          throw Error("Invalid generation options");
        const debit = db
          .prepare("UPDATE users SET saldo=saldo-? WHERE id=? AND saldo>=?")
          .run(cost, req.user.id, cost);
        if (!debit.changes) throw Error("Insufficient balance");
        const ins = db.prepare(
            "INSERT INTO keys_code(game,user_key,duration,max_devices,status,registrator,created_at) VALUES(?,?,?,?,1,?,?)",
          ),
          history = db.prepare("INSERT INTO history(keys_id,user_do,info,created_at) VALUES(?,?,?,?)"),
          keys = [], alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < count; i++) {
          let key;
          do { key = Array.from(crypto.randomBytes(20), (b) => alphabet[b % alphabet.length]).join(""); }
          while (db.prepare("SELECT 1 FROM keys_code WHERE user_key=?").get(key));
          const game = req.body.game || "PUGB";
          const inserted = ins.run(game, key, duration, max, req.user.username, now());
          history.run(inserted.lastInsertRowid, req.user.username, `${game}|${key.slice(0, 5)}|${duration}|${max}`, now());
          keys.push(key);
        }
        return { keys, cost };
      })();
      json(res, out, 201);
    } catch (e) {
      json(res, { error: e.message }, 400);
    }
  });
  app.get("/keys/api", auth, (req, res) => {
    const [w, p] = owner(req.user);
    const rows = db.prepare(`SELECT * FROM keys_code WHERE ${w} ORDER BY id DESC`).all(...p);
    return json(res, { data: rows, items: rows });
  });
  app.get("/keys/:id", auth, (req, res) => {
    const [w, p] = owner(req.user),
      key = db
        .prepare(`SELECT * FROM keys_code WHERE id=? AND ${w}`)
        .get(req.params.id, ...p);
    return key ? json(res, { key }) : json(res, { error: "Not found" }, 404);
  });
  app.patch("/keys/:id", auth, (req, res) => {
    const [w, p] = owner(req.user),
      k = db
        .prepare(`SELECT * FROM keys_code WHERE id=? AND ${w}`)
        .get(req.params.id, ...p);
    if (!k) return json(res, { error: "Not found" }, 404);
    const x = req.body,
      admin = req.user.level === 1,
      devices = Array.isArray(x.devices)
        ? [...new Set(x.devices.map(String).map((v) => v.trim()).filter(Boolean))].join(",")
        : String(x.devices ?? k.devices ?? "").split(",").map((v) => v.trim()).filter(Boolean).join(",");
    db.prepare(
      `UPDATE keys_code SET status=?,game=?,user_key=?,duration=?,max_devices=?,registrator=?,expired_date=?,devices=?,updated_at=? WHERE id=?`,
    ).run(
      x.status ?? k.status,
      admin ? x.game || k.game : k.game,
      admin ? x.user_key || k.user_key : k.user_key,
      admin ? +x.duration || k.duration : k.duration,
      admin ? +x.max_devices || k.max_devices : k.max_devices,
      admin ? (x.registrator ?? k.registrator) : k.registrator,
      admin ? (x.expired_date ? String(x.expired_date).replace("T", " ") + ":00" : null) : k.expired_date,
      admin ? devices : k.devices,
      now(),
      k.id,
    );
    json(res, { message: "Updated" });
  });
  app.post("/keys/:id/reset", auth, (req, res) => {
    const [w, p] = owner(req.user);
    const r = db
      .prepare(
        `UPDATE keys_code SET devices=NULL,updated_at=? WHERE id=? AND ${w}`,
      )
      .run(now(), req.params.id, ...p);
    json(res, { reset: !!r.changes }, r.changes ? 200 : 404);
  });
  app.delete("/keys/:id", auth, (req, res) => {
    const [w, p] = owner(req.user);
    const r = db
      .prepare(`DELETE FROM keys_code WHERE id=? AND ${w}`)
      .run(req.params.id, ...p);
    json(res, { deleted: !!r.changes }, r.changes ? 200 : 404);
  });
  app.get("/keys/reset", auth, (req, res) => {
    const userKey = String(req.query.userkey || "");
    const key = db.prepare("SELECT * FROM keys_code WHERE user_key=?").get(userKey);
    const result = { registered: !!key, keys: userKey };
    if (key && req.query.reset && (req.user.level === 1 || key.registrator === req.user.username)) {
      db.prepare("UPDATE keys_code SET devices=NULL,updated_at=? WHERE user_key=?").run(now(), userKey);
      result.reset = true;
      result.devices_total = 0;
      result.devices_max = key.max_devices;
    } else if (key) {
      result.devices_total = key.devices ? String(key.devices).split(",").filter(Boolean).length : 0;
      result.devices_max = key.max_devices;
    }
    return json(res, result);
  });
  app.get("/keys/delete", auth, (req, res) => {
    const userKey = String(req.query.userkey || "");
    const key = db.prepare("SELECT * FROM keys_code WHERE user_key=?").get(userKey);
    const result = { registered: !!key, keys: userKey };
    if (key && req.query.delete && (req.user.level === 1 || key.registrator === req.user.username)) {
      db.prepare("DELETE FROM keys_code WHERE user_key=?").run(userKey);
      result.delete = true;
    }
    return json(res, result);
  });
  app.get("/keys/download", auth, (req, res) => {
    const [w, p] = owner(req.user);
    const rows = db
      .prepare(`SELECT user_key FROM keys_code WHERE ${w} ORDER BY id`)
      .all(...p);
    res
      .type("text/plain")
      .attachment("keys.txt")
      .send(rows.map((x) => x.user_key).join("\n"));
  });
  function activate(game, key, serial, successStatus, pepper, extra = {}) {
    if (!game || !key || !serial)
      return { status: false, reason: "INVALID PARAMETER" };
    const k = db
      .prepare("SELECT * FROM keys_code WHERE game=? AND user_key=?")
      .get(game, key);
    if (!k) return { status: false, reason: "USER OR GAME NOT REGISTERED" };

    const timestamp = Math.floor(Date.now() / 1000);
    const storedExpired = k.expired_date;
    let expired = storedExpired;
    if (!expired) {
      const date = new Date(Date.now() + k.duration * 86400000);
      expired = date.toISOString().slice(0, 19).replace("T", " ");
      db.prepare("UPDATE keys_code SET expired_date=? WHERE id=?").run(
        expired,
        k.id,
      );
    } else if (new Date(expired.replace(" ", "T")) <= new Date()) {
      return { status: false, reason: "EXPIRED KEY" };
    }

    const devices = (k.devices || "").split(",").filter(Boolean);
    if (!devices.includes(serial)) {
      if (devices.length >= k.max_devices)
        return { status: false, reason: "MAX DEVICE REACHED" };
      devices.push(serial);
      db.prepare("UPDATE keys_code SET devices=? WHERE id=?").run(
        devices.join(","),
        k.id,
      );
    }
    const real = `${game}-${key}-${serial}-${pepper}`;
    return {
      status: successStatus,
      data: {
        real,
        token: crypto.createHash("md5").update(real).digest("hex"),
        rng: timestamp,
        ...extra(expired, storedExpired),
      },
    };
  }

  app.get("/connect", (_, res) => res.json(null));
  app.post("/connect", (req, res) =>
    res.json(
      db.transaction(activate)(
        req.body.game,
        req.body.user_key,
        req.body.serial,
        279854,
        "encryptedbase64",
        (_, storedExpired) => ({
          EXP: storedExpired,
          expiry: "435271d37ab9926dabe9c3b523b85ead5df1febd",
        }),
      ),
    ),
  );

  const aesDecrypt = (ciphertext, key, iv) => {
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  };
  const aesEncrypt = (plaintext, key, iv) => {
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    return Buffer.concat([cipher.update(plaintext), cipher.final()]);
  };
  app.all("/connn", (req, res) => {
    try {
      const encoded = String(req.query.token || "");
      const parts = encoded.split("|||", 3);
      if (parts.length !== 3) throw Error("Invalid token");
      const iv = Buffer.from(parts[0], "base64");
      const signature = Buffer.from(parts[1], "base64");
      const ciphertext = Buffer.from(parts[2], "base64");
      const actual = crypto.createHash("sha256").update(ciphertext).digest();
      if (
        signature.length !== actual.length ||
        !crypto.timingSafeEqual(signature, actual)
      )
        throw Error("Invalid signature");
      const plaintext = aesDecrypt(
        ciphertext,
        Buffer.from("__&#d4eBMLWdLM7bRgS3YY@X7p+3P_8*"),
        iv,
      );
      const input = JSON.parse(plaintext.toString("utf8"));
      const output = input.unique
        ? db.transaction(activate)(
            input.game,
            input.user_key,
            input.serial,
            true,
            "Vm8Lk7Uj2JmsjCPVPVjrLa7zgfx3uz9E",
            () => ({
              hash: crypto
                .createHash("sha512")
                .update(String(input.unique))
                .digest("latin1"),
            }),
          )
        : { status: false, reason: "INVALID PARAMETER" };
      const responseIv = crypto.randomBytes(16);
      const encrypted = aesEncrypt(
        Buffer.from(JSON.stringify(output)),
        Buffer.from("-p2-7^fqQDH^#_uPP2Ssc@xHxRfdYvBt"),
        responseIv,
      );
      const sign = crypto.createHash("sha256").update(encrypted).digest();
      res.type("text/plain").send(
        Buffer.concat([
          responseIv,
          Buffer.from("|||"),
          sign,
          Buffer.from("|||"),
          encrypted,
        ]).toString("base64"),
      );
    } catch {
      res.status(400).type("text/plain").send("");
    }
  });
  const dir = path.join(root, "data", "uploads"),
    upload = multer({
      dest: dir,
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_, f, cb) =>
        cb(null, /\.(jpg|jpeg|docx|pdf|so|ehi)$/i.test(f.originalname)),
    });
  app.post("/uploads", auth, role(1), upload.single("file"), (req, res) =>
    req.file
      ? json(
          res,
          {
            file: req.file.filename,
            name: path.basename(req.file.originalname),
          },
          201,
        )
      : json(res, { error: "Invalid file" }, 400),
  );
  app.get("/uploads", auth, role(1), (_, res) =>
    json(res, { files: fs.readdirSync(dir) }),
  );
  const safe = (n) => /^[a-f0-9]{32}$/i.test(n) && path.join(dir, n);
  app.get("/uploads/:name", auth, role(1), (req, res) => {
    const f = safe(req.params.name);
    f && fs.existsSync(f)
      ? res.download(f)
      : json(res, { error: "Not found" }, 404);
  });
  app.delete("/uploads/:name", auth, role(1), (req, res) => {
    const f = safe(req.params.name);
    if (!f || !fs.existsSync(f)) return json(res, { error: "Not found" }, 404);
    fs.unlinkSync(f);
    json(res, { message: "Deleted" });
  });
}
