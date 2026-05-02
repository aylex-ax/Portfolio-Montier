"use client";
import { motion } from "framer-motion";

export default function AboutMerged({ settings }) {
  const aboutData = {
    portraitUrl: settings?.about?.portraitUrl || "/mY.jpeg",
    backgroundUrl: settings?.about?.aboutBgImage || "/about cinematic background.jpeg",
    name: settings?.about?.realName || "Mostafa Mohammed",
    brandName: settings?.about?.nickname || "X AyLex",
    heading: settings?.about?.heading || "أصنع محتوى بصريًا يحمل الفخامة ويترك أثرًا لا يُنسى",
    aboutText: settings?.about?.paragraph || "أدمج بين الحس الفني والخبرة التقنية لصناعة فيديوهات سينمائية، محتوى يوتيوب احترافي، وإخراج بصري يمنح كل مشروع شخصية مستقلة وحضورًا استثنائيًا.",
    expertise: (settings?.about?.bullets && settings.about.bullets.some(b => b)) 
      ? settings.about.bullets.filter(b => b.trim() !== "") 
      : [
          "مونتاج سينمائي احترافي",
          "صناعة محتوى يوتيوب فاخر",
          "تلوين بصري متقدم",
          "هندسة صوتية وإيقاع بصري",
          "إخراج يترك انطباعًا قويًا"
        ],
    tools: (settings?.about?.tools && settings.about.tools.length > 0) 
      ? settings.about.tools 
      : [
          { name: "After Effects", icon: "/aftereffects icon.png" },
          { name: "DaVinci Resolve", icon: "/davinci icon.png" },
          { name: "Adobe Premiere Pro", icon: "/premiere icon.png" }
        ]
  };

  const PortraitBlock = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="flex flex-col items-center gap-6 w-full"
    >
      <motion.div
        animate={{ y: [-6, 6, -6], rotate: [-0.4, 0.4, -0.4] }}
        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
        className="relative w-[300px] md:w-[400px] aspect-[4/3] group shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
      >
        {/* Soft pulsing ambient glow */}
        <motion.div 
          animate={{ opacity: [0.2, 0.35, 0.2], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
          className="absolute -inset-6 bg-gold-500/10 blur-[50px] rounded-[100%] pointer-events-none" 
        />

        {/* Secondary faint outer gold line for layered depth */}
        <div className="absolute -inset-[5px] border border-gold-500/10 rounded-sm pointer-events-none opacity-60" />

        {/* Decorative Glowing Golden Corners (Finer, Sleeker) */}
        <div className="absolute -top-[6px] -left-[6px] w-4 h-4 border-t-[1px] border-l-[1px] border-white/50 opacity-80 shadow-[0_0_6px_rgba(212,175,55,0.3)] rounded-tl-sm" />
        <div className="absolute -top-[6px] -right-[6px] w-4 h-4 border-t-[1px] border-r-[1px] border-gold-400/80 opacity-80 shadow-[0_0_6px_rgba(212,175,55,0.3)] rounded-tr-sm" />
        <div className="absolute -bottom-[6px] -left-[6px] w-4 h-4 border-b-[1px] border-l-[1px] border-gold-400/80 opacity-80 shadow-[0_0_6px_rgba(212,175,55,0.3)] rounded-bl-sm" />
        <div className="absolute -bottom-[6px] -right-[6px] w-4 h-4 border-b-[1px] border-r-[1px] border-white/50 opacity-80 shadow-[0_0_6px_rgba(212,175,55,0.3)] rounded-br-sm" />

        {/* Primary thin metallic white/gold border */}
        <div className="absolute inset-0 rounded-sm bg-gradient-to-br from-white/60 via-gold-400/80 to-gold-900/80 p-[1px]">
          
          {/* Black space for breathing room (Tightened) */}
          <div className="w-full h-full bg-black-pure rounded-sm p-[2px]">
            
            {/* Image container with soft dark inner shadow */}
            <div className="w-full h-full bg-black-pure rounded-sm overflow-hidden relative shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border border-white/5">
              <img
                src={aboutData.portraitUrl}
                alt={aboutData.name}
                className="w-full h-full object-cover object-center contrast-[1.15] brightness-[1.05] opacity-90"
              />
              <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black-pure/70 via-transparent to-transparent pointer-events-none" />
            </div>

          </div>

        </div>
      </motion.div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-lg md:text-xl lg:text-2xl font-bold mt-4">
        <span className="text-white tracking-wide drop-shadow-md">{aboutData.name}</span>
        <span className="text-gray-400 text-sm md:text-base hidden md:block">→</span>
        <span className="text-gold-400 font-sans tracking-widest drop-shadow-md">({aboutData.brandName})</span>
      </div>
    </motion.div>
  );

  return (
    <section className="relative w-full py-32 md:py-48 lg:py-56 bg-black-pure text-white overflow-hidden border-t border-white/5" id="about">
      
      {/* ========================================== */}
      {/* VISIBLE CINEMATIC STUDIO BACKGROUND */}
      {/* ========================================== */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.45] blur-[8px] contrast-[1.15] brightness-[1.1] pointer-events-none"
        style={{ backgroundImage: `url('${aboutData.backgroundUrl}')` }}
      />
      
      {/* Breathable Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black-pure/60 pointer-events-none" />
      
      {/* Subtle Outer Edge Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 flex flex-col lg:flex-row gap-20 lg:gap-32 items-center">
        
        {/* LEFT COLUMN (60%) */}
        <div className="w-full lg:w-[60%] flex flex-col gap-10 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col gap-6 lg:gap-8 lg:pr-12 text-center lg:text-right"
          >
            <div className="flex flex-col items-center lg:items-start w-full gap-4 pb-2 lg:mr-0 mr-auto ml-auto">
              <span className="text-sm md:text-base font-sans tracking-[0.6em] text-gold-400 uppercase drop-shadow-lg lg:pr-1">About Me</span>
              <div className="h-[1px] w-24 bg-gradient-to-r lg:bg-gradient-to-l from-transparent to-gold-500/60" />
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-[44px] leading-[1.6] font-bold text-white drop-shadow-xl">
              {aboutData.heading}
            </h2>

            {/* Mobile Portrait Injection */}
            <div className="block lg:hidden my-8">
              <PortraitBlock />
            </div>

            <p className="text-xl md:text-[22px] leading-[2.2] text-gray-400 font-medium max-w-3xl lg:mr-0 mr-auto ml-auto">
              {aboutData.aboutText}
            </p>
          </motion.div>

          <ul className="flex flex-col gap-6 lg:gap-8 lg:pr-12 max-w-2xl lg:mr-0 mr-auto ml-auto w-full">
            {aboutData.expertise.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-6 text-gray-200 text-xl md:text-[22px] font-bold"
              >
                <div className="relative flex items-center justify-center w-2.5 h-2.5 flex-shrink-0">
                  <div className="absolute w-full h-full bg-gold-400 rounded-full" />
                  <div className="absolute w-5 h-5 bg-gold-500/50 rounded-full blur-[4px] animate-pulse" />
                </div>
                {item}
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-8 lg:pr-12 flex flex-col items-center lg:items-start gap-8 w-full max-w-2xl lg:mr-0 mr-auto ml-auto"
          >
            <div className="flex items-center justify-center lg:justify-start gap-4 w-full">
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-500/40" />
              <h4 className="text-xs md:text-sm tracking-[0.3em] text-gold-500 font-sans uppercase">Tools of Craft</h4>
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-500/40" />
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6">
              {aboutData.tools.map((tool, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -3, 0], rotate: [0, 0.5, 0] }}
                  transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: i * 0.5 }}
                  className="group/icon relative w-14 h-14 md:w-16 md:h-16 rounded-xl bg-black-pure/60 border border-white/5 shadow-[inset_0_0_15px_rgba(212,175,55,0.02)] flex items-center justify-center p-3 transition-all duration-500 hover:-translate-y-2 hover:border-gold-500/50 hover:shadow-[inset_0_0_20px_rgba(212,175,55,0.1),0_0_20px_rgba(212,175,55,0.2)] cursor-pointer backdrop-blur-md"
                >
                  <img 
                    src={tool.icon} 
                    alt={tool.name} 
                    className="relative z-10 w-full h-full object-contain drop-shadow-md grayscale-[30%] opacity-80 group-hover/icon:grayscale-0 group-hover/icon:opacity-100 transition-all duration-500" 
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN (40%) */}
        <div className="hidden lg:flex w-full lg:w-[40%] flex-col items-center justify-center flex-shrink-0">
          <PortraitBlock />
        </div>
      </div>
    </section>
  );
}
