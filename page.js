import { getDb } from "@/lib/db";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Services from "@/components/site/Services";
import SpaSection from "@/components/site/SpaSection";
import Gallery from "@/components/site/Gallery";
import Promotions from "@/components/site/Promotions";
import Testimonials from "@/components/site/Testimonials";
import BookingForm from "@/components/site/BookingForm";
import Jobs from "@/components/site/Jobs";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import WhatsAppButton from "@/components/site/WhatsAppButton";

// Sempre renderizar dinamicamente: os dados vêm do painel admin e podem
// mudar a qualquer momento, por isso não fazemos cache estático da página.
export const dynamic = "force-dynamic";

function getPublicData() {
  const db = getDb();

  const settings = db.prepare("SELECT * FROM settings WHERE id = 1").get();

  const services = db
    .prepare(
      "SELECT * FROM services WHERE active = 1 ORDER BY sort_order ASC, created_at DESC"
    )
    .all();

  const gallery = db
    .prepare(
      "SELECT * FROM gallery_images WHERE active = 1 ORDER BY sort_order ASC, created_at DESC"
    )
    .all();

  const today = new Date().toISOString().split("T")[0];
  const promotions = db
    .prepare(
      `SELECT * FROM promotions
       WHERE active = 1
         AND (start_date IS NULL OR start_date = '' OR start_date <= ?)
         AND (end_date IS NULL OR end_date = '' OR end_date >= ?)
       ORDER BY created_at DESC`
    )
    .all(today, today);

  const testimonials = db
    .prepare("SELECT * FROM testimonials WHERE active = 1 ORDER BY created_at DESC")
    .all();

  const jobs = db
    .prepare("SELECT * FROM jobs WHERE active = 1 ORDER BY created_at DESC")
    .all();

  return { settings, services, gallery, promotions, testimonials, jobs };
}

export default function HomePage() {
  const { settings, services, gallery, promotions, testimonials, jobs } =
    getPublicData();

  const waMessage =
    "Olá, AG Salão de Beleza e Spa. Gostaria de saber mais informações sobre os serviços.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: settings.company_name,
    description: settings.description || settings.slogan,
    telephone: settings.phone,
    email: settings.email,
    image: settings.cover_image_url || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address || undefined,
      addressLocality: settings.city,
      addressCountry: "AO",
    },
    sameAs: [settings.facebook_url, settings.instagram_url, settings.tiktok_url].filter(
      Boolean
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header settings={settings} />
      <main>
        <Hero settings={settings} />
        <About settings={settings} />
        <Services services={services} />
        <SpaSection settings={settings} />
        <Gallery images={gallery} />
        <Promotions promotions={promotions} />
        <Testimonials testimonials={testimonials} />

        <section id="agendamento" className="bg-cream-dark/40 py-24">
          <div className="mx-auto max-w-2xl px-5">
            <div className="text-center">
              <p className="font-display text-lg italic text-rose-dark">
                Reserve o seu horário
              </p>
              <h2 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
                Agendamento
              </h2>
              <p className="mt-4 text-ink/60">
                Preencha o formulário abaixo. Entraremos em contacto para
                confirmar o seu horário.
              </p>
            </div>
            <div className="mt-10">
              <BookingForm services={services} whatsapp={settings.whatsapp} />
            </div>
          </div>
        </section>

        <Jobs jobs={jobs} settings={settings} />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
      <WhatsAppButton whatsapp={settings.whatsapp} message={waMessage} />
    </>
  );
}
