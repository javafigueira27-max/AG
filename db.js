// src/lib/db.js
//
// Camada de acesso à base de dados. Usa SQLite (better-sqlite3) com um
// ficheiro em disco persistente — funciona em desenvolvimento local e em
// qualquer host com disco persistente (ex: VPS, Railway, Render).
//
// IMPORTANTE — Vercel: a Vercel usa funções serverless com sistema de
// ficheiros efémero (tudo é apagado a cada novo deploy / instância fria).
// Por isso, para produção na Vercel, troque DATABASE_PATH para apontar
// para um banco externo compatível (Vercel Postgres, Neon, Turso, etc).
// Veja instruções completas no README.md, secção "Base de Dados na Vercel".

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const DB_PATH = process.env.DATABASE_PATH || "./data/ag-salao.db";

function getDb() {
  const globalAny = globalThis;
  if (globalAny.__agSalaoDb) return globalAny.__agSalaoDb;

  const resolved = path.resolve(process.cwd(), DB_PATH);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });

  const db = new Database(resolved);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  runMigrations(db);
  seedIfEmpty(db);

  globalAny.__agSalaoDb = db;
  return db;
}

function runMigrations(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      company_name TEXT NOT NULL DEFAULT 'AG Salão de Beleza e Spa',
      slogan TEXT NOT NULL DEFAULT 'Realçando a beleza que Deus colocou em você.',
      description TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '923626968',
      whatsapp TEXT NOT NULL DEFAULT '923626968',
      email TEXT NOT NULL DEFAULT 'agcab4784@gmail.com',
      address TEXT NOT NULL DEFAULT '',
      city TEXT NOT NULL DEFAULT 'Luanda, Angola',
      hours TEXT NOT NULL DEFAULT 'Segunda a Sábado: 09h00 - 19h00',
      map_url TEXT NOT NULL DEFAULT '',
      logo_url TEXT NOT NULL DEFAULT '',
      favicon_url TEXT NOT NULL DEFAULT '',
      cover_image_url TEXT NOT NULL DEFAULT '',
      about_title TEXT NOT NULL DEFAULT 'Sobre Nós',
      about_text TEXT NOT NULL DEFAULT '',
      about_image_url TEXT NOT NULL DEFAULT '',
      spa_title TEXT NOT NULL DEFAULT 'Experiência Spa',
      spa_text TEXT NOT NULL DEFAULT '',
      spa_image_url TEXT NOT NULL DEFAULT '',
      facebook_url TEXT NOT NULL DEFAULT '',
      instagram_url TEXT NOT NULL DEFAULT '',
      tiktok_url TEXT NOT NULL DEFAULT '',
      jobs_has_openings INTEGER NOT NULL DEFAULT 0,
      jobs_message_with_openings TEXT NOT NULL DEFAULT 'Estamos a recrutar! Veja as vagas abaixo e candidate-se.',
      jobs_message_without_openings TEXT NOT NULL DEFAULT 'Neste momento não temos vagas disponíveis, mas envie o seu currículo — teremos todo o gosto em avaliar o seu perfil para futuras oportunidades.',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Outros',
      description TEXT NOT NULL DEFAULT '',
      price REAL NOT NULL DEFAULT 0,
      duration_minutes INTEGER NOT NULL DEFAULT 30,
      image_url TEXT NOT NULL DEFAULT '',
      featured INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS gallery_images (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'Geral',
      url TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS banners (
      id TEXT PRIMARY KEY,
      image_url TEXT NOT NULL,
      title TEXT NOT NULL DEFAULT '',
      subtitle TEXT NOT NULL DEFAULT '',
      button_text TEXT NOT NULL DEFAULT '',
      link TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS promotions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '',
      old_price REAL NOT NULL DEFAULT 0,
      new_price REAL NOT NULL DEFAULT 0,
      start_date TEXT,
      end_date TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      comment TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      photo_url TEXT NOT NULL DEFAULT '',
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      client_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      whatsapp TEXT NOT NULL DEFAULT '',
      service_id TEXT,
      service_name TEXT NOT NULL DEFAULT '',
      booking_date TEXT NOT NULL,
      booking_time TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Pendente',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      requirements TEXT NOT NULL DEFAULT '',
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS job_applications (
      id TEXT PRIMARY KEY,
      job_id TEXT,
      job_title TEXT NOT NULL DEFAULT '',
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Garante que sempre existe exatamente uma linha de settings (id = 1).
  const row = db.prepare("SELECT id FROM settings WHERE id = 1").get();
  if (!row) {
    db.prepare("INSERT INTO settings (id) VALUES (1)").run();
  }
}

function seedIfEmpty(db) {
  const userCount = db.prepare("SELECT COUNT(*) AS c FROM admin_users").get().c;
  if (userCount === 0) {
    const email = process.env.ADMIN_EMAIL || "agcab4784@gmail.com";
    const password = process.env.ADMIN_PASSWORD || "mudar123";
    const hash = bcrypt.hashSync(password, 10);
    db.prepare(
      "INSERT INTO admin_users (id, email, password_hash) VALUES (?, ?, ?)"
    ).run(cryptoRandomId(), email.toLowerCase().trim(), hash);
    // eslint-disable-next-line no-console
    console.log(
      `[seed] Utilizador admin criado: ${email} (defina ADMIN_EMAIL / ADMIN_PASSWORD no .env antes do primeiro arranque para escolher a senha).`
    );
  }
}

function cryptoRandomId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  );
}

export { getDb, cryptoRandomId as newId };
