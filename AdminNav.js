"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/empresa", label: "Dados da Empresa", icon: "🏠" },
  { href: "/admin/servicos", label: "Serviços", icon: "💇" },
  { href: "/admin/galeria", label: "Galeria", icon: "🖼️" },
  { href: "/admin/banners", label: "Banners", icon: "🎞️" },
  { href: "/admin/promocoes", label: "Promoções", icon: "🏷️" },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: "💬" },
  { href: "/admin/agendamentos", label: "Agendamentos", icon: "📅" },
  { href: "/admin/vagas", label: "Vagas", icon: "💼" },
  { href: "/admin/senha", label: "Palavra-passe", icon: "🔒" },
];

export default function AdminNav({ userEmail }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-ink/10 bg-ink text-cream">
      <div className="flex items-center gap-2 border-b border-cream/10 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose font-display text-white">
          AG
        </span>
        <div>
          <p className="text-sm font-semibold">AG Salão</p>
          <p className="text-xs text-cream/40">Painel Admin</p>
        </div>
      </div>

      <nav className="admin-scroll flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-rose text-white"
                  : "text-cream/70 hover:bg-cream/5 hover:text-cream"
              }`}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-cream/10 px-5 py-4">
        <p className="mb-2 truncate text-xs text-cream/40">{userEmail}</p>
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            target="_blank"
            className="text-xs font-medium text-cream/60 hover:text-rose-light"
          >
            Ver site público ↗
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-left text-xs font-semibold text-rose-light hover:text-rose"
          >
            Terminar sessão
          </button>
        </div>
      </div>
    </aside>
  );
}
