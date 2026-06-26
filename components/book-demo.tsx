"use client";

import {
  COUNTRIES,
  DEFAULT_COUNTRY_ISO2,
  formatCountryOption,
  getCountryByIso2,
} from "@/lib/countries";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type BookDemoContextValue = {
  open: () => void;
};

const BookDemoContext = createContext<BookDemoContextValue | null>(null);

function useBookDemo() {
  const context = useContext(BookDemoContext);
  if (!context) {
    throw new Error("BookDemo components must be used within BookDemoProvider");
  }
  return context;
}

export function BookDemoProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [countryIso, setCountryIso] = useState(DEFAULT_COUNTRY_ISO2);
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const open = useCallback(() => {
    setIsOpen(true);
    setStatus("idle");
    setError("");
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setName("");
    setCountryIso(DEFAULT_COUNTRY_ISO2);
    setWhatsapp("");
    setStatus("idle");
    setError("");
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const country = getCountryByIso2(countryIso);
    if (!country) {
      setStatus("error");
      setError("Please select a valid country.");
      return;
    }

    try {
      const response = await fetch("/api/book-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          countryIso,
          countryCode: country.dialCode,
          whatsapp: whatsapp.trim(),
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <BookDemoContext.Provider value={{ open }}>
      {children}
      {isOpen ? (
        <div className="modal-backdrop" onClick={close}>
          <div
            className="modal"
            role="dialog"
            aria-labelledby="book-demo-title"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="modal-close" onClick={close} aria-label="Close">
              ×
            </button>

            {status === "success" ? (
              <div className="modal-success">
                <h2 id="book-demo-title">You&apos;re on the list</h2>
                <p>Thanks, {name}. We&apos;ll reach out on WhatsApp shortly.</p>
                <button type="button" className="btn btn-primary" onClick={close}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 id="book-demo-title">Book a demo</h2>
                <p className="modal-sub">
                  Leave your name and WhatsApp number — we&apos;ll be in touch within 24 hours.
                </p>
                <form onSubmit={submit} className="modal-form">
                  <label>
                    Name
                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      required
                      autoComplete="name"
                    />
                  </label>
                  <label>
                    WhatsApp number
                    <div className="phone-row">
                      <select
                        name="country"
                        value={countryIso}
                        onChange={(event) => setCountryIso(event.target.value)}
                        aria-label="Country"
                      >
                        {COUNTRIES.map((country) => (
                          <option key={country.iso2} value={country.iso2}>
                            {formatCountryOption(country)}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={whatsapp}
                        onChange={(event) => setWhatsapp(event.target.value)}
                        placeholder="7700 900000"
                        required
                        autoComplete="tel-national"
                      />
                    </div>
                  </label>
                  {error ? <p className="modal-error">{error}</p> : null}
                  <button
                    type="submit"
                    className="btn btn-primary modal-submit"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Sending…" : "Submit"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </BookDemoContext.Provider>
  );
}

export function BookDemoButton({
  className,
  children = "Book a Demo",
}: {
  className?: string;
  children?: ReactNode;
}) {
  const { open } = useBookDemo();

  return (
    <button type="button" className={className} onClick={open}>
      {children}
    </button>
  );
}
