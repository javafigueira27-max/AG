const SOCIALS = [
  { key: "facebook_url", label: "Facebook" },
  { key: "instagram_url", label: "Instagram" },
  { key: "tiktok_url", label: "TikTok" },
];

export default function Footer({ settings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink py-14 text-cream/70">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-semibold text-cream">
              {settings.company_name}
            </p>
            <p className="mt-2 font-display italic text-rose-light">
              {settings.slogan}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cream/40">
              Contactos
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {settings.phone && <li>{settings.phone}</li>}
              {settings.email && <li>{settings.email}</li>}
              {settings.address && <li>{settings.address}</li>}
              <li>{settings.city}</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cream/40">
              Redes Sociais
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {SOCIALS.filter((s) => settings[s.key]).map((s) => (
                <li key={s.key}>
                  <a
                    href={settings[s.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-rose-light"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              {SOCIALS.every((s) => !settings[s.key]) && (
                <li className="text-cream/40">—</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-cream/10 pt-6 text-center text-xs text-cream/40">
          © {year} {settings.company_name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
