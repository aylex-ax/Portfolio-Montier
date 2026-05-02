import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { getSiteContent } from "@/lib/api";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
});

export const metadata = {
  title: "X AyLex",
  description: "Personal elite editor brand portfolio",
};

import FloatingContactDock from "@/components/ui/FloatingContactDock";

export default async function RootLayout({ children }) {
  const siteSettings = await getSiteContent() || {};

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${inter.variable} ${cairo.variable} antialiased scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col font-arabic">
        {children}
        <FloatingContactDock settings={siteSettings} />
      </body>
    </html>
  );
}
