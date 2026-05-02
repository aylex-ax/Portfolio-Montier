"use client";
import { useState, useEffect, useRef } from "react";

export default function MediaManagerModal({ onClose, onSelect, uploadFolder = "uploads" }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error("Failed to load images", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", uploadFolder);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        await fetchImages();
        onSelect(data.url);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black-pure/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-black-light border border-white/10 rounded-xl w-full max-w-4xl flex flex-col max-h-[85vh]">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gold-500 font-sans tracking-wider">Media Library</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
          {loading ? (
            <div className="text-center text-gray-500 py-10">Loading media...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Upload Card */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gold-500 hover:bg-gold-500/5 transition-all"
              >
                {uploading ? (
                  <span className="text-gold-500 text-sm">Uploading...</span>
                ) : (
                  <>
                    <span className="text-3xl mb-2 text-gray-400">+</span>
                    <span className="text-sm text-gray-400">Upload New</span>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleUpload}
                />
              </div>

              {/* Image Grid */}
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onSelect(img.url)}
                  className="aspect-square rounded-lg bg-black-pure border border-white/10 overflow-hidden cursor-pointer group relative"
                >
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black-pure/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold bg-gold-500/80 px-4 py-2 rounded-sm text-sm">Select</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
