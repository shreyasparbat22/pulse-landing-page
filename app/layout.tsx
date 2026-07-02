import type { Metadata } from "next";
import { BookDemoProvider } from "@/components/book-demo";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sam | The AI Operating Layer for Independent Fitness Studios",
  description:
    "Sam is an always-on AI that retains every member, fills every class, and gives studio owners their week back. WhatsApp-first, built for independent boutique studios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body>
        <BookDemoProvider>{children}</BookDemoProvider>
      </body>
    </html>
  );
}
