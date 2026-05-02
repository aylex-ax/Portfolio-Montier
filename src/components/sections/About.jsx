"use client";
import { motion } from "framer-motion";

export default function About({ settings }) {
  const defaultText = `محرر فيديو محترف متخصص في صناعة المحتوى البصري الفاخر. أمتلك خبرة واسعة في العمل مع علامات تجارية راقية وصناع محتوى، حيث أدمج بين الرؤية الفنية والتقنيات المتقدمة لإنتاج أعمال استثنائية تعكس الفخامة والجودة.`;
  const text = settings?.aboutText || defaultText;

  return (
    <section className="w-full py-32 bg-black-pure text-white relative overflow-hidden" id="about-me">
      {/* Subtle Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-16 h-16 rounded-full border border-gold-500/30 flex items-center justify-center mb-8 mx-auto bg-black-pure/50 backdrop-blur-sm shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <span className="font-serif text-2xl text-gold-400 italic">M</span>
          </div>
          
          <h2 className="text-sm font-sans tracking-[0.4em] text-gold-500 uppercase mb-8 drop-shadow-md">About Me</h2>
          
          <p className="text-2xl md:text-3xl leading-relaxed font-bold text-gray-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {text}
          </p>
          
          <div className="w-1 h-24 bg-gradient-to-b from-gold-400 to-transparent mx-auto mt-16 opacity-50" />
        </motion.div>
      </div>
    </section>
  );
}
