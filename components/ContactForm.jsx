"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

const initialForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  interest: "Bulk Order",
  message: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const phoneRegex = /^\d{10}$/;

function onlyDigits(value) {
  return value.replace(/\D/g, "").slice(0, 10);
}

export default function ContactForm({ settings }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const validation = useMemo(() => {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!emailRegex.test(form.email.trim())) return "Please enter a valid email address.";
    if (!phoneRegex.test(form.phone)) return "Phone number must be exactly 10 digits.";
    if (!form.message.trim() || form.message.trim().length < 10) return "Please describe your requirement in at least 10 characters.";
    return "";
  }, [form]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setStatus("idle");
    setError("");

    setForm((current) => ({
      ...current,
      [name]: name === "phone" ? onlyDigits(value) : value,
    }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setError("");

    if (validation) {
      setError(validation);
      setStatus("error");
      return;
    }

    setStatus("loading");

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        email: form.email.trim().toLowerCase(),
        name: form.name.trim(),
        company: form.company.trim(),
        message: form.message.trim(),
      }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      setError(result.error || "Unable to submit enquiry. Please try again.");
      setStatus("error");
      return;
    }

    setForm(initialForm);
    setStatus("success");
  };

  const inputClass = "w-full rounded-2xl border border-amber-200 bg-white/85 px-4 py-4 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-200/60";

  return (
    <form onSubmit={submitForm} className="grid gap-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-extrabold text-slate-700">
          Full Name *
          <input name="name" required value={form.name} onChange={updateField} placeholder="Your full name" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-extrabold text-slate-700">
          Company Name
          <input name="company" value={form.company} onChange={updateField} placeholder="Your business/company" className={inputClass} />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-extrabold text-slate-700">
          Email Address *
          <input type="email" name="email" required value={form.email} onChange={updateField} placeholder="name@example.com" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-extrabold text-slate-700">
          Phone Number *
          <input
            type="tel"
            inputMode="numeric"
            name="phone"
            required
            value={form.phone}
            onChange={updateField}
            placeholder="10 digit mobile number"
            minLength={10}
            maxLength={10}
            pattern="[0-9]{10}"
            className={inputClass}
          />
          <span className="text-xs font-semibold text-slate-500">{form.phone.length}/10 digits</span>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Enquiry Type
        <select name="interest" value={form.interest} onChange={updateField} className={inputClass}>
          <option>Bulk Order</option>
          <option>Dealership Enquiry</option>
          <option>OEM Manufacturing</option>
          <option>Export Enquiry</option>
        </select>
      </label>

      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Requirement *
        <textarea name="message" rows="5" required value={form.message} onChange={updateField} placeholder="Tell us product, quantity, city and requirement..." className={`${inputClass} resize-none`} />
      </label>

      <button disabled={status === "loading"} className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 px-8 py-4 font-black text-slate-950 shadow-xl shadow-yellow-500/25 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70">
        {status === "loading" ? <Loader2 className="animate-spin" size={20} /> : <Send size={19} />}
        {status === "loading" ? "Submitting..." : "Submit Enquiry"}
      </button>

      {status === "success" && (
        <p className="flex items-center justify-center gap-2 rounded-2xl bg-green-50 p-4 text-center font-bold text-green-700 ring-1 ring-green-200">
          <CheckCircle2 size={19} /> Thank you. Your enquiry has been received, and {settings.company_name} will contact you soon.
        </p>
      )}
      {status === "error" && (
        <p className="rounded-2xl bg-red-50 p-4 text-center font-bold text-red-700 ring-1 ring-red-200">
          {error}
        </p>
      )}
    </form>
  );
}
