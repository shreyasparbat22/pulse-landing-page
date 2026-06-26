import { NextResponse } from "next/server";
import { insertAnalyticsEvent, isAnalyticsEventName } from "@/lib/db";

type AnalyticsBody = {
  visitorId?: string;
  sessionId?: string;
  eventName?: string;
  properties?: Record<string, string | number>;
};

function isValidId(value: unknown): value is string {
  return typeof value === "string" && value.length >= 8 && value.length <= 64;
}

function isValidProperties(
  value: unknown,
): value is Record<string, string | number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(
    (entry) => typeof entry === "string" || typeof entry === "number",
  );
}

export async function POST(request: Request) {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    return new NextResponse(null, { status: 503 });
  }

  let body: AnalyticsBody;

  try {
    body = (await request.json()) as AnalyticsBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { visitorId, sessionId, eventName, properties } = body;

  if (!isValidId(visitorId) || !isValidId(sessionId)) {
    return NextResponse.json({ error: "Invalid visitor or session id." }, { status: 400 });
  }

  if (!eventName || !isAnalyticsEventName(eventName)) {
    return NextResponse.json({ error: "Invalid event name." }, { status: 400 });
  }

  if (properties !== undefined && !isValidProperties(properties)) {
    return NextResponse.json({ error: "Invalid properties." }, { status: 400 });
  }

  try {
    await insertAnalyticsEvent({
      visitorId,
      sessionId,
      eventName,
      properties,
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Analytics ingest error:", error);
    return NextResponse.json(
      { error: "Failed to record event." },
      { status: 500 },
    );
  }
}
