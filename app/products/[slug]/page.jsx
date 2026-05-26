import { notFound } from "next/navigation";
import { getProductBySlug, getSettings } from "../../../lib/data";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { CheckCircle2, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  return {
    title: product ? `${product.name} | Shree Radha Enterprises` : "Product",
    description: product?.description || "Product detail page",
  };
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const settings = await getSettings();
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const whatsappMessage = encodeURIComponent(
    `Hello, I want enquiry for ${product.name}. Please share details.`
  );

  return (
    <main className="min-h-screen bg-[#fffaf0]">
      <Header settings={settings} />

      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-5 shadow-2xl ring-1 ring-yellow-100">
            <div className="grid min-h-[420px] place-items-center rounded-[1.5rem] bg-gradient-to-br from-yellow-50 via-white to-amber-50 p-5">
              <img
                src={product.image_url}
                alt={product.name}
                className="max-h-[560px] w-full object-contain p-4"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="font-black uppercase tracking-[0.25em] text-amber-700">
              {product.category}
            </p>

            <h1 className="mt-4 text-5xl font-black leading-tight text-slate-950">
              {product.name}
            </h1>

            <div className="mt-5 text-xl leading-8 text-slate-600" dangerouslySetInnerHTML={{ __html: product.description || "" }} />

            {product.mrp && (
              <div className="mt-6 inline-flex w-fit rounded-2xl bg-yellow-400 px-5 py-3 text-xl font-black text-slate-950">
                MRP: Rs. {product.mrp}
              </div>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {(product.features || []).map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-yellow-100"
                >
                  <CheckCircle2 className="text-amber-600" />
                  <span className="font-bold">{feature}</span>
                </div>
              ))}
            </div>

            <a
              href={`https://wa.me/${settings.whatsapp}?text=${whatsappMessage}`}
              className="mt-9 inline-flex w-fit items-center gap-2 rounded-full bg-green-600 px-7 py-4 font-black text-white shadow-xl hover:bg-green-700"
            >
              <MessageCircle size={20} />
              Enquire on WhatsApp
            </a>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-yellow-100">
          <h2 className="text-3xl font-black">Product Details</h2>
          <div className="mt-5 text-lg leading-8 text-slate-600" dangerouslySetInnerHTML={{ __html: product.detail || "" }} />
        </div>

        {product.gallery_images?.length > 0 && (
          <div className="mx-auto mt-12 max-w-7xl rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-yellow-100">
            <h2 className="text-3xl font-black">Product Gallery</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              {product.gallery_images.map((img, idx) => (
                <img key={idx} src={img} alt={`${product.name} gallery ${idx + 1}`} className="h-52 w-full rounded-2xl object-cover" />
              ))}
            </div>
          </div>
        )}

        {product.detail_sections?.map((section, idx) => (
          <section key={idx} className="mx-auto mt-12 max-w-7xl rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-yellow-100">
            <h2 className="text-3xl font-black">{section.title}</h2>
            <div className="mt-5 text-lg leading-8 text-slate-600" dangerouslySetInnerHTML={{ __html: section.content || '' }} />
            {section.images?.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                {section.images.map((img, i) => (
                  <img key={i} src={img} alt={`${section.title} ${i + 1}`} className="h-48 w-full rounded-2xl object-cover" />
                ))}
              </div>
            )}
          </section>
        ))}
      </section>

      <Footer settings={settings} />
    </main>
  );
}