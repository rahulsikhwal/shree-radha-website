import { getProducts, getSettings } from "../../lib/data";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function ProductsPage() {
  const settings = await getSettings();
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#fffaf0]">
      <Header settings={settings} />
      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="font-black uppercase tracking-[0.25em] text-amber-700">All Products</p>
          <h1 className="mt-4 text-5xl font-black">Product Collection</h1>

          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-[1.7rem] bg-white shadow-xl ring-1 ring-yellow-100">
                <div className="grid h-[360px] place-items-center bg-gradient-to-br from-yellow-50 to-white p-5 sm:h-[390px]">
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-contain" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-black uppercase text-amber-700">{product.category}</p>
                  <h2 className="mt-2 text-2xl font-black">{product.name}</h2>
                  <p className="mt-3 text-slate-600">{product.description}</p>
                  {product.mrp && <p className="mt-3 font-black text-amber-700">MRP: Rs. {product.mrp}</p>}
                  <a href={`/products/${product.slug}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-amber-600">
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
