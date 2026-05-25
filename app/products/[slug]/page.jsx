import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getSettings } from "../../../lib/data";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { CheckCircle2, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);

  return {
    title: product ? `${product.name} | Shree Radha Enterprises` : "Product",
    description: product?.description || "Product detail page",
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }) {
  const settings = await getSettings();
  const product = await getProductBySlug(params.slug);

  if (!product) notFound();

  const whatsappMessage = encodeURIComponent(
    `Hello, I want enquiry for ${product.name}. Please share details.`
  );

  return (
    <main className="min-h-screen bg-[#fff8ea]">
      <Header settings={settings} />

      <section className="relative overflow-hidden px-5 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.35),_transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          <div className="rounded-[2.2rem] bg-white p-5 shadow-2xl shadow-amber-900/10 ring-1 ring-yellow-100">
            <div className="grid min-h-[460px] place-items-center rounded-[1.7rem] bg-[radial-gradient(circle_at_center,_#fff7d6,_#fff_55%,_#fffbeb)] p-7 md:min-h-[620px]">
              <img src={product.image_url} alt={product.name} className="h-full max-h-[580px] w-full object-contain drop-shadow-2xl" />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="font-black uppercase tracking-[0.25em] text-amber-700">{product.category}</p>
            <h1 className="mt-4 text-5xl font-black leading-tight text-slate-950 md:text-6xl">{product.name}</h1>
            <p className="mt-5 text-xl leading-8 text-slate-600">{product.description}</p>

            {product.mrp && <div className="mt-6 inline-flex w-fit rounded-2xl bg-yellow-400 px-5 py-3 text-xl font-black text-slate-950">MRP: Rs. {product.mrp}</div>}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {(product.features || []).map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-yellow-100">
                  <CheckCircle2 className="text-amber-600" />
                  <span className="font-bold text-slate-800">{feature}</span>
                </div>
              ))}
            </div>

            <a href={`https://wa.me/${settings.whatsapp}?text=${whatsappMessage}`} className="mt-9 inline-flex w-fit items-center gap-2 rounded-full bg-green-600 px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-green-700">
              <MessageCircle size={20} />
              Enquire on WhatsApp
            </a>
          </div>
        </div>

        <div className="relative mx-auto mt-12 max-w-7xl rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-yellow-100">
          <h2 className="text-3xl font-black text-slate-950">Product Details</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">{product.detail}</p>
        </div>
      </section>

      <Footer settings={settings} />
    </main>
  );
}
