function Stars({ rating }) {
  return (
    <div className="flex gap-0.5 text-rose" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 20 20" fill={i < rating ? "currentColor" : "#EAE4D9"} aria-hidden="true">
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.79L10 14.9l-5.2 2.73 1-5.8-4.2-4.1 5.8-.84L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ testimonials }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-lg italic text-rose-dark">
          O que dizem de nós
        </p>
        <h2 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Depoimentos
        </h2>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="flex flex-col gap-4 rounded-2xl bg-cream-dark/40 p-6"
          >
            <Stars rating={t.rating} />
            <blockquote className="text-sm leading-relaxed text-ink/75">
              “{t.comment}”
            </blockquote>
            <figcaption className="mt-auto flex items-center gap-3 pt-2">
              {t.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.photo_url}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose/20 font-display text-lg text-rose-dark">
                  {t.name?.[0]}
                </span>
              )}
              <span className="text-sm font-semibold text-ink">{t.name}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
