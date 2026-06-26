"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const CONSENT_KEY = "pulse_analytics_consent";

type ConsentStatus = "pending" | "accepted" | "declined";

type CookieConsentContextValue = {
  consent: ConsentStatus;
  accept: () => void;
  decline: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null,
);

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      "useCookieConsent must be used within CookieConsentProvider",
    );
  }
  return context;
}

function readStoredConsent(): ConsentStatus {
  if (typeof window === "undefined") return "pending";
  const stored = localStorage.getItem(CONSENT_KEY);
  if (stored === "accepted") return "accepted";
  if (stored === "declined") return "declined";
  return "pending";
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentStatus>("pending");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConsent(readStoredConsent());
    setHydrated(true);
  }, []);

  const accept = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setConsent("accepted");
  }, []);

  const decline = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setConsent("declined");
  }, []);

  return (
    <CookieConsentContext.Provider value={{ consent, accept, decline }}>
      {children}
      {hydrated && consent === "pending" ? <CookieConsentBanner /> : null}
    </CookieConsentContext.Provider>
  );
}

function CookieConsentBanner() {
  const { accept, decline } = useCookieConsent();

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <p>
        We use analytics cookies to understand how visitors use this page and
        improve it.
      </p>
      <div className="cookie-banner-actions">
        <button type="button" className="btn btn-ghost" onClick={decline}>
          Decline
        </button>
        <button type="button" className="btn btn-primary" onClick={accept}>
          Accept
        </button>
      </div>
    </div>
  );
}
