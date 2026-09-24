import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getDb } from "@/lib/db";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata() {
  const db = getDb();
  const settings = db.prepare("SELECT * FROM settings WHERE id = 1").get();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const title = `${settings.company_name} | ${settings.city.split(",")[0]}`;
  const description =
    settings.description ||
    "Salão de beleza e spa em Luanda, Angola. Cabelo, unhas, estética, maquiagem e experiências de spa num ambiente elegante e acolhedor.";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${settings.company_name}`,
    },
    description,
    icons: settings.favicon_url ? [{ url: settings.favicon_url }] : undefined,
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: settings.company_name,
      images: settings.cover_image_url ? [{ url: settings.cover_image_url }] : [],
      locale: "pt_AO",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-AO" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
