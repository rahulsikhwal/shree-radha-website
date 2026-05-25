import { getProducts, getSettings, getStats } from "../lib/data";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroProductSlider from "../components/HeroProductSlider";
import StatsCounter from "../components/StatsCounter";
import ContactForm from "../components/ContactForm";
import { ArrowRight, Award, CheckCircle2, Factory, ShieldCheck, Sparkles, Truck } from "lucide-react";

function WhatsAppIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16.02 3.2A12.72 12.72 0 0 0 5.1 22.43L3.7 28.8l6.52-1.7A12.7 12.7 0 1 0 16.02 3.2Zm0 22.98c-2.05 0-4.03-.6-5.74-1.73l-.41-.27-3.86 1.01 1.03-3.76-.28-.43A10.23 10.23 0 1 1 16.02 26.18Zm5.62-7.65c-.31-.16-1.82-.9-2.1-1-.28-.1-.49-.16-.7.16-.2.3-.8 1-.98 1.2-.18.2-.36.23-.67.08-.31-.16-1.3-.48-2.47-1.53-.91-.81-1.53-1.82-1.71-2.13-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.54.16-.18.2-.31.31-.52.1-.2.05-.39-.03-.54-.08-.16-.7-1.68-.95-2.3-.25-.6-.5-.52-.7-.53h-.6c-.2 0-.54.08-.82.39-.28.31-1.08 1.05-1.08 2.56 0 1.5 1.1 2.96 1.25 3.16.16.2 2.16 3.3 5.24 4.63.73.31 1.3.5 1.75.64.73.23 1.4.2 1.92.12.59-.09 1.82-.74 2.08-1.46.26-.72.26-1.33.18-1.46-.08-.13-.28-.21-.59-.36Z" />
    </svg>
  );
}

function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white text-slate-950 shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-2">
      <div className="relative grid h-[390px] place-items-center overflow-hidden bg-[radial-gradient(circle_at_center,_#fff7d6,_#fff_50%,_#fffbeb)] p-7 sm:h-[420px]">
        <div className="absolute left-5 top-5 z-10 rounded-full bg-yellow-400 px-4 py-2 text-xs font-black uppercase text-slate-950 shadow-md">
          {product.category}
        </div>
        <img src={product.image_url} alt={product.name} className="h-full w-full object-contain drop-shadow-2xl transition duration-500 group-hover:scale-[1.035]" />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-black">{product.name}</h3>
        <p className="mt-3 min-h-[72px] text-slate-600">{product.description}</p>
        {product.mrp && <p className="mt-3 text-lg font-black text-amber-700">MRP: Rs. {product.mrp}</p>}
        <div className="mt-5 flex flex-wrap gap-2">
          {(product.features || []).slice(0, 4).map((feature) => (
            <span key={feature} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-800 ring-1 ring-amber-100">{feature}</span>
          ))}
        </div>
        <a href={`/products/${product.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-amber-600">
          View Details <ArrowRight size={16} />
        </a>
      </div>
    </article>
  );
}

export const revalidate = 0;

export default async function Home() {
  const settings = await getSettings();
  const products = await getProducts();
  const stats = await getStats();

  return (
    <main className="min-h-screen bg-[#fff8ea] text-slate-950">
      <Header settings={settings} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.42),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(234,88,12,0.25),_transparent_38%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fff8ea] to-transparent" />
        <div className="relative mx-auto grid min-h-[88vh] max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-300 bg-white/85 px-4 py-2 text-sm font-black text-amber-800 shadow-sm backdrop-blur">
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
              <a href="#catalog" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 px-7 py-4 font-black text-slate-950 shadow-xl shadow-yellow-500/25 transition hover:-translate-y-1">
                View Products <ArrowRight size={18} />
              </a>
              <a href="#contact" className="rounded-full border-2 border-slate-950 bg-white/85 px-7 py-4 font-black text-slate-950 backdrop-blur transition hover:bg-slate-950 hover:text-white">
                Business Enquiry
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm font-extrabold text-slate-700">
              {["Clear product photos", "Bulk supply", "Dealer friendly"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 ring-1 ring-amber-100"><CheckCircle2 size={16} className="text-amber-600" />{item}</span>
              ))}
            </div>
          </div>

          <HeroProductSlider products={products} />
        </div>
      </section>

      <StatsCounter stats={stats} />

      <section id="about" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="font-black uppercase tracking-[0.25em] text-amber-700">{settings.about_eyebrow}</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">{settings.about_title}</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">{settings.about_body}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {(settings.about_benefits || []).map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-yellow-100">
                  <CheckCircle2 className="mt-1 shrink-0 text-amber-600" />
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
              <div key={title} className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl shadow-slate-900/10 ring-1 ring-white/10">
                <Icon className="mb-4 text-yellow-400" size={38} />
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-2 text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="relative overflow-hidden bg-slate-950 py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.18),_transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-5">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="font-black uppercase tracking-[0.25em] text-yellow-400">{settings.catalog_eyebrow}</p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">{settings.catalog_title}</h2>
            <p className="mt-4 text-slate-300">{settings.catalog_subtitle}</p>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden px-5 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(250,204,21,0.38),_transparent_32%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl">
            <Award className="mb-5 text-yellow-400" size={42} />
            <p className="font-black uppercase tracking-[0.25em] text-yellow-400">{settings.contact_eyebrow}</p>
            <h2 className="mt-3 text-4xl font-black md:text-5xl">{settings.contact_title}</h2>
            <p className="mt-4 leading-7 text-slate-300">{settings.contact_subtitle}</p>
            <div className="mt-8 grid gap-3 text-sm font-bold text-slate-200">
              <p>• 10-digit phone validation</p>
              <p>• Email format validation</p>
              <p>• Secure API-side checks before Supabase insert</p>
            </div>
          </div>
          <div className="rounded-[2rem] bg-white/95 p-6 shadow-2xl shadow-amber-900/10 ring-1 ring-yellow-100 backdrop-blur md:p-8">
            <ContactForm settings={settings} />
          </div>
        </div>
      </section>

      <Footer settings={settings} />

      <a href={`https://wa.me/${settings.whatsapp}`} aria-label="Chat on WhatsApp" className="fixed bottom-5 right-5 z-50 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl ring-4 ring-white/80 transition hover:scale-105 hover:bg-[#1ebe5d]">
        <WhatsAppIcon size={30} />
      </a>
    </main>
  );
}
