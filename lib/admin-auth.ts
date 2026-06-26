import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "pulse_admin_auth";
const SESSION_SALT = "pulse-admin-v1";

export function isAdminPasswordConfigured(): boolean {
  return Boolean(process.env.ANALYTICS_PASSWORD);
}

export function getAdminSessionToken(): string {
  const password = process.env.ANALYTICS_PASSWORD;
  if (!password) {
    throw new Error("ANALYTICS_PASSWORD is not configured.");
  }

  return createHmac("sha256", password).update(SESSION_SALT).digest("hex");
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ANALYTICS_PASSWORD;
  if (!expected) return false;

  const provided = Buffer.from(password);
  const target = Buffer.from(expected);

  if (provided.length !== target.length) return false;

  return timingSafeEqual(provided, target);
}

export function verifyAdminSession(cookieValue: string | undefined): boolean {
  if (!cookieValue || !isAdminPasswordConfigured()) return false;

  try {
    const expected = getAdminSessionToken();
    const provided = Buffer.from(cookieValue);
    const target = Buffer.from(expected);

    if (provided.length !== target.length) return false;

    return timingSafeEqual(provided, target);
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
