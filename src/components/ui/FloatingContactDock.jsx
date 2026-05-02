"use client";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px] md:w-[26px] md:h-[26px]">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const BehanceIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[26px] md:h-[26px]">
    <path d="M7.5 11c1.38 0 2.5-.9 2.5-2s-1.12-2-2.5-2H3v4h4.5zM3 13v4h5c1.38 0 2.5-.9 2.5-2s-1.12-2-2.5-2H3zM15 7h5v1.5h-5V7zM17.5 10c-2.49 0-4.5 1.79-4.5 4s2.01 4 4.5 4c1.78 0 3.31-.98 4.09-2.43h-2.09c-.42.63-1.16 1.03-2 1.03-1.38 0-2.5-.9-2.5-2h6.59c.03-.19.05-.38.05-.58 0-2.22-2.02-4.02-4.5-4.02h-.14zM15 13.5c.2-1.01 1.24-1.8 2.5-1.8s2.3.79 2.5 1.8H15z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px] md:w-[26px] md:h-[26px]">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <path d="M16.49 14.86a.82.82 0 0 1-.42.74c-.58.33-1.63.85-2.67.65-1-.2-2.84-1.22-4.1-2.48-1.26-1.26-2.28-3.1-2.48-4.1-.2-1.04.32-2.09.65-2.67a.82.82 0 0 1 .74-.42c.32 0 .58.11.85.74.28.66.75 1.83.82 1.99a.8.8 0 0 1-.09.84c-.16.23-.33.36-.54.6.43.91 1.09 1.57 2 2 .24-.21.37-.38.6-.54a.8.8 0 0 1 .84-.09c.16.07 1.33.54 1.99.82.63.27.74.53.74.85z" />
  </svg>
);

export default function FloatingContactDock({ settings }) {
  const behanceUrl = settings?.behanceProfile || "";
  const instagramUrl = settings?.instagramProfile || "";

  const whatsappClean = (settings?.whatsAppNumber || "")
    .replace(/\s+/g,'')
    .replace('+20','20')
    .replace(/^0/,'20');

  const whatsappUrl = whatsappClean ? `https://wa.me/${whatsappClean}` : "";

  const emailUrl = settings?.emailAddress ? `mailto:${settings.emailAddress}` : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto"
    >
      <div className="absolute -inset-4 bg-gold-500/10 blur-[25px] rounded-full pointer-events-none" />

      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        className="relative flex items-center justify-center gap-4 md:gap-6 px-8 py-3.5 rounded-full bg-black-pure/60 backdrop-blur-xl border border-white/10 border-t-gold-500/30 shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
      >
        {emailUrl && (
          <a
            href={emailUrl}
            className="group/dockicon relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 bg-black-pure/40 text-gray-300 transition-all duration-300 hover:-translate-y-2 hover:text-gold-400 hover:border-gold-500/60 hover:bg-black-pure/80 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            <div className="absolute -inset-[1px] rounded-full border border-gold-400/0 group-hover/dockicon:border-gold-400/50 transition-all duration-300 scale-105 opacity-0 group-hover/dockicon:opacity-100 shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
            <span className="relative z-10 transition-transform duration-300 group-hover/dockicon:scale-110">
              <Mail className="w-[24px] h-[24px] md:w-[26px] md:h-[26px]" strokeWidth={2} />
            </span>
          </a>
        )}

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/dockicon relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 bg-black-pure/40 text-gray-300 transition-all duration-300 hover:-translate-y-2 hover:text-gold-400 hover:border-gold-500/60 hover:bg-black-pure/80 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            <div className="absolute -inset-[1px] rounded-full border border-gold-400/0 group-hover/dockicon:border-gold-400/50 transition-all duration-300 scale-105 opacity-0 group-hover/dockicon:opacity-100 shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
            <span className="relative z-10 transition-transform duration-300 group-hover/dockicon:scale-110">
              <WhatsAppIcon />
            </span>
          </a>
        )}

        {instagramUrl && (
          <a
            href={instagramUrl.startsWith('http') ? instagramUrl : `https://${instagramUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/dockicon relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 bg-black-pure/40 text-gray-300 transition-all duration-300 hover:-translate-y-2 hover:text-gold-400 hover:border-gold-500/60 hover:bg-black-pure/80 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            <div className="absolute -inset-[1px] rounded-full border border-gold-400/0 group-hover/dockicon:border-gold-400/50 transition-all duration-300 scale-105 opacity-0 group-hover/dockicon:opacity-100 shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
            <span className="relative z-10 transition-transform duration-300 group-hover/dockicon:scale-110">
              <InstagramIcon />
            </span>
          </a>
        )}

        {behanceUrl && (
          <a
            href={behanceUrl.startsWith('http') ? behanceUrl : `https://${behanceUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/dockicon relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 bg-black-pure/40 text-gray-300 transition-all duration-300 hover:-translate-y-2 hover:text-gold-400 hover:border-gold-500/60 hover:bg-black-pure/80 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            <div className="absolute -inset-[1px] rounded-full border border-gold-400/0 group-hover/dockicon:border-gold-400/50 transition-all duration-300 scale-105 opacity-0 group-hover/dockicon:opacity-100 shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
            <span className="relative z-10 transition-transform duration-300 group-hover/dockicon:scale-110">
              <BehanceIcon />
            </span>
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}
