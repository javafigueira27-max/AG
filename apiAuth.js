// src/lib/apiAuth.js
//
// Guarda de autorização usada dentro das rotas de API que só o
// administrador pode chamar (criar/editar/eliminar). O middleware
// protege as páginas /admin/*, mas as APIs precisam da própria
// verificação porque podem ser chamadas diretamente.

import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function requireAdminSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  return session;
}

export function unauthorizedResponse() {
  return Response.json(
    { error: "Não autorizado. Faça login como administrador." },
    { status: 401 }
  );
}
