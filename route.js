import { getDb, newId } from "@/lib/db";
import { requireAdminSession, unauthorizedResponse } from "@/lib/apiAuth";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM job_applications ORDER BY created_at DESC")
    .all();
  return Response.json(rows);
}

export async function POST(request) {
  const body = await request.json();
  const { job_id, job_title, name, email, phone, message } = body;

  if (!name || !email) {
    return Response.json(
      { error: "Preencha pelo menos nome e email." },
      { status: 400 }
    );
  }

  const db = getDb();
  const id = newId();
  db.prepare(
    `INSERT INTO job_applications (id, job_id, job_title, name, email, phone, message)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, job_id || null, job_title || "", name, email, phone || "", message || "");

  const created = db.prepare("SELECT * FROM job_applications WHERE id = ?").get(id);
  return Response.json(created, { status: 201 });
}
