"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function PlayableCard({ project, index }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Parse video URL to get embed link
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.split("v=")[1] || url.split("youtu.be/")[1];
      const ampersandPosition = videoId?.indexOf("&");
      const cleanId = ampersandPosition !== -1 ? videoId?.substring(0, ampersandPosition) : videoId;
      return `https://www.youtube.com/embed/${cleanId}?autoplay=1&rel=0&modestbranding=1`;
    }
    if (url.includes("vimeo.com")) {
      const videoId = url.split("vimeo.com/")[1];
      return `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`;
    }
    return url; // Fallback
  };

  const displayNumber = String(project.order || project.orderNumber || index + 1).padStart(2, '0');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="group flex flex-col gap-8 w-full relative"
    >
      {/* Number and Title Header */}
      <div className="flex items-center gap-6 px-2">
        <span className="text-gold-500 font-sans tracking-widest text-2xl md:text-3xl opacity-90 drop-shadow-md">
          {displayNumber}
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-gold-500/50 via-gold-500/10 to-transparent" />
      </div>

      <div className="flex flex-col gap-4 px-2">
        <h3 className="text-3xl md:text-5xl font-bold text-white group-hover:text-gold-400 transition-colors duration-500 drop-shadow-md">
          {project.title}
        </h3>
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl opacity-90">
          {project.description}
        </p>
      </div>

      {/* Video / Thumbnail Container */}
      <div className="relative w-full aspect-video md:aspect-[21/9] bg-black-pure overflow-hidden rounded-sm border border-white/10 cursor-pointer shadow-[0_10px_40px_rgba(0,0,0,0.8)]" onClick={() => setIsPlaying(true)}>
        
        {/* Placeholder Thumbnail Layer */}
        {!isPlaying ? (
          <>
            {(project.thumbnailPath || project.thumbnailUrl) && (
              <motion.div 
                className="absolute inset-0 bg-cover bg-center contrast-[1.15] brightness-75 transition-transform duration-1000 group-hover:scale-[1.03]"
                style={{ backgroundImage: `url('${project.thumbnailPath || project.thumbnailUrl}')` }}
              />
            )}
            
            {/* Cinematic Hover Overlays */}
            <div className="absolute inset-0 bg-black-pure/40 group-hover:bg-black-pure/20 transition-all duration-700 z-10 flex items-center justify-center">
               {/* Play Button */}
               <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black-pure/60 border border-gold-500/50 flex items-center justify-center backdrop-blur-md transition-transform duration-500 group-hover:scale-110 shadow-[0_0_30px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_50px_rgba(212,175,55,0.6)]">
                 <Play className="text-gold-400 w-8 h-8 md:w-10 md:h-10 ml-2" fill="currentColor" />
               </div>
            </div>
            {/* Deep Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] z-0" />
          </>
        ) : null}

        {/* The actual iframe */}
        {isPlaying ? (
          <iframe 
            src={getEmbedUrl(project.videoUrl)} 
            className="absolute inset-0 w-full h-full z-20"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : null}
      </div>
    </motion.div>
  );
}
