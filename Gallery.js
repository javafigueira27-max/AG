"use client";

import { useMemo, useState } from "react";

export default function Gallery({ images }) {
  const categories = useMemo(() => {
    const set = new Set(images.map((i) => i.category || "Geral"));
    return ["Todos", ...Array.from(set)];
  }, [images]);

  const [active, setActive] = useState("Todos");
  const [lightbox, setLightbox] = useState(null);

  const visible =
    active === "Todos"
      ? images
      : images.filter((i) => (i.category || "Geral") === active);

  if (images.length === 0) {
    return (
      <section id="galeria" className="mx-auto max-w-6xl px-5 py-24 text-center">
        <h2 className="font-display text-4xl font-semibold text-ink">Galeria</h2>
        <p className="mt-4 text-ink/60">
          As fotos aparecerão aqui assim que forem carregadas no painel.
        </p>
      </section>
    );
  }

  return (
    <section id="galeria" className="mx-auto max-w-6xl px-5 py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-lg italic text-rose-dark">Portfólio</p>
        <h2 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Galeria
        </h2>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === cat
                ? "bg-rose text-white"
                : "bg-cream-dark/60 text-ink/70 hover:bg-rose/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setLightbox(img)}
            className="group relative aspect-square overflow-hidden rounded-xl"
            aria-label={`Ver imagem ampliada: ${img.title || "foto da galeria"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.title || "Foto do AG Salão de Beleza e Spa"}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title || "Imagem ampliada"}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-5"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Fechar imagem"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            ✕
          </button>
          <figure className="max-h-[85vh] max-w-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.url}
              alt={lightbox.title || ""}
              className="max-h-[75vh] w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {(lightbox.title || lightbox.description) && (
              <figcaption className="mt-3 text-center text-sm text-cream/80">
                {lightbox.title}
                {lightbox.description ? ` — ${lightbox.description}` : ""}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </section>
  );
}
