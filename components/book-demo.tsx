"use client";

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
  const [studioName, setStudioName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const open = useCallback(() => {
    setIsOpen(true);
    setStatus("idle");
    setError("");
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setStudioName("");
    setEmail("");
    setStatus("idle");
    setError("");
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/book-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studioName: studioName.trim(),
          email: email.trim(),
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
                <p>Thanks, {studioName}. We&apos;ll be in touch within 24 hours.</p>
                <button type="button" className="btn btn-primary" onClick={close}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 id="book-demo-title">Book a demo</h2>
                <p className="modal-sub">
                  Leave your studio name and email — we&apos;ll be in touch within 24 hours.
                </p>
                <form onSubmit={submit} className="modal-form">
                  <label>
                    Studio name
                    <input
                      type="text"
                      name="studioName"
                      value={studioName}
                      onChange={(event) => setStudioName(event.target.value)}
                      placeholder="Your studio name"
                      required
                      autoComplete="organization"
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@yourstudio.com"
                      required
                      autoComplete="email"
                    />
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
