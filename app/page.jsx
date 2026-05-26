import { getProducts, getSettings, getStats } from "../lib/data";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroProductSlider from "../components/HeroProductSlider";
import StatsCounter from "../components/StatsCounter";
import ContactForm from "../components/ContactForm";
import {
  CheckCircle2,
  Factory,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const DEFAULT_THEME = "#f59e0b";
function themeColor(settings) {
  return /^#[0-9A-F]{6}$/i.test(settings?.theme_color || "") ? settings.theme_color : DEFAULT_THEME;
}

function WhatsAppIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16.02 3.2A12.72 12.72 0 0 0 5.1 22.43L3.7 28.8l6.52-1.7A12.7 12.7 0 1 0 16.02 3.2Zm0 22.98c-2.05 0-4.03-.6-5.74-1.73l-.41-.27-3.86 1.01 1.03-3.76-.28-.43A10.23 10.23 0 1 1 16.02 26.18Zm5.62-7.65c-.31-.16-1.82-.9-2.1-1-.28-.1-.49-.16-.7.16-.2.3-.8 1-.98 1.2-.18.2-.36.23-.67.08-.31-.16-1.3-.48-2.47-1.53-.91-.81-1.53-1.82-1.71-2.13-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.54.16-.18.2-.31.31-.52.1-.2.05-.39-.03-.54-.08-.16-.7-1.68-.95-2.3-.25-.6-.5-.52-.7-.53h-.6c-.2 0-.54.08-.82.39-.28.31-1.08 1.05-1.08 2.56 0 1.5 1.1 2.96 1.25 3.16.16.2 2.16 3.3 5.24 4.63.73.31 1.3.5 1.75.64.73.23 1.4.2 1.92.12.59-.09 1.82-.74 2.08-1.46.26-.72.26-1.33.18-1.46-.08-.13-.28-.21-.59-.36Z"/>
    </svg>
  );
}

export const revalidate = 0;

export default async function Home() {
  const settings = await getSettings();
  const products = await getProducts();
  const stats = await getStats();

  const mainTheme = themeColor(settings);

  return (
    <main className="min-h-screen bg-[#fffaf0] text-slate-950" style={{ "--site-theme": mainTheme }}>
      <Header settings={settings} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(180,83,9,0.22),_transparent_35%)]" />
        <div className="relative mx-auto grid min-h-[88vh] max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-bold shadow-sm" style={{ borderColor: mainTheme, color: mainTheme }}>
              <Sparkles size={17} />
              {settings.hero_badge}
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.02] tracking-tight text-slate-950 md:text-7xl">
              {settings.tagline}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 md:text-xl">
              {settings.hero_subtitle}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 rounded-full px-7 py-4 font-black text-white shadow-xl hover:scale-[1.02]" style={{ backgroundColor: mainTheme }}
              >
                View Products <ArrowRight size={18} />
              </a>
              <a
                href="#contact"
                className="rounded-full border-2 border-slate-950 bg-white px-7 py-4 font-black text-slate-950 hover:bg-slate-950 hover:text-white"
              >
                Business Enquiry
              </a>
            </div>
          </div>

          <HeroProductSlider products={products} />
        </div>
      </section>

      <StatsCounter stats={stats} />

      <section id="about" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="font-black uppercase tracking-[0.25em]" style={{ color: mainTheme }}>{settings.about_eyebrow}</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              {settings.about_title}
            </h2>
            <div className="mt-5 text-lg leading-8 text-slate-600" dangerouslySetInnerHTML={{ __html: settings.about_body || "" }} />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {(settings.about_benefits || []).map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-yellow-100">
                  <CheckCircle2 className="mt-1 shrink-0" style={{ color: mainTheme }} />
                  <p className="font-bold text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            {[
              [Factory, settings.feature1_title, settings.feature1_text],
              [ShieldCheck, settings.feature2_title, settings.feature2_text],
              [Truck, settings.feature3_title, settings.feature3_text],
            ].map(([Icon, title, desc]) => (
              <div key={title} className="rounded-3xl bg-slate-950 p-7 text-white shadow-xl shadow-slate-900/10">
                <Icon className="mb-4" size={36} style={{ color: mainTheme }} />
                <h3 className="text-2xl font-black">{title}</h3>
                <div className="mt-2 text-slate-300" dangerouslySetInnerHTML={{ __html: desc || "" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="font-black uppercase tracking-[0.25em]" style={{ color: mainTheme }}>{settings.catalog_eyebrow}</p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">{settings.catalog_title}</h2>
            <p className="mt-4 text-slate-300">{settings.catalog_subtitle}</p>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="group overflow-hidden rounded-[1.7rem] bg-white text-slate-950 shadow-2xl shadow-black/20">
                <div className="relative grid h-[360px] place-items-center overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-amber-50 p-5 sm:h-[390px]">
                  <div className="absolute left-4 top-4 z-10 rounded-full px-4 py-2 text-xs font-black uppercase text-white shadow-md" style={{ backgroundColor: mainTheme }}>
                    {product.category}
                  </div>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-black">{product.name}</h3>
                  <div className="mt-3 min-h-[72px] text-slate-600" dangerouslySetInnerHTML={{ __html: product.description || "" }} />
                  {product.mrp && <p className="mt-3 text-lg font-black" style={{ color: mainTheme }}>MRP: Rs. {product.mrp}</p>}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {(product.features || []).map((feature) => (
                      <span key={feature} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{feature}</span>
                    ))}
                  </div>
                  <a href={`/products/${product.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black text-white" style={{ backgroundColor: mainTheme }}>
                    View Details <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden px-5 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(250,204,21,0.38),_transparent_32%)]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-[2rem] bg-white p-6 shadow-2xl shadow-amber-900/10 ring-1 ring-yellow-100 md:p-12">
            <div className="mb-10 text-center">
              <p className="font-black uppercase tracking-[0.25em]" style={{ color: mainTheme }}>{settings.contact_eyebrow}</p>
              <h2 className="mt-3 text-4xl font-black md:text-5xl">{settings.contact_title}</h2>
              <p className="mt-4 text-slate-600">{settings.contact_subtitle}</p>
            </div>
            <ContactForm settings={settings} />
          </div>
        </div>
      </section>

      <Footer settings={settings} />

      <a href={`https://wa.me/${settings.whatsapp}`} aria-label="Chat on WhatsApp" className="fixed bottom-5 right-5 z-50 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl ring-4 ring-white/80 transition hover:scale-105 hover:bg-[#1ebe5d]"
      >
        <WhatsAppIcon size={30} />
      </a>
    </main>
  );
}
