import "server-only";
import Database from "better-sqlite3";
import { randomBytes, createHash } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";

const store = path.join(process.cwd(), ".local-data");
let database;
export function db() {
  if (database) return database;
  mkdirSync(store, { recursive: true });
  database = new Database(path.join(store, "spectrum.sqlite"));
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL, last_name TEXT NOT NULL, phone TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS addresses (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      label TEXT NOT NULL, full_name TEXT NOT NULL, address1 TEXT NOT NULL,
      address2 TEXT NOT NULL DEFAULT '', city TEXT NOT NULL, state TEXT NOT NULL,
      postal_code TEXT NOT NULL, country TEXT NOT NULL DEFAULT 'US'
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      order_number TEXT NOT NULL UNIQUE, status TEXT NOT NULL, total REAL NOT NULL,
      items TEXT NOT NULL DEFAULT '[]', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS reset_tokens (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
  `);
  return database;
}
export const digest = (value) => createHash("sha256").update(value).digest("hex");
export const newToken = () => randomBytes(32).toString("hex");
export function getUser(token) {
  if (!token) return null;
  const row = db().prepare(`SELECT u.id,u.email,u.first_name,u.last_name,u.phone FROM sessions s
    JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?`).get(digest(token), Date.now());
  return row || null;
}
export function cleanUser(user) {
  return user ? { id:user.id,email:user.email,first_name:user.first_name,last_name:user.last_name,phone:user.phone } : null;
}
