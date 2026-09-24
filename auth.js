// src/lib/auth.js
//
// Autenticação do painel administrativo.
// - Palavra-passe: hash com bcrypt (nunca guardada em texto simples).
// - Sessão: JWT assinado (HS256) guardado num cookie httpOnly, seguro,
//   com SameSite=Lax. O segredo vem de process.env.AUTH_SECRET.
// - Usa a biblioteca "jose" porque é compatível com o runtime Edge,
//   necessário para verificar a sessão no middleware.

import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "ag_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 horas

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET não está definido (ou é demasiado curto) nas variáveis de ambiente. Defina um valor forte em .env.local."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken({ userId, email }) {
  const key = getSecretKey();
  return await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(key);
}

export async function verifySessionToken(token) {
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (err) {
    return null;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE = SESSION_DURATION_SECONDS;
