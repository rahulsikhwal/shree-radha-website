export default function Header({ settings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-yellow-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <a href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 text-lg font-black text-slate-950 shadow-lg shadow-yellow-500/20">
            SR
          </div>
          <div>
            <p className="text-base font-black leading-none md:text-lg">
              {settings.company_name}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              Footwear Manufacturer
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-bold text-slate-700 md:flex">
          <a href="/#about" className="hover:text-amber-700">About</a>
          <a href="/#catalog" className="hover:text-amber-700">Products</a>
          <a href="/#contact" className="hover:text-amber-700">Contact</a>
        </nav>

        <a
          href={`https://wa.me/${settings.whatsapp}`}
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 hover:bg-amber-600"
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}
