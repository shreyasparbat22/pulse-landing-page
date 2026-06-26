export const GA_EVENTS = {
  BOOK_DEMO_CLICK: "book_demo_click",
  DEMO_SIGNUP_COMPLETE: "demo_signup_complete",
} as const;

export type CtaLocation = "nav" | "hero" | "final";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string>,
) {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", eventName, params);
  }

  if (window.clarity) {
    window.clarity("event", eventName);
  }
}
