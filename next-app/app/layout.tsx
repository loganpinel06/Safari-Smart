import type { Metadata } from "next";
/*import { Geist, Geist_Mono } from "next/font/google";*/
import { Inter } from "next/font/google";
import "./globals.css";



const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Safari Smart",
  description: "A learning web app for BECE and WASSCE exam preparation.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
