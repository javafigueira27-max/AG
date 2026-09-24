export default function Hero({ settings }) {
  const digits = (settings.whatsapp || "").replace(/\D/g, "");
  const phone = digits.startsWith("244") ? digits : `244${digits}`;
  const waHref = `https://wa.me/${phone}?text=${encodeURIComponent(
    "Olá, AG Salão de Beleza e Spa. Gostaria de saber mais informações sobre os serviços."
  )}`;

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-ink text-cream"
    >
      <div className="absolute inset-0">
        {settings.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={settings.cover_image_url}
            alt=""
            className="h-full w-full object-cover opacity-45"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-ink via-ink-light to-rose-dark/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
      </div>

      <div className="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-5 py-24">
        <p className="mb-4 font-display text-lg italic text-rose-light">
          {settings.city}
        </p>
        <h1 className="max-w-2xl text-balance font-display text-5xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl">
          {settings.company_name}
        </h1>
        <p className="mt-6 max-w-xl text-balance font-display text-2xl italic text-cream/90">
          {settings.slogan}
        </p>
        {settings.description && (
          <p className="mt-5 max-w-lg text-base leading-relaxed text-cream/70">
            {settings.description}
          </p>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#agendamento"
            className="rounded-full bg-rose px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose/20 transition-colors hover:bg-rose-dark"
          >
            Agendar horário
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-cream/30 px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:border-rose-light hover:text-rose-light"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
