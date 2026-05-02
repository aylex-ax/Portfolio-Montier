import { Inter, Cairo } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
});

export const metadata = {
  title: "Montier | Elite Cinematic Editor",
  description: "Personal elite editor brand portfolio",
};

import FloatingContactDock from "@/components/ui/FloatingContactDock";
import fs from 'fs';
import path from 'path';

export default function RootLayout({ children }) {
  let siteSettings = {};
  try {
    const contentPath = path.join(process.cwd(), 'src', 'data', 'siteContent.json');
    if (fs.existsSync(contentPath)) {
      siteSettings = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    }
  } catch (err) {
    console.error("Error reading layout settings:", err);
  }

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
