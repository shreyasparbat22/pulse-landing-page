import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulse | The AI Operating Layer for Independent Fitness Studios",
  description:
    "An always-on agent that retains every member, fills every class, and gives studio owners their week back. WhatsApp-first, built for independent boutique studios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
