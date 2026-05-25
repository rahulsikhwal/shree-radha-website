import { NextResponse } from "next/server";
import { hasSupabase, supabase } from "../../../lib/supabaseClient";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const phoneRegex = /^\d{10}$/;
const allowedInterests = new Set([
  "Bulk Order",
  "Dealership Enquiry",
  "OEM Manufacturing",
  "Export Enquiry",
]);

function clean(value, maxLength = 500) {
  return String(value || "").trim().slice(0, maxLength);
}

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

export async function POST(request) {
  if (!hasSupabase) {
    return NextResponse.json(
      { error: "Supabase is not configured yet." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const inquiry = {
    name: clean(body.name, 120),
    company: clean(body.company, 160),
    email: clean(body.email, 180).toLowerCase(),
    phone: digitsOnly(body.phone),
    interest: clean(body.interest, 80) || "Bulk Order",
    message: clean(body.message, 1200),
  };

  if (!inquiry.name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  if (!emailRegex.test(inquiry.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!phoneRegex.test(inquiry.phone)) {
    return NextResponse.json({ error: "Phone number must be exactly 10 digits." }, { status: 400 });
  }

  if (!allowedInterests.has(inquiry.interest)) {
    return NextResponse.json({ error: "Invalid enquiry type." }, { status: 400 });
  }

  if (inquiry.message.length < 10) {
    return NextResponse.json({ error: "Requirement must be at least 10 characters." }, { status: 400 });
  }

  const { error } = await supabase.from("inquiries").insert(inquiry);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
