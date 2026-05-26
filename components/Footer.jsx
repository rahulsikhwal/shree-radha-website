import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
} from "lucide-react";

export default function Footer({ settings }) {
  const socials = [
    [settings.instagram, Instagram, "Instagram"],
    [settings.facebook, Facebook, "Facebook"],
    [settings.youtube, Youtube, "YouTube"],
    [settings.linkedin, Linkedin, "LinkedIn"],
  ].filter(([url]) => url);

  const cleanPhone = settings.phone
    ? settings.phone.replace(/\s+/g, "")
    : "";

  return (
    <footer className="bg-slate-950 px-5 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        
        {/* Company Info */}
        <div>
          <h3 className="text-2xl font-black">
            {settings.company_name}
          </h3>

          <p className="mt-4 max-w-sm text-slate-400 leading-relaxed">
            Premium orthopedic and lifestyle footwear manufacturer.
          </p>

          {socials.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              {socials.map(([url, Icon, label]) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-yellow-400 transition-all duration-300 hover:scale-110 hover:bg-yellow-400 hover:text-slate-950"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Contact Details */}
        <div>
          <h4 className="mb-4 font-black text-yellow-400">
            Contact Details
          </h4>

          <div className="space-y-4 text-slate-300">

            {/* Phone */}
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-3 transition hover:text-yellow-400"
            >
              <Phone size={18} />
              <span>{settings.phone}</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${settings.email}?subject=Product%20Enquiry`}
              className="flex items-center gap-3 break-all transition hover:text-yellow-400"
            >
              <Mail size={18} />
              <span>{settings.email}</span>
            </a>

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-1" />
              <span>{settings.address}</span>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div>
          <h4 className="mb-4 font-black text-yellow-400">
            Business Hours
          </h4>

          <p className="text-slate-300 leading-7">
            Monday - Saturday
            <br />
            10:00 AM - 7:00 PM
          </p>

          <a
            href="/admin"
            className="mt-5 inline-block text-xs text-slate-500 transition hover:text-yellow-400"
          >
            Admin Login
          </a>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-8 text-center text-sm text-slate-500">
        Copyright © 2026 {settings.company_name}. All Rights Reserved.
      </div>
    </footer>
  );
}
