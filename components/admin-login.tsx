"use client";

import { useState, type FormEvent } from "react";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error || "Could not sign in.");
        return;
      }

      window.location.reload();
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin">
      <div className="wrap admin-inner">
        <div className="admin-login">
          <p className="admin-eyebrow">Internal</p>
          <h1>Pulse Analytics</h1>
          <p className="admin-login-sub">Enter the admin password to view metrics.</p>
          <form onSubmit={submit} className="admin-login-form">
            <label>
              Password
              <input
                type="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            {error ? <p className="admin-error">{error}</p> : null}
            <button
              type="submit"
              className="btn btn-primary admin-login-submit"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
