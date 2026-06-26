import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getCountryByIso2 } from "@/lib/countries";

const SIGNUP_EMAILS = [
  "shreyasparbat1998@gmail.com",
  "alexandratan329@gmail.com",
] as const;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service is not configured yet." },
      { status: 503 },
    );
  }

  let body: { name?: string; countryIso?: string; countryCode?: string; whatsapp?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const countryIso = String(body.countryIso ?? "").trim().toUpperCase();
  const countryCode = String(body.countryCode ?? "").trim();
  const whatsapp = String(body.whatsapp ?? "").trim();

  if (name.length < 2) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }

  if (!/^[A-Z]{2}$/.test(countryIso)) {
    return NextResponse.json({ error: "Please select a valid country." }, { status: 400 });
  }

  if (!/^\+\d{1,4}$/.test(countryCode)) {
    return NextResponse.json({ error: "Please select a valid country code." }, { status: 400 });
  }

  if (whatsapp.length < 6 || !/^[\d\s()-]+$/.test(whatsapp)) {
    return NextResponse.json(
      { error: "Please enter a valid WhatsApp number." },
      { status: 400 },
    );
  }

  const fullWhatsapp = `${countryCode} ${whatsapp}`;
  const countryName = getCountryByIso2(countryIso)?.name ?? countryIso;

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "Pulse <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: [...SIGNUP_EMAILS],
    subject: `New Pulse demo signup: ${name}`,
    html: `
      <h2>New demo signup</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Country:</strong> ${escapeHtml(countryName)} (${escapeHtml(countryIso)})</p>
      <p><strong>Country code:</strong> ${escapeHtml(countryCode)}</p>
      <p><strong>WhatsApp:</strong> ${escapeHtml(fullWhatsapp)}</p>
      <p><em>Submitted from the Pulse landing page.</em></p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Could not send your request. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
