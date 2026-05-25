"use client";

import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  const numericValue = Number(String(value || "0").replace(/[^0-9]/g, "")) || 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
        }
      },
      { threshold: 0.35 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let frame;
    let startTime;
    const duration = 1600;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplay(Math.floor(eased * numericValue));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [started, numericValue]);

  return (
    <span ref={ref}>
      {display}
      {String(value || "").includes("+") ? "+" : ""}
      {String(value || "").includes("%") ? "%" : ""}
    </span>
  );
}

export default function StatsCounter({ stats }) {
  const cleanStats =
    stats && stats.length > 0
      ? stats
      : [
          { value: "5000+", label: "Daily Pair Capacity" },
          { value: "15+", label: "Years Experience" },
          { value: "200+", label: "Dealer Network" },
          { value: "100%", label: "Quality Checked" },
        ];

  return (
    <section className="border-y border-yellow-200 bg-white py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 md:grid-cols-4">
        {cleanStats.map((stat, index) => (
          <div
            key={`${stat.label}-${index}`}
            className="rounded-3xl bg-gradient-to-br from-yellow-50 to-white p-5 text-center shadow-sm ring-1 ring-yellow-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/10"
          >
            <p className="text-3xl font-black text-amber-700 md:text-4xl">
              <AnimatedNumber value={stat.value} />
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
