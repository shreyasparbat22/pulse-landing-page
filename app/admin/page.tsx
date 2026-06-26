import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminDashboard } from "@/app/admin/dashboard";
import { AdminLogin } from "@/components/admin-login";
import {
  ADMIN_COOKIE_NAME,
  isAdminPasswordConfigured,
  verifyAdminSession,
} from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Pulse Analytics",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!isAdminPasswordConfigured()) {
    return (
      <div className="admin">
        <div className="wrap admin-inner">
          <div className="admin-error">
            Admin access is not configured. Set ANALYTICS_PASSWORD in your environment.
          </div>
        </div>
      </div>
    );
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!verifyAdminSession(session)) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
