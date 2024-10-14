import type { Metadata } from "next";
import localFont from "next/font/local";
import { Roboto_Mono } from "next/font/google";

import "./globals.css";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const geistSans = localFont({
  src: "./assets/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const geistMono = localFont({
  src: "./assets/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Typo Terminator",
  description: "Practice text editing with a twist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto_mono.className}>{children}</body>
    </html>
  );
}
