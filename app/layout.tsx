import type { Metadata } from "next";
import { Cinzel, Great_Vibes, Montserrat, Pinyon_Script, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
  display: "swap",
});

const pinyonScript = Pinyon_Script({
  weight: "400",
  variable: "--font-pinyon-script",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nikkah Invitation | Khadija Mansoor & Sohaib Javed",
  description: "Mr. & Mrs. Mansoor cordially invite you to celebrate the nikkah of Khadija Mansoor & Sohaib Javed at Dubai Palace Marque.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${greatVibes.variable} ${pinyonScript.variable} ${montserrat.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link rel="preload" href="/images/poster.jpg" as="image" />
        <link rel="preload" href="/video/intro.webm" as="video" type="video/webm" />
      </head>
      <body className="min-h-full bg-[#1e0307] text-[#FAF6EE] overflow-x-hidden selection:bg-[#d4af37] selection:text-[#2b040a]">
        {children}
      </body>
    </html>
  );
}
