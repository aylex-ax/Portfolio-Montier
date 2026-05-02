"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navigation({ brandName = "X AYLEX" }) {
  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed w-full z-50 top-0 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-background/90 to-transparent backdrop-blur-sm"
    >
      <Link href="/#hero" className="text-2xl font-bold tracking-widest text-gold-500 uppercase font-sans">
        {brandName}
      </Link>
      <div className="flex gap-8 text-sm font-medium tracking-wider">
        <Link href="/#hero" className="hover:text-gold-400 transition-colors">الرئيسية</Link>
        <Link href="/works" className="hover:text-gold-400 transition-colors">الأعمال</Link>
      </div>
    </motion.nav>
  );
}
