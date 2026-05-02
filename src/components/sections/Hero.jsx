"use client";
import { motion } from "framer-motion";

export default function Hero({ settings = {} }) {
  const brandName = settings.brandName || "X AYLEX";
  const heroTaglineRaw = settings.heroTagline || "مع الفنان {BRAND_NAME} تكتسب اللقطة نبضًا فنيًا مختلفًا";
  
  // Replace {BRAND_NAME} with actual brand name wrapped in gold span
  const taglineParts = heroTaglineRaw.split("{BRAND_NAME}");
  const taglineElement = taglineParts.length > 1 ? (
    <>
      {taglineParts[0]}
      <span className="text-gold-400 px-2 font-sans drop-shadow-lg">{brandName}</span>
      {taglineParts[1]}
    </>
  ) : (
    heroTaglineRaw
  );

  const heroImage = settings.heroBgUrl || "/background.jpg";
  const portraitImage = settings.heroPortraitUrl || "/personal portrait.jpg";

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black-pure">
      
      {/* Background Image: Desaturated, Soft Blur, Floating */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat contrast-[1.1] saturate-[0.7] brightness-[0.6] blur-[6px]"
        style={{ backgroundImage: `url('${heroImage}')` }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1.15 }}
        transition={{ duration: 30, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
      />
      
      {/* Cinematic Overlays: Darker, Deeper Vignette */}
      <div className="absolute inset-0 bg-black-pure/50 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.98)_85%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black-pure via-black-pure/60 to-transparent pointer-events-none" />

      {/* Cinematic Soft Smoke Wisps */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <motion.div
          className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] bg-gray-500/10 rounded-[100%] blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, -30, 0], opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 20, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          className="absolute top-[20%] -right-[10%] w-[1000px] h-[600px] bg-gray-400/10 rounded-[100%] blur-[150px]"
          animate={{ x: [0, -50, 0], y: [0, 40, 0], opacity: [0.2, 0.5, 0.2], scale: [1.05, 1, 1.05] }}
          transition={{ duration: 25, ease: "easeInOut", repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute bottom-[0%] left-[10%] w-[900px] h-[500px] bg-gray-600/10 rounded-[100%] blur-[130px]"
          animate={{ x: [0, 30, 0], y: [0, -20, 0], opacity: [0.4, 0.7, 0.4], scale: [1, 1.02, 1] }}
          transition={{ duration: 22, ease: "easeInOut", repeat: Infinity, delay: 5 }}
        />
      </div>

      {/* Content Container with Dark Transparent Glow for Readability */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl px-6 mt-16">
        
        {/* Subtle Dark Glow behind text group to separate from background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,5,5,0.7)_0%,transparent_70%)] -z-10 blur-2xl pointer-events-none scale-150" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-gold-500/10 blur-[100px] pointer-events-none -z-10" />

        {/* Floating Horizontal Portrait Card placed centered above the title */}
        <motion.div
          initial={{ y: 0, x: "-50%", rotate: -2 }}
          animate={{ y: [0, -8, 0], x: "-50%", rotate: [-2, -1.5, -2] }}
          transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
          className="absolute -top-[140px] md:-top-[200px] left-1/2 w-[320px] md:w-[480px] aspect-[16/7] p-[2px] rounded-sm bg-gradient-to-br from-gold-300 via-gold-600 to-gold-900 shadow-[0_40px_80px_rgba(0,0,0,0.8)] group -z-0 opacity-90 pointer-events-none"
        >
          {/* Soft Outer Glow */}
          <div className="absolute inset-0 bg-gold-500 blur-[40px] opacity-30 group-hover:opacity-50 transition-opacity duration-1000" />
          
          {/* Inner Portrait Container */}
          <div className="relative w-full h-full bg-black-pure overflow-hidden rounded-sm border-[4px] border-black-pure">
            {/* The Portrait Image (Professional crop focused on eyes) */}
            <motion.div 
              className="absolute inset-0 bg-cover contrast-[1.15] brightness-100"
              style={{ 
                backgroundImage: `url('${portraitImage}')`,
                backgroundPosition: '50% 25%'
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            
            {/* Cinematic Shadows & Inner Depth */}
            <div className="absolute inset-0 bg-black-pure/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black-pure/70 via-transparent to-transparent" />
            <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]" />
          </div>

          {/* Decorative Corner Accents */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-[2px] border-l-[2px] border-gold-400 opacity-80 shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-[2px] border-r-[2px] border-gold-400 opacity-80 shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-[2px] border-l-[2px] border-gold-400 opacity-80 shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-[2px] border-r-[2px] border-gold-400 opacity-80 shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
        </motion.div>

        <div className="relative z-20 flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl whitespace-nowrap font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gold-400 tracking-[0.15em] text-glow leading-tight font-sans uppercase drop-shadow-2xl">
              {brandName}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          >
            <p className="text-2xl md:text-3xl text-gray-200 font-bold tracking-wide drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] leading-relaxed max-w-3xl text-center">
              {taglineElement}
            </p>
            {settings.heroSubtitle && (
              <p className="mt-4 text-xl md:text-2xl text-gray-400 font-medium tracking-wide text-center">
                {settings.heroSubtitle}
              </p>
            )}
          </motion.div>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.8 }}
            className="flex gap-6 mt-6"
          >
            <button 
              onClick={() => scrollToSection('works')}
              className="px-10 py-4 bg-gold-500 hover:bg-gold-400 text-black-pure font-bold rounded-sm tracking-widest transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:-translate-y-1"
            >
              أعمالي
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="px-10 py-4 border border-white/20 hover:border-gold-500 text-white font-bold rounded-sm tracking-widest transition-all duration-300 bg-black-pure/30 backdrop-blur-md hover:bg-black-pure/50 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]"
            >
              تعرف عليّ
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-sans drop-shadow-lg">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-gold-500 to-transparent opacity-60" />
      </motion.div>
    </section>
  );
}
