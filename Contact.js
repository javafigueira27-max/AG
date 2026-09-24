export default function Contact({ settings }) {
  return (
    <section id="contactos" className="mx-auto max-w-6xl px-5 py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-lg italic text-rose-dark">Fale connosco</p>
        <h2 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Contactos
        </h2>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {settings.phone && (
          <InfoCard label="Telefone" value={settings.phone} href={`tel:${settings.phone.replace(/\s/g, "")}`} />
        )}
        {settings.email && (
          <InfoCard label="Email" value={settings.email} href={`mailto:${settings.email}`} />
        )}
        {settings.address && <InfoCard label="Endereço" value={settings.address} />}
        {settings.hours && <InfoCard label="Horário" value={settings.hours} />}
      </div>

      {settings.map_url && (
        <div className="mt-10 overflow-hidden rounded-2xl">
          <iframe
            src={settings.map_url}
            title="Localização no mapa"
            width="100%"
            height="360"
            loading="lazy"
            className="border-0"
          />
        </div>
      )}
    </section>
  );
}

function InfoCard({ label, value, href }) {
  const content = (
    <div className="h-full rounded-2xl bg-cream-dark/40 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-rose-dark">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-line text-sm font-medium text-ink">
        {value}
      </p>
    </div>
  );
  return href ? (
    <a href={href} className="block transition-opacity hover:opacity-80">
      {content}
    </a>
  ) : (
    content
  );
}
