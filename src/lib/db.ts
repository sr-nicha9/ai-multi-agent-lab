/**
 * SQLite helpers for contact + guestbook (better-sqlite3).
 * Validation happens here before any write — every thrown message is a short
 * code intended to be public (`VALIDATION: ...`, `NOT_IMPLEMENTED: ...`),
 * never raw driver/SQL internals (D6, D7).
 */
import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  created_at: string;
};

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  const dir = process.env.DATA_DIR || join(process.cwd(), 'data');
  mkdirSync(dir, { recursive: true });
  db = new Database(join(dir, 'site.sqlite'));
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return db;
}

/** Limits mirror the client-side `maxlength` on the contact/guestbook forms. */
const LIMITS = {
  name: 80,
  email: 120,
  contactMessage: 2000,
  guestbookMessage: 500,
  guestbookListMax: 200,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Coerce + validate one text field. Throws only safe, public error codes —
 * the field name and length are fine to expose; nothing else is.
 */
function requireText(value: unknown, field: string, max: number): string {
  if (typeof value !== 'string') {
    throw new Error(`VALIDATION: ${field} is required`);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error(`VALIDATION: ${field} is required`);
  }
  if (trimmed.length > max) {
    throw new Error(`VALIDATION: ${field} must be at most ${max} characters`);
  }
  return trimmed;
}

function requireEmail(value: unknown): string {
  const email = requireText(value, 'email', LIMITS.email);
  if (!EMAIL_RE.test(email)) {
    throw new Error('VALIDATION: email format is invalid');
  }
  return email;
}

/** Insert a contact form message. Throws `VALIDATION: ...` on bad input. */
export function insertContact(input: {
  name: string;
  email: string;
  message: string;
}): ContactMessage {
  const name = requireText(input?.name, 'name', LIMITS.name);
  const email = requireEmail(input?.email);
  const message = requireText(input?.message, 'message', LIMITS.contactMessage);
  const db = getDb();
  const info = db
    .prepare('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)')
    .run(name, email, message);
  return db
    .prepare('SELECT id, name, email, message, created_at FROM contact_messages WHERE id = ?')
    .get(Number(info.lastInsertRowid)) as ContactMessage;
}

/** Newest first, capped — guestbook v1 is read-mostly (D5). */
export function listGuestbook(): GuestbookEntry[] {
  return getDb()
    .prepare(
      `SELECT id, name, message, created_at
       FROM guestbook
       ORDER BY id DESC
       LIMIT ?`
    )
    .all(LIMITS.guestbookListMax) as GuestbookEntry[];
}

/** Insert a guestbook entry. Throws `VALIDATION: ...` on bad input. */
export function insertGuestbook(input: {
  name: string;
  message: string;
}): GuestbookEntry {
  const name = requireText(input?.name, 'name', LIMITS.name);
  const message = requireText(input?.message, 'message', LIMITS.guestbookMessage);
  const db = getDb();
  const info = db
    .prepare('INSERT INTO guestbook (name, message) VALUES (?, ?)')
    .run(name, message);
  return db
    .prepare('SELECT id, name, message, created_at FROM guestbook WHERE id = ?')
    .get(Number(info.lastInsertRowid)) as GuestbookEntry;
}
