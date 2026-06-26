import type { AnalyticsEventName } from "@/lib/db";

const VISITOR_KEY = "pulse_vid";
const SESSION_KEY = "pulse_sid";

export type CtaLocation = "nav" | "hero" | "final";

export type AnalyticsProperties = Record<string, string | number>;

function createId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";

  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = createId();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = createId();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

type TrackPayload = {
  visitorId: string;
  sessionId: string;
  eventName: AnalyticsEventName;
  properties?: AnalyticsProperties;
};

function sendPayload(payload: TrackPayload, useBeacon = false) {
  const body = JSON.stringify(payload);

  if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/analytics", blob);
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: useBeacon,
  });
}

export function trackEvent(
  eventName: AnalyticsEventName,
  properties?: AnalyticsProperties,
  options?: { useBeacon?: boolean },
) {
  if (typeof window === "undefined") return;

  sendPayload(
    {
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      eventName,
      properties,
    },
    options?.useBeacon,
  );
}
