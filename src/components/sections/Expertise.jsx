"use client";
import { motion } from "framer-motion";

export default function Expertise() {
  const skills = [
    { title: "التحرير السينمائي (Cinematic Editing)", desc: "سرد قصصي مرئي بإيقاع دقيق ومؤثرات انتقال احترافية." },
    { title: "تصحيح وتدرج الألوان (Color Grading)", desc: "إضفاء طابع لوني فاخر باستخدام DaVinci Resolve." },
    { title: "الهندسة الصوتية (Sound Design)", desc: "تصميم مؤثرات صوتية ومكساج يخدم القصة ويرفع جودة العمل." },
    { title: "المؤثرات البصرية (VFX & Motion)", desc: "دمج نصوص ورسوميات متحركة بأسلوب بسيط وأنيق." }
  ];

  return (
    <section className="w-full py-32 bg-black-light text-white border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8">
        
        <div className="flex flex-col gap-6 justify-center">
          <h2 className="text-sm font-sans tracking-[0.3em] text-gold-500 uppercase">Expertise</h2>
          <h3 className="text-4xl md:text-5xl font-bold leading-tight">الخبرات الإبداعية</h3>
          <p className="text-gray-400 leading-relaxed max-w-lg text-lg mt-4">
            أقدم حلولاً متكاملة في ما بعد الإنتاج، مع التركيز على الجودة الفائقة والتفاصيل الدقيقة التي تصنع الفارق بين الفيديو العادي والعمل الفني.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col gap-3 p-6 border border-white/5 bg-black-pure/50 hover:border-gold-500/30 transition-colors"
            >
              <div className="w-8 h-[2px] bg-gold-400 mb-2" />
              <h4 className="text-xl font-bold text-white">{skill.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{skill.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
