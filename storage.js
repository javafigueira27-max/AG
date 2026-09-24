// src/lib/storage.js
//
// Armazenamento de imagens.
//
// Produção (Vercel): usa @vercel/blob — armazenamento persistente e
// distribuído por CDN, compatível com o sistema de ficheiros efémero
// das funções serverless da Vercel. Ativado automaticamente quando a
// variável de ambiente BLOB_READ_WRITE_TOKEN está definida.
//
// Desenvolvimento local (sem token configurado): grava em
// /public/uploads. Isto é apenas para conveniência local — em produção
// na Vercel este modo NÃO persiste entre deploys, por isso a app avisa
// no README para configurar o Blob antes de publicar.

import fs from "fs";
import path from "path";
import { newId } from "@/lib/db";

const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function saveUploadedFile(file) {
  const ext = safeExtension(file.name);
  const filename = `${Date.now()}-${newId()}${ext}`;

  if (hasBlobToken) {
    const { put } = await import("@vercel/blob");
    const buffer = Buffer.from(await file.arrayBuffer());
    const blob = await put(`uploads/${filename}`, buffer, {
      access: "public",
      contentType: file.type || undefined,
    });
    return { url: blob.url, storage: "vercel-blob" };
  }

  // Fallback local (desenvolvimento)
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(uploadsDir, filename), buffer);
  return { url: `/uploads/${filename}`, storage: "local-disk" };
}

function safeExtension(name) {
  const ext = path.extname(name || "").toLowerCase();
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
  return allowed.includes(ext) ? ext : ".jpg";
}

export const usingVercelBlob = hasBlobToken;
