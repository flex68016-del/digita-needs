import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Needs - Étude Nationale sur la Digitalisation",
  description: "Comprendre les activités professionnelles et révéler les opportunités numériques. Participez à notre étude nationale sur la transformation digitale.",
  keywords: ["digitalisation", "étude", "entrepreneurs", "professionnels", "transformation numérique", "opportunités"],
  authors: [{ name: "Digital Needs" }],
  openGraph: {
    title: "Digital Needs - Étude Nationale sur la Digitalisation",
    description: "Comprendre les activités professionnelles et révéler les opportunités numériques",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Needs - Étude Nationale sur la Digitalisation",
    description: "Comprendre les activités professionnelles et révéler les opportunités numériques",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}