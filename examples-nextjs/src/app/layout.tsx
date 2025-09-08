import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auto TestId Next.js Demo",
  description: "Demonstration of automatic test ID injection in Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
