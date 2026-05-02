"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function GridPlayableCard({ project, index, onPlay }) {
  const displayNumber = String(project.order || project.orderNumber || index + 1).padStart(2, '0');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="group flex flex-col h-full bg-black-pure border border-white/5 rounded-sm overflow-hidden hover:border-gold-500/30 transition-colors duration-500 shadow-lg"
    >
      {/* Video / Thumbnail Container */}
      <div className="relative w-full aspect-video bg-black-pure overflow-hidden cursor-pointer shrink-0" onClick={onPlay}>
        {(project.thumbnailPath || project.thumbnailUrl) && (
          <motion.div 
            className="absolute inset-0 bg-cover bg-center contrast-[1.15] brightness-75 transition-transform duration-1000 group-hover:scale-[1.05]"
            style={{ backgroundImage: `url('${project.thumbnailPath || project.thumbnailUrl}')` }}
          />
        )}
        
        {/* Cinematic Hover Overlays */}
        <div className="absolute inset-0 bg-black-pure/50 group-hover:bg-black-pure/20 transition-all duration-700 z-10 flex items-center justify-center">
           {/* Play Button */}
           <div className="w-16 h-16 rounded-full bg-black-pure/70 border border-gold-500/50 flex items-center justify-center backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
             <Play className="text-gold-400 w-6 h-6 ml-1.5" fill="currentColor" />
           </div>
        </div>
        {/* Deep Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] z-0" />
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-grow p-6 gap-4 relative bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
        
        <div className="flex items-center justify-between">
          <span className="text-gold-500 font-sans tracking-widest text-lg opacity-90 drop-shadow-md">
            {displayNumber}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-gold-400 transition-colors duration-500 line-clamp-2 drop-shadow-md">
          {project.title}
        </h3>
        
        <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-3 mt-auto">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}
