import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "data-testid Guidelines Example",
  description:
    "Next.js app demonstrating the data-testid-guidelines-babel-plugin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
