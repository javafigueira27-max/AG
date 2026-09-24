"use client";

import { useMemo, useState } from "react";

function formatPrice(value) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function Services({ services }) {
  const categories = useMemo(() => {
    const set = new Set(services.map((s) => s.category || "Outros"));
    return ["Todos", ...Array.from(set)];
  }, [services]);

  const [active, setActive] = useState("Todos");

  const visible =
    active === "Todos"
      ? services
      : services.filter((s) => (s.category || "Outros") === active);

  if (services.length === 0) {
    return (
      <section id="servicos" className="bg-cream-dark/40 py-24">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <h2 className="font-display text-4xl font-semibold text-ink">
            Serviços
          </h2>
          <p className="mt-4 text-ink/60">
            Os serviços serão apresentados aqui assim que forem cadastrados no
            painel administrativo.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="servicos" className="bg-cream-dark/40 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-display text-lg italic text-rose-dark">Menu</p>
          <h2 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Os Nossos Serviços
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
                  : "bg-white text-ink/70 hover:bg-rose/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((service) => (
            <article
              key={service.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm shadow-black/5"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
                {service.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={service.image_url}
                    alt={service.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-3xl italic text-rose/40">
                    {service.name}
                  </div>
                )}
                {service.featured === 1 && (
                  <span className="absolute left-3 top-3 rounded-full bg-rose px-3 py-1 text-xs font-semibold text-white">
                    Destaque
                  </span>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-dark">
                  {service.category}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
                  {service.name}
                </h3>
                {service.description && (
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">
                    {service.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="font-display text-xl font-semibold text-rose-dark">
                      {formatPrice(service.price)}
                    </p>
                    {service.duration_minutes > 0 && (
                      <p className="text-xs text-ink/50">
                        {service.duration_minutes} min
                      </p>
                    )}
                  </div>
                  <a
                    href="#agendamento"
                    className="rounded-full border border-rose px-4 py-2 text-xs font-semibold text-rose-dark transition-colors hover:bg-rose hover:text-white"
                  >
                    Agendar
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
