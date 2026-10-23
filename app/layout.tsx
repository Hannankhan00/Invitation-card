import type { Metadata } from "next";
import { Cinzel, Great_Vibes, Montserrat, Pinyon_Script } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
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
  title: "Royal Wedding Invitation | Cordially Invited",
  description: "Join us in celebrating the auspicious union of two souls. An unforgettable royal celebration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${greatVibes.variable} ${pinyonScript.variable} ${montserrat.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-[#1e0307] text-[#FAF6EE] overflow-x-hidden selection:bg-[#d4af37] selection:text-[#2b040a]">
        {children}
      </body>
    </html>
  );
}
