import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const Plantin = localFont({
  src: "./assets/fonts/Plantin.otf",
  variable: "--font-jakarta-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Swastha Lab",
  description: "Wellness for live",
  icons: {
    icon: "/logo.ico",
    apple: "/logo-apple.png",
    shortcut: "/logo.png", 
  }
};

export const viewport = {
  themeColor: "#B61717",  
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${Plantin.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
