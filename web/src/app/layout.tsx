import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import "./globals.css";

const displayFont = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "F1 Predictions",
    template: "%s | F1 Predictions",
  },
  description: "Private F1 race weekend predictions, scoring, and standings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
