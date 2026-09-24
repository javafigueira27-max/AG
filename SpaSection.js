export default function SpaSection({ settings }) {
  return (
    <section id="spa" className="relative overflow-hidden bg-ink py-24 text-cream">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
        <div>
          <p className="font-display text-lg italic text-rose-light">
            Bem-estar
          </p>
          <h2 className="mt-2 text-balance font-display text-4xl font-semibold sm:text-5xl">
            {settings.spa_title || "Experiência Spa"}
          </h2>
          <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-cream/70">
            {settings.spa_text ||
              "Reserve um momento só para si. O nosso spa combina técnicas relaxantes, ambiente tranquilo e atenção aos detalhes para uma experiência verdadeiramente restauradora."}
          </p>
          <a
            href="#agendamento"
            className="mt-8 inline-block rounded-full bg-rose px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-rose-dark"
          >
            Reservar experiência
          </a>
        </div>
        <div className="overflow-hidden rounded-2xl">
          {settings.spa_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.spa_image_url}
              alt="Experiência Spa"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          ) : (
            <div className="aspect-[4/5] w-full bg-gradient-to-tr from-rose-dark/30 via-ink-light to-rose/20" />
          )}
        </div>
      </div>
    </section>
  );
}
