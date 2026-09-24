function formatPrice(value) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function Promotions({ promotions }) {
  if (promotions.length === 0) return null;

  return (
    <section id="promocoes" className="bg-rose-dark py-24 text-white">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-display text-lg italic text-rose-light">
            Por tempo limitado
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
            Promoções
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo) => (
            <article
              key={promo.id}
              className="overflow-hidden rounded-2xl bg-white text-ink shadow-lg"
            >
              <div className="aspect-[16/10] overflow-hidden bg-cream-dark">
                {promo.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={promo.image_url}
                    alt={promo.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-2xl italic text-rose/40">
                    {promo.title}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl font-semibold">
                  {promo.title}
                </h3>
                {promo.description && (
                  <p className="mt-2 text-sm text-ink/60">{promo.description}</p>
                )}
                <div className="mt-4 flex items-baseline gap-3">
                  {promo.old_price > 0 && (
                    <span className="text-sm text-ink/40 line-through">
                      {formatPrice(promo.old_price)}
                    </span>
                  )}
                  <span className="font-display text-2xl font-semibold text-rose-dark">
                    {formatPrice(promo.new_price)}
                  </span>
                </div>
                {promo.end_date && (
                  <p className="mt-2 text-xs text-ink/50">
                    Válido até {new Date(promo.end_date).toLocaleDateString("pt-PT")}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
