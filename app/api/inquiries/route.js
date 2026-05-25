import { NextResponse } from "next/server";
import { hasSupabase, supabase } from "../../../lib/supabaseClient";

function clean(value) {
  return String(value || "").trim();
}

export async function POST(request) {
  if (!hasSupabase) {
    return NextResponse.json(
      { error: "Supabase is not configured yet." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const inquiry = {
    name: clean(body?.name),
    company: clean(body?.company),
    email: clean(body?.email),
    phone: clean(body?.phone),
    interest: clean(body?.interest) || "Bulk Order",
    message: clean(body?.message),
  };

  if (!inquiry.name || !inquiry.email || !inquiry.phone || !inquiry.message) {
    return NextResponse.json(
      { error: "Name, email, phone and message are required." },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("inquiries").insert(inquiry);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
