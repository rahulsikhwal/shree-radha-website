"use client";

import { useState } from "react";

const initialForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  interest: "Bulk Order",
  message: "",
};

export default function ContactForm({ settings }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
    <form onSubmit={submitForm} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <input name="name" required value={form.name} onChange={updateField} placeholder="Full Name" className="rounded-2xl border border-yellow-200 bg-yellow-50/40 p-4 outline-none focus:border-amber-500" />
        <input name="company" value={form.company} onChange={updateField} placeholder="Company Name" className="rounded-2xl border border-yellow-200 bg-yellow-50/40 p-4 outline-none focus:border-amber-500" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <input type="email" name="email" required value={form.email} onChange={updateField} placeholder="Email Address" className="rounded-2xl border border-yellow-200 bg-yellow-50/40 p-4 outline-none focus:border-amber-500" />
        <input type="tel" name="phone" required value={form.phone} onChange={updateField} placeholder="Phone Number" className="rounded-2xl border border-yellow-200 bg-yellow-50/40 p-4 outline-none focus:border-amber-500" />
      </div>
      <select name="interest" value={form.interest} onChange={updateField} className="rounded-2xl border border-yellow-200 bg-yellow-50/40 p-4 outline-none focus:border-amber-500">
        <option>Bulk Order</option>
        <option>Dealership Enquiry</option>
        <option>OEM Manufacturing</option>
        <option>Export Enquiry</option>
      </select>
      <textarea name="message" rows="5" required value={form.message} onChange={updateField} placeholder="Your Requirement" className="rounded-2xl border border-yellow-200 bg-yellow-50/40 p-4 outline-none focus:border-amber-500" />
      <button disabled={status === "loading"} className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-4 font-black text-slate-950 shadow-xl shadow-yellow-500/20 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">
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
