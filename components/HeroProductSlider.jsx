"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export default function HeroProductSlider({ products }) {
  const sliderProducts = products && products.length > 0 ? products : [];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (sliderProducts.length <= 1) return;

    const timer = setInterval(() => {
      setActive((current) => (current + 1) % sliderProducts.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [sliderProducts.length]);

  if (sliderProducts.length === 0) {
    return null;
  }

  const product = sliderProducts[active];

  return (
    <div className="relative">
      <div className="absolute -left-5 -top-5 h-28 w-28 rounded-full bg-yellow-300 blur-2xl" />
      <div className="absolute -bottom-6 -right-6 h-36 w-36 rounded-full bg-amber-500 blur-3xl" />

      <div className="relative rounded-[2rem] border border-yellow-200 bg-white p-4 shadow-2xl shadow-amber-900/15">
        <div className="relative grid h-[430px] place-items-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-yellow-50 via-white to-amber-50 p-4 md:h-[560px]">
          {sliderProducts.map((item, index) => (
            <img
              key={item.id || item.slug}
              src={item.image_url}
              alt={item.name}
              className={`absolute inset-0 m-auto max-h-full max-w-full object-contain p-3 transition-all duration-700 ease-out ${
                index === active
                  ? "scale-100 opacity-100 blur-0"
                  : "scale-95 opacity-0 blur-sm"
              }`}
            />
          ))}

          <div className="absolute left-5 top-5 rounded-full bg-yellow-400 px-4 py-2 text-xs font-black uppercase text-slate-950 shadow-lg">
            {product.category}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 max-w-[82%] rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur">
        <div className="flex items-center gap-2 text-amber-500">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={17} fill="currentColor" />
          ))}
        </div>
        <p className="mt-1 text-sm font-black text-slate-950">
          {product.name}
        </p>
        <p className="mt-1 line-clamp-2 text-xs font-semibold text-slate-500">
          {product.description}
        </p>
      </div>

      <div className="absolute bottom-6 right-6 flex gap-2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur">
        {sliderProducts.map((item, index) => (
          <button
            key={item.id || item.slug}
            onClick={() => setActive(index)}
            aria-label={`Show ${item.name}`}
            className={`h-2.5 rounded-full transition-all ${
              index === active
                ? "w-8 bg-amber-500"
                : "w-2.5 bg-slate-300 hover:bg-amber-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
