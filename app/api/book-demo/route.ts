import { NextResponse } from "next/server";
import { saveDemoSignup } from "@/lib/db";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    return NextResponse.json(
      { error: "Signups are not configured yet." },
      { status: 503 },
    );
  }

  let body: { studioName?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const studioName = String(body.studioName ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();

  if (studioName.length < 2) {
    return NextResponse.json({ error: "Please enter your studio name." }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    await saveDemoSignup({ studioName, email });
  } catch (error) {
    console.error("Turso error:", error);
    return NextResponse.json(
      { error: "Could not save your request. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
