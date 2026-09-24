export default function About({ settings }) {
  return (
    <section id="sobre" className="mx-auto max-w-6xl px-5 py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 overflow-hidden rounded-2xl lg:order-1">
          {settings.about_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.about_image_url}
              alt="Ambiente do AG Salão de Beleza e Spa"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          ) : (
            <div className="aspect-[4/5] w-full bg-gradient-to-br from-rose/20 via-cream-dark to-rose-light/20" />
          )}
        </div>
        <div className="order-1 lg:order-2">
          <p className="font-display text-lg italic text-rose-dark">
            Quem somos
          </p>
          <h2 className="mt-2 text-balance font-display text-4xl font-semibold text-ink sm:text-5xl">
            {settings.about_title || "Sobre Nós"}
          </h2>
          <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-ink/70">
            {settings.about_text ||
              "No AG Salão de Beleza e Spa cuidamos de si com dedicação, técnica e produtos de qualidade, num espaço pensado para realçar a sua beleza natural e proporcionar momentos de bem-estar."}
          </p>
        </div>
      </div>
    </section>
  );
}
