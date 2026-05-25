"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export default function HeroProductSlider({ products }) {
  const sliderProducts = products && products.length > 0 ? products : [];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (sliderProducts.length <= 1) return undefined;

    const timer = setInterval(() => {
      setActive((current) => (current + 1) % sliderProducts.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [sliderProducts.length]);

  if (sliderProducts.length === 0) return null;

  const product = sliderProducts[active];

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-yellow-300/80 blur-3xl" />
      <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-orange-400/70 blur-3xl" />
      <div className="absolute right-7 top-8 z-10 hidden rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-300 shadow-xl md:block">
        Premium Range
      </div>

      <div className="relative rounded-[2.4rem] border border-amber-200 bg-white/90 p-4 shadow-2xl shadow-amber-900/20 backdrop-blur">
        <div className="relative grid h-[430px] place-items-center overflow-hidden rounded-[1.8rem] bg-[radial-gradient(circle_at_center,_#fff7d6,_#ffffff_45%,_#fffbeb)] p-6 md:h-[560px]">
          {sliderProducts.map((item, index) => (
            <img
              key={item.id || item.slug}
              src={item.image_url}
              alt={item.name}
              className={`absolute inset-0 m-auto h-full w-full object-contain p-7 drop-shadow-2xl transition-all duration-700 ease-out md:p-10 ${
                index === active
                  ? "scale-100 opacity-100 blur-0"
                  : "scale-95 opacity-0 blur-sm"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-6 max-w-[82%] rounded-3xl border border-white/70 bg-white/95 p-5 shadow-xl backdrop-blur">
        <div className="flex items-center gap-1.5 text-amber-500">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={16} fill="currentColor" />
          ))}
        </div>
        <p className="mt-2 text-base font-black text-slate-950">{product.name}</p>
        <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-slate-500">{product.description}</p>
      </div>

      <div className="absolute bottom-7 right-6 flex gap-2 rounded-full bg-white/95 p-2 shadow-lg backdrop-blur">
        {sliderProducts.map((item, index) => (
          <button
            key={item.id || item.slug}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show ${item.name}`}
            className={`h-2.5 rounded-full transition-all ${index === active ? "w-8 bg-amber-500" : "w-2.5 bg-slate-300 hover:bg-amber-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
