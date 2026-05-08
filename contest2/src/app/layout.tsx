import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-admin-demo.local"),
  title: {
    default: "Ayesha Portfolio",
    template: "%s | Ayesha Portfolio",
  },
  description:
    "Modern portfolio website with an integrated admin panel for managing projects, profile content, skills, and social links.",
  keywords: [
    "portfolio",
    "web designer",
    "developer portfolio",
    "project showcase",
    "admin panel",
  ],
  openGraph: {
    title: "Ayesha Portfolio",
    description:
      "A polished portfolio with editable projects, profile sections, and contact information.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
