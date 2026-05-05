"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import GridPlayableCard from "@/components/ui/GridPlayableCard";

export default function WorksGridClient({ projects }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    if (selectedProject) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selectedProject]);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.split("v=")[1] || url.split("youtu.be/")[1];
      const ampersandPosition = videoId?.indexOf("&");
      const cleanId = ampersandPosition !== -1 && ampersandPosition !== undefined ? videoId?.substring(0, ampersandPosition) : videoId;
      return `https://www.youtube.com/embed/${cleanId}?autoplay=1&rel=0&modestbranding=1`;
    }
    if (url.includes("vimeo.com")) {
      const videoId = url.split("vimeo.com/")[1];
      return `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`;
    }
    return url;
  };

  if (!isClient) return null;

  return (
    <>
      <div className="flex flex-col gap-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {currentProjects.map((project, index) => (
            <GridPlayableCard 
              key={project.id} 
              project={project} 
              index={startIndex + index} 
              onPlay={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {projects.length === 0 && (
          <p className="text-center text-gray-500">لا توجد أعمال لعرضها حالياً.</p>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12 mb-8">
            <button 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 bg-black-pure border border-white/10 rounded-sm text-gray-400 hover:text-gold-400 hover:border-gold-500/50 hover:bg-gold-500/5 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              Back
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-12 h-12 flex items-center justify-center rounded-sm transition-all duration-300 font-sans ${
                    currentPage === page 
                      ? "bg-gold-500/15 border border-gold-500 text-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.25)] font-bold text-lg" 
                      : "bg-black-pure border border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5 text-lg"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 bg-black-pure border border-white/10 rounded-sm text-gray-400 hover:text-gold-400 hover:border-gold-500/50 hover:bg-gold-500/5 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black-pure/90 backdrop-blur-xl p-4 md:p-12"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-[80vw] md:w-[80vw] lg:w-[75vw] xl:w-[70vw] flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute -top-12 -right-4 md:-right-12 p-2 text-gray-400 hover:text-gold-400 transition-colors z-50 hover:rotate-90 duration-300"
              >
                <X size={32} />
              </button>

              <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-gold-500/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] relative">
                <iframe 
                  src={getEmbedUrl(selectedProject.videoUrl)} 
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex flex-col gap-2 text-right">
                <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md">
                  {selectedProject.title}
                </h2>
                <p className="text-gray-400 text-base md:text-xl leading-relaxed max-w-4xl opacity-90">
                  {selectedProject.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
