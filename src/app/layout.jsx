import CartShell from "@/components/cart/CartShell";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ResearcherGate from "@/components/ResearcherGate";
import "@/styles/globals.css";

import { Sora, DM_Sans } from "next/font/google";

export const metadata = {
  title: "Spectrum Biosciences | Premium Research Peptides",
  description:
    "Explore premium research peptides from Spectrum Biosciences. Discover precision-focused products developed for laboratory research.",
};

const headingFont = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="antialiased">
        <CartShell>
          <Header />
          {children}
          <Footer />
        </CartShell>
         <ResearcherGate />
      </body>
    </html>
  );
}
