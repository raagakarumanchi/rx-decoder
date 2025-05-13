import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rx Decoder - Prescription Abbreviation Translator",
  description: "Translate medical prescription abbreviations into plain English. Comprehensive database of medical shorthand with error-prone abbreviation warnings.",
  keywords: ["prescription", "medical", "abbreviations", "decoder", "pharmacy", "healthcare"],
  authors: [{ name: "Raaga Karumanchi" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0f172a", // slate-900
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
