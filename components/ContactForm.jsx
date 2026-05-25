"use client";

import { useMemo, useState } from "react";

const initialForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  interest: "Bulk Order",
  message: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function ContactForm({ settings }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const phoneDigits = useMemo(() => form.phone.replace(/\D/g, ""), [form.phone]);

  const updateField = (event) => {
    const { name, value } = event.target;
    if (name === "phone") {
      setForm((current) => ({ ...current, phone: value.replace(/\D/g, "").slice(0, 10) }));
      return;
    }
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validateClient = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return "Name, email and requirement are required.";
    }
    if (!emailRegex.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }
    if (phoneDigits.length !== 10) {
      return "Phone number must be exactly 10 digits.";
    }
    return "";
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const clientError = validateClient();
    if (clientError) {
      setError(clientError);
      setStatus("error");
      return;
    }

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, phone: phoneDigits }),
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

  return (
    <form onSubmit={submitForm} className="grid gap-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <input name="name" required value={form.name} onChange={updateField} placeholder="Full Name" autoComplete="name" className="rounded-2xl border border-yellow-200 bg-yellow-50/40 p-4 outline-none focus:border-amber-500" />
        <input name="company" value={form.company} onChange={updateField} placeholder="Company Name" autoComplete="organization" className="rounded-2xl border border-yellow-200 bg-yellow-50/40 p-4 outline-none focus:border-amber-500" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <input type="email" name="email" required value={form.email} onChange={updateField} placeholder="Email Address" autoComplete="email" inputMode="email" className="rounded-2xl border border-yellow-200 bg-yellow-50/40 p-4 outline-none focus:border-amber-500" />
        <input type="tel" name="phone" required value={form.phone} onChange={updateField} placeholder="10 Digit Phone Number" autoComplete="tel" inputMode="numeric" pattern="[0-9]{10}" minLength={10} maxLength={10} className="rounded-2xl border border-yellow-200 bg-yellow-50/40 p-4 outline-none focus:border-amber-500" />
      </div>
      <p className="-mt-3 text-sm font-semibold text-slate-500">Phone must contain exactly 10 digits.</p>
      <select name="interest" value={form.interest} onChange={updateField} className="rounded-2xl border border-yellow-200 bg-yellow-50/40 p-4 outline-none focus:border-amber-500">
        <option>Bulk Order</option>
        <option>Dealership Enquiry</option>
        <option>OEM Manufacturing</option>
        <option>Export Enquiry</option>
      </select>
      <textarea name="message" rows="5" required value={form.message} onChange={updateField} placeholder="Your Requirement" className="rounded-2xl border border-yellow-200 bg-yellow-50/40 p-4 outline-none focus:border-amber-500" />
      <button disabled={status === "loading"} className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-4 font-black text-slate-950 shadow-xl shadow-yellow-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">
        {status === "loading" ? "Submitting..." : "Submit Enquiry"}
      </button>
      {status === "success" && (
        <p className="rounded-2xl bg-green-50 p-4 text-center font-bold text-green-700">
          Thank you. Your enquiry has been received, and {settings.company_name} will contact you soon.
        </p>
      )}
      {status === "error" && (
        <p className="rounded-2xl bg-red-50 p-4 text-center font-bold text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}
