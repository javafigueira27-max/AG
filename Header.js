"use client";

import { useState } from "react";

const LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#spa", label: "Spa" },
  { href: "#galeria", label: "Galeria" },
  { href: "#promocoes", label: "Promoções" },
  { href: "#trabalhe-connosco", label: "Trabalhe Connosco" },
  { href: "#contactos", label: "Contactos" },
];

export default function Header({ settings }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#inicio" className="flex items-center gap-2">
          {settings.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo_url}
              alt={settings.company_name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose text-lg font-display text-white">
              {settings.company_name?.[0] || "A"}
            </span>
          )}
          <span className="font-display text-xl font-semibold text-ink">
            {settings.company_name}
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-rose-dark"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href="#agendamento"
            className="rounded-full bg-rose px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-dark"
          >
            Agendar
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Abrir menu de navegação"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 lg:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="#18181E" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="#18181E" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" className="border-t border-black/5 bg-cream px-5 pb-5 lg:hidden">
          <ul className="flex flex-col gap-1 pt-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-rose/10 hover:text-rose-dark"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#agendamento"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-rose px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Agendar
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
