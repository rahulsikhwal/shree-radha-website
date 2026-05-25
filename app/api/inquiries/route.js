import { NextResponse } from "next/server";
import { hasSupabase, supabase } from "../../../lib/supabaseClient";

function clean(value) {
  return String(value || "").trim();
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const phoneRegex = /^\d{10}$/;

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const inquiry = {
    name: clean(body.name),
    company: clean(body.company),
    email: clean(body.email).toLowerCase(),
    phone: clean(body.phone).replace(/\D/g, ""),
    interest: clean(body.interest) || "Bulk Order",
    message: clean(body.message),
  };

  if (!inquiry.name || !inquiry.email || !inquiry.phone || !inquiry.message) {
    return NextResponse.json(
      { error: "Name, email, phone and message are required." },
      { status: 400 }
    );
  }

  if (!emailRegex.test(inquiry.email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (!phoneRegex.test(inquiry.phone)) {
    return NextResponse.json(
      { error: "Phone number must be exactly 10 digits." },
      { status: 400 }
    );
  }

  if (inquiry.name.length > 120 || inquiry.company.length > 160 || inquiry.message.length > 2000) {
    return NextResponse.json(
      { error: "One or more fields are too long." },
      { status: 400 }
    );
  }

  if (!hasSupabase) {
    return NextResponse.json(
      { error: "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel." },
      { status: 503 }
    );
  }

  const { error } = await supabase.from("inquiries").insert(inquiry);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
