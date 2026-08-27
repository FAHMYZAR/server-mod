import test from "node:test";
import assert from "node:assert/strict";
import Database from "better-sqlite3";
test("sqlite supports transactional balance deduction", () => {
  const db = new Database(":memory:");
  db.exec(
    "CREATE TABLE users(id INTEGER PRIMARY KEY,saldo INTEGER);INSERT INTO users VALUES(1,10)",
  );
  const tx = db.transaction(() =>
    db
      .prepare("UPDATE users SET saldo=saldo-? WHERE id=? AND saldo>=?")
      .run(7, 1, 7),
  );
  assert.equal(tx().changes, 1);
  assert.equal(db.prepare("SELECT saldo FROM users").get().saldo, 3);
});
