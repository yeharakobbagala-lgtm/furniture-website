import localFont from "next/font/local";
import type { Metadata } from "next";
import { Inter, Manrope, Cormorant_Garamond, Lora } from "next/font/google";
import "./globals.css";
import Header from "@/components/navigation/Header";
import Footer from "@/components/layout/Footer";
import QuickViewModal from "@/components/modals/QuickViewModal";
import CommercialModeBanner from "@/components/layout/CommercialModeBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

const orangeAvenue = localFont({
  src: "../../public/fonts/OrangeAvenueDEMO-Regular.otf",
  variable: "--font-orange-avenue",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Square — Premium Furniture & Living",
  description:
    "Architectural furniture, handcrafted solid timber, and organic silhouettes for residential sanctuaries and commercial spaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${cormorant.variable} ${lora.variable} ${orangeAvenue.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-sage-light text-forest-deep antialiased">
        <CommercialModeBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <QuickViewModal />
      </body>
    </html>
  );
}
