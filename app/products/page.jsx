import { getProducts, getSettings } from "../../lib/data";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function ProductsPage() {
  const settings = await getSettings();
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#fff8ea]">
      <Header settings={settings} />
      <section className="relative overflow-hidden px-5 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.35),_transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="font-black uppercase tracking-[0.25em] text-amber-700">All Products</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight text-slate-950 md:text-6xl">Product Collection</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Explore clear, complete product images with comfort-first details for wholesale, dealership and retail enquiries.</p>

          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="group overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-yellow-100 transition hover:-translate-y-2 hover:shadow-2xl">
                <div className="relative grid h-[390px] place-items-center bg-[radial-gradient(circle_at_center,_#fff7d6,_#fff_55%,_#fffbeb)] p-7 sm:h-[420px]">
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-contain drop-shadow-2xl transition group-hover:scale-[1.035]" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">{product.category}</p>
                  <h2 className="mt-2 text-2xl font-black text-slate-950">{product.name}</h2>
                  <p className="mt-3 min-h-[72px] text-slate-600">{product.description}</p>
                  {product.mrp && <p className="mt-3 font-black text-amber-700">MRP: Rs. {product.mrp}</p>}
                  <a href={`/products/${product.slug}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-amber-600">
                    View Details <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer settings={settings} />
    </main>
  );
}
