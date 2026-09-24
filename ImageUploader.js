"use client";

import { useRef, useState } from "react";

export default function ImageUploader({ label, value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao enviar imagem.");
      onChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {label && (
        <p className="mb-1.5 text-sm font-medium text-ink/70">{label}</p>
      )}
      <div className="flex items-center gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ink/10 bg-cream-dark/40">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-ink/30">Sem imagem</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="cursor-pointer rounded-full border border-rose px-3.5 py-1.5 text-xs font-semibold text-rose-dark hover:bg-rose hover:text-white">
            {uploading ? "A enviar..." : value ? "Trocar imagem" : "Carregar imagem"}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleFile}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-ink/40 hover:text-red-600"
            >
              Remover
            </button>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
