// src/lib/crud.js
//
// Fábrica de handlers CRUD reutilizados pelas rotas de API de cada
// recurso administrável (serviços, galeria, banners, promoções,
// depoimentos, vagas). Evita repetir a mesma lógica de
// autenticação + validação + SQL em cada ficheiro de rota.

import { getDb, newId } from "@/lib/db";
import { requireAdminSession, unauthorizedResponse } from "@/lib/apiAuth";

// Configuração de campos por tabela: nome -> tipo ("text" | "number" | "bool")
export const RESOURCE_CONFIG = {
  services: {
    table: "services",
    orderBy: "sort_order ASC, created_at DESC",
    fields: {
      name: "text",
      category: "text",
      description: "text",
      price: "number",
      duration_minutes: "number",
      image_url: "text",
      featured: "bool",
      active: "bool",
      sort_order: "number",
    },
  },
  gallery_images: {
    table: "gallery_images",
    orderBy: "sort_order ASC, created_at DESC",
    fields: {
      title: "text",
      description: "text",
      category: "text",
      url: "text",
      sort_order: "number",
      active: "bool",
    },
  },
  banners: {
    table: "banners",
    orderBy: "sort_order ASC, rowid DESC",
    fields: {
      image_url: "text",
      title: "text",
      subtitle: "text",
      button_text: "text",
      link: "text",
      sort_order: "number",
      active: "bool",
    },
  },
  promotions: {
    table: "promotions",
    orderBy: "created_at DESC",
    fields: {
      title: "text",
      description: "text",
      image_url: "text",
      old_price: "number",
      new_price: "number",
      start_date: "text",
      end_date: "text",
      active: "bool",
    },
  },
  testimonials: {
    table: "testimonials",
    orderBy: "created_at DESC",
    fields: {
      name: "text",
      comment: "text",
      rating: "number",
      photo_url: "text",
      active: "bool",
    },
  },
  jobs: {
    table: "jobs",
    orderBy: "created_at DESC",
    fields: {
      title: "text",
      description: "text",
      requirements: "text",
      active: "bool",
    },
  },
};

function coerce(value, type) {
  if (type === "bool") return value ? 1 : 0;
  if (type === "number") return value === "" || value == null ? 0 : Number(value);
  return value ?? "";
}

export function createListCreateHandlers(resourceKey) {
  const config = RESOURCE_CONFIG[resourceKey];

  async function GET() {
    const db = getDb();
    const rows = db
      .prepare(`SELECT * FROM ${config.table} ORDER BY ${config.orderBy}`)
      .all();
    return Response.json(rows);
  }

  async function POST(request) {
    const session = await requireAdminSession();
    if (!session) return unauthorizedResponse();

    const body = await request.json();
    const db = getDb();

    const columns = ["id"];
    const placeholders = ["?"];
    const values = [newId()];

    for (const [field, type] of Object.entries(config.fields)) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        columns.push(field);
        placeholders.push("?");
        values.push(coerce(body[field], type));
      }
    }

    db.prepare(
      `INSERT INTO ${config.table} (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`
    ).run(...values);

    const created = db
      .prepare(`SELECT * FROM ${config.table} WHERE id = ?`)
      .get(values[0]);
    return Response.json(created, { status: 201 });
  }

  return { GET, POST };
}

export function createDetailHandlers(resourceKey) {
  const config = RESOURCE_CONFIG[resourceKey];

  async function PUT(request, { params }) {
    const session = await requireAdminSession();
    if (!session) return unauthorizedResponse();

    const body = await request.json();
    const db = getDb();

    const setClauses = [];
    const values = [];
    for (const [field, type] of Object.entries(config.fields)) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        setClauses.push(`${field} = ?`);
        values.push(coerce(body[field], type));
      }
    }

    if (setClauses.length === 0) {
      return Response.json({ error: "Nada para atualizar." }, { status: 400 });
    }

    values.push(params.id);
    const result = db
      .prepare(`UPDATE ${config.table} SET ${setClauses.join(", ")} WHERE id = ?`)
      .run(...values);

    if (result.changes === 0) {
      return Response.json({ error: "Não encontrado." }, { status: 404 });
    }

    const updated = db
      .prepare(`SELECT * FROM ${config.table} WHERE id = ?`)
      .get(params.id);
    return Response.json(updated);
  }

  async function DELETE(request, { params }) {
    const session = await requireAdminSession();
    if (!session) return unauthorizedResponse();

    const db = getDb();
    const result = db
      .prepare(`DELETE FROM ${config.table} WHERE id = ?`)
      .run(params.id);

    if (result.changes === 0) {
      return Response.json({ error: "Não encontrado." }, { status: 404 });
    }
    return Response.json({ ok: true });
  }

  return { PUT, DELETE };
}
