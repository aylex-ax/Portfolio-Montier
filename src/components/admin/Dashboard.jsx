"use client";
import { useState, useEffect, useRef } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import MediaManagerModal from "./MediaManagerModal";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("about"); // 'hero', 'about', 'projects', 'settings'
  
  // CMS State
  const [heroSettings, setHeroSettings] = useState({
    brandName: "", heroTagline: "", heroSubtitle: "", heroPortraitUrl: "", heroBgUrl: ""
  });
  const [aboutSettings, setAboutSettings] = useState({
    portraitUrl: "", aboutBgImage: "", nickname: "", realName: "", heading: "", paragraph: "",
    bullets: ["", "", "", "", ""], tools: []
  });
  const [socialSettings, setSocialSettings] = useState({
    behanceProfile: "", instagramProfile: "", whatsAppNumber: "", emailAddress: ""
  });
  
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");
  
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [currentMediaField, setCurrentMediaField] = useState(null);
  const [currentUploadFolder, setCurrentUploadFolder] = useState("uploads");

  // Projects State
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectMode, setProjectMode] = useState("menu"); 
  const [currentProject, setCurrentProject] = useState(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const thumbInputRef = useRef(null);

  // About Media Refs
  const aboutPortraitInputRef = useRef(null);
  const aboutToolInputRef = useRef(null);
  const [uploadingAboutMedia, setUploadingAboutMedia] = useState(false);

  // Drag and Drop Sort State
  const [sortableProjects, setSortableProjects] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cmsRes, projRes] = await Promise.all([
        fetch("/api/cms"),
        fetch("/api/projects")
      ]);
      if (cmsRes.ok) {
        const data = await cmsRes.json();
        setHeroSettings({
          brandName: data.brandName || "",
          heroTagline: data.heroTagline || "",
          heroSubtitle: data.heroSubtitle || "",
          heroPortraitUrl: data.heroPortraitUrl || "",
          heroBgUrl: data.heroBgUrl || ""
        });
        setAboutSettings(data.about || {
          portraitUrl: "", aboutBgImage: "", nickname: "", realName: "", heading: "", paragraph: "",
          bullets: ["", "", "", "", ""], tools: []
        });
        setSocialSettings({
          behanceProfile: data.behanceProfile || data.socials?.behanceProfile || data.socials?.behance || "",
          instagramProfile: data.instagramProfile || data.socials?.instagramProfile || data.socials?.instagram || "",
          whatsAppNumber: data.whatsAppNumber || data.whatsappNumber || data.socials?.whatsAppNumber || data.socials?.whatsapp || "",
          emailAddress: data.emailAddress || data.socials?.emailAddress || data.socials?.email || ""
        });
      }
      if (projRes.ok) setProjects(await projRes.json());
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => await signOut(auth);

  // --- CMS LOGIC ---
  const saveCMSData = async (newHero, newAbout, newSocials) => {
    setSavingSettings(true);
    try {
      const payload = { ...newHero, about: newAbout, ...newSocials };
      await fetch("/api/cms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setSettingsMessage("Settings saved successfully!");
      setTimeout(() => setSettingsMessage(""), 3000);
    } catch (err) {
      setSettingsMessage("Error saving data.");
    } finally { 
      setSavingSettings(false); 
    }
  };

  const handleSaveHero = () => saveCMSData(heroSettings, aboutSettings, socialSettings);
  const handleSaveAbout = () => saveCMSData(heroSettings, aboutSettings, socialSettings);
  const handleSaveSocial = () => saveCMSData(heroSettings, aboutSettings, socialSettings);

  const openMediaManager = (field, folder = "uploads") => { 
    setCurrentMediaField(field); 
    setCurrentUploadFolder(folder);
    setMediaModalOpen(true); 
  };
  
  const handleMediaSelect = (url) => {
    if (currentMediaField === "heroPortraitUrl" || currentMediaField === "heroBgUrl") {
      setHeroSettings({ ...heroSettings, [currentMediaField]: url });
    } else if (currentMediaField === "aboutPortraitUrl") {
      setAboutSettings({ ...aboutSettings, portraitUrl: url });
    } else if (currentMediaField === "aboutToolIcon") {
      setAboutSettings({ ...aboutSettings, tools: [...aboutSettings.tools, { icon: url, name: "Tool" }] });
    }
    setMediaModalOpen(false);
  };

  // --- ABOUT MEDIA LOGIC ---
  const handleRemoveTool = async (index) => {
    if (!confirm("Remove this tool?")) return;
    const newTools = [...aboutSettings.tools];
    const removed = newTools.splice(index, 1)[0];
    setAboutSettings({ ...aboutSettings, tools: newTools });
    if (removed.icon && removed.icon.includes('/media/about/tools/')) {
      await fetch("/api/about-media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: removed.icon }) });
    }
  };

  const updateBullet = (index, value) => {
    const newBullets = [...aboutSettings.bullets];
    newBullets[index] = value;
    setAboutSettings({ ...aboutSettings, bullets: newBullets });
  };

  const addBullet = () => {
    setAboutSettings({ ...aboutSettings, bullets: [...aboutSettings.bullets, ""] });
  };

  const removeBullet = (index) => {
    const newBullets = [...aboutSettings.bullets];
    newBullets.splice(index, 1);
    setAboutSettings({ ...aboutSettings, bullets: newBullets });
  };

  // --- PROJECTS LOGIC ---
  const saveProjects = async (newProjects) => {
    const sorted = [...newProjects].sort((a, b) => a.order - b.order);
    const updated = sorted.map((p, i) => ({ ...p, order: i + 1, isFeatured: i < 3 }));
    setProjects(updated);
    await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
  };

  const handleThumbUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingThumb(true);
    const formData = new FormData();
    formData.append("file", file);
    if (currentProject?.thumbnailPath) formData.append("oldPath", currentProject.thumbnailPath);

    try {
      const res = await fetch("/api/upload-thumbnail", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setCurrentProject({ ...currentProject, thumbnailPath: data.url });
      }
    } catch (err) {} finally { setUploadingThumb(false); }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    let newProjects = [...projects];
    if (projectMode === "add") {
      newProjects.push({ ...currentProject, id: Date.now().toString(), order: projects.length + 1 });
    } else if (projectMode === "edit-form") {
      newProjects = newProjects.map(p => p.id === currentProject.id ? currentProject : p);
    }
    await saveProjects(newProjects);
    setProjectMode("menu");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    const projToDelete = projects.find(p => p.id === id);
    if (projToDelete?.thumbnailPath) {
      await fetch("/api/upload-thumbnail", {
        method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: projToDelete.thumbnailPath })
      });
    }
    await saveProjects(projects.filter(p => p.id !== id));
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const newItems = [...sortableProjects];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setSortableProjects(newItems);
  };

  const handleDragEnd = () => setDraggedIndex(null);

  const handleSaveNewOrder = async () => {
    const newlyOrderedProjects = sortableProjects.map((p, i) => ({ ...p, order: i + 1, isFeatured: i < 3 }));
    try {
      const res = await fetch('/api/projects/reorder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newlyOrderedProjects) });
      if (res.ok) { setProjects(newlyOrderedProjects); setProjectMode("menu"); } 
      else { alert("Failed to save new order to server."); }
    } catch (err) { alert("Network error. Could not save order."); }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col min-h-screen pt-12 pb-24 px-6 text-white" dir="ltr">
      {mediaModalOpen && <MediaManagerModal onClose={() => setMediaModalOpen(false)} onSelect={handleMediaSelect} uploadFolder={currentUploadFolder} />}

      {/* Header */}
      <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gold-500 tracking-wider">Montier Studio</h1>
          <p className="text-gray-400 text-sm mt-1">Management Console</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 text-sm border border-white/20 hover:border-white/50 rounded text-gray-300">Sign Out</button>
      </div>

      <div className="flex gap-8 flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex flex-col gap-2">
          <button onClick={() => setActiveTab("hero")} className={`text-left px-4 py-3 rounded transition-colors ${activeTab === 'hero' ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'text-gray-400 hover:bg-white/5'}`}>Hero Section Control</button>
          <button onClick={() => setActiveTab("about")} className={`text-left px-4 py-3 rounded transition-colors ${activeTab === 'about' ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'text-gray-400 hover:bg-white/5'}`}>About Section Control</button>
          <button onClick={() => setActiveTab("social")} className={`text-left px-4 py-3 rounded transition-colors ${activeTab === 'social' ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'text-gray-400 hover:bg-white/5'}`}>Social Media Control</button>
          <button onClick={() => setActiveTab("projects")} className={`text-left px-4 py-3 rounded transition-colors ${activeTab === 'projects' ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'text-gray-400 hover:bg-white/5'}`}>Video Projects</button>
          <button onClick={() => setActiveTab("settings")} className={`text-left px-4 py-3 rounded transition-colors ${activeTab === 'settings' ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'text-gray-400 hover:bg-white/5'}`}>Global Settings</button>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow bg-black-light border border-white/5 rounded-lg p-8">
          {loading ? <p className="text-gray-500">Loading...</p> : (
            <>
              {/* HERO TAB */}
              {activeTab === "hero" && (
                <div className="flex flex-col gap-8 max-w-3xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Hero Master Controls</h2>
                    {settingsMessage && <span className="text-sm text-gold-500">{settingsMessage}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400 font-bold">Brand Display Name</label>
                    <input type="text" value={heroSettings.brandName} onChange={(e) => setHeroSettings({...heroSettings, brandName: e.target.value})} className="bg-black-pure border border-white/10 rounded p-3 text-white focus:border-gold-500" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400 font-bold">Hero Tagline Sentence</label>
                    <textarea value={heroSettings.heroTagline} onChange={(e) => setHeroSettings({...heroSettings, heroTagline: e.target.value})} className="bg-black-pure border border-white/10 rounded p-3 text-white focus:border-gold-500 h-24" dir="rtl" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400 font-bold">Hero Subtitle Text (Optional)</label>
                    <input type="text" value={heroSettings.heroSubtitle} onChange={(e) => setHeroSettings({...heroSettings, heroSubtitle: e.target.value})} className="bg-black-pure border border-white/10 rounded p-3 text-white focus:border-gold-500" dir="rtl" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="flex flex-col gap-2 border border-white/10 p-4 rounded bg-black-pure/50">
                      <label className="text-sm text-gray-400 font-bold">Hero Main Portrait Image</label>
                      <div className="w-full aspect-[16/7] bg-black-pure border border-white/10 rounded overflow-hidden relative group">
                        {heroSettings.heroPortraitUrl ? <img src={heroSettings.heroPortraitUrl} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center w-full h-full text-gray-600 text-xs">No Image</div>}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openMediaManager("heroPortraitUrl")} className="bg-gold-500 text-black-pure px-3 py-1 rounded text-xs font-bold">Change Image</button>
                        </div>
                      </div>
                      <button onClick={() => openMediaManager("heroPortraitUrl")} className="w-full py-2 border border-white/20 hover:border-gold-500 rounded text-sm text-gray-300">Choose Existing / Upload New</button>
                    </div>
                    <div className="flex flex-col gap-2 border border-white/10 p-4 rounded bg-black-pure/50">
                      <label className="text-sm text-gray-400 font-bold">Hero Background Image</label>
                      <div className="w-full aspect-video bg-black-pure border border-white/10 rounded overflow-hidden relative group">
                        {heroSettings.heroBgUrl ? <img src={heroSettings.heroBgUrl} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center w-full h-full text-gray-600 text-xs">No Image</div>}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openMediaManager("heroBgUrl")} className="bg-gold-500 text-black-pure px-3 py-1 rounded text-xs font-bold">Change Image</button>
                        </div>
                      </div>
                      <button onClick={() => openMediaManager("heroBgUrl")} className="w-full py-2 border border-white/20 hover:border-gold-500 rounded text-sm text-gray-300">Choose Existing / Upload New</button>
                    </div>
                  </div>
                  <button onClick={handleSaveHero} disabled={savingSettings} className="mt-6 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-black-pure font-bold py-3 px-8 rounded self-start shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    {savingSettings ? "Saving..." : "Save Hero Settings"}
                  </button>
                </div>
              )}

              {/* ABOUT TAB */}
              {activeTab === "about" && (
                <div className="flex flex-col gap-8 max-w-3xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">About Section Control</h2>
                    {settingsMessage && <span className="text-sm text-gold-500">{settingsMessage}</span>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-gray-400 font-bold">Real Name</label>
                      <input type="text" value={aboutSettings.realName} onChange={(e) => setAboutSettings({...aboutSettings, realName: e.target.value})} className="bg-black-pure border border-white/10 rounded p-3 text-white focus:border-gold-500" dir="rtl" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-gray-400 font-bold">Artist Nickname</label>
                      <input type="text" value={aboutSettings.nickname} onChange={(e) => setAboutSettings({...aboutSettings, nickname: e.target.value})} className="bg-black-pure border border-white/10 rounded p-3 text-white focus:border-gold-500" dir="rtl" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400 font-bold">Portrait Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 aspect-[2/3] bg-black-pure border border-white/10 rounded overflow-hidden relative">
                        {aboutSettings.portraitUrl ? <img src={aboutSettings.portraitUrl} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center w-full h-full text-gray-600 text-xs text-center">No Img</div>}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => openMediaManager("aboutPortraitUrl", "about/portraits")} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors border border-white/5">
                          Choose Existing / Upload New
                        </button>
                        <p className="text-xs text-gray-500">Selects image via Media Library.</p>
                      </div>
                    </div>
                  </div>

                  {/* ABOUT BACKGROUND IMAGE */}
                  <div className="flex flex-col gap-2 border border-white/10 p-4 rounded bg-black-pure/50">
                    <label className="text-sm text-gray-400 font-bold">About Background Image</label>
                    <div className="flex flex-col gap-4">
                      <div className="w-full aspect-[21/9] bg-black-pure border border-white/10 rounded overflow-hidden relative group">
                        {aboutSettings.aboutBgImage ? <img src={aboutSettings.aboutBgImage} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center w-full h-full text-gray-600 text-xs">No Image</div>}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openMediaManager("aboutBgImage", "about/backgrounds")} className="bg-gold-500 text-black-pure px-3 py-1 rounded text-xs font-bold">Change Image</button>
                        </div>
                      </div>
                      <button onClick={() => openMediaManager("aboutBgImage", "about/backgrounds")} className="w-full py-2 border border-white/20 hover:border-gold-500 rounded text-sm text-gray-300 transition-colors">
                        Choose Existing / Upload New
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400 font-bold">Main Heading</label>
                    <textarea value={aboutSettings.heading} onChange={(e) => setAboutSettings({...aboutSettings, heading: e.target.value})} className="bg-black-pure border border-white/10 rounded p-3 text-white focus:border-gold-500 h-20" dir="rtl" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400 font-bold">Description Paragraph</label>
                    <textarea value={aboutSettings.paragraph} onChange={(e) => setAboutSettings({...aboutSettings, paragraph: e.target.value})} className="bg-black-pure border border-white/10 rounded p-3 text-white focus:border-gold-500 h-32" dir="rtl" />
                  </div>

                  <div className="flex flex-col gap-2 border border-white/10 p-5 rounded bg-black-pure/30">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gold-500 font-bold">Bullet Services</label>
                      <button onClick={addBullet} className="px-3 py-1 bg-gold-500 hover:bg-gold-400 text-black-pure text-xs rounded font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                        + Add New Bullet Service
                      </button>
                    </div>
                    {aboutSettings.bullets.map((bullet, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <span className="text-gold-500 font-bold w-6 shrink-0">{i + 1}.</span>
                        <input type="text" value={bullet} onChange={(e) => updateBullet(i, e.target.value)} className="flex-grow bg-black-pure border border-white/10 rounded p-2 text-white focus:border-gold-500 text-sm" dir="rtl" />
                        <button onClick={() => removeBullet(i)} className="text-red-500 hover:text-red-400 font-bold px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors shrink-0">✕</button>
                      </div>
                    ))}
                    {aboutSettings.bullets.length === 0 && <p className="text-xs text-gray-500 text-center">No bullets added.</p>}
                  </div>

                  <div className="flex flex-col gap-2 border border-white/10 p-5 rounded bg-black-pure/30">
                    <label className="text-sm text-gold-500 font-bold flex justify-between items-center mb-2">
                      <span>Tools of Craft Manager</span>
                      <button onClick={() => openMediaManager("aboutToolIcon", "about/tools")} className="px-3 py-1 bg-gold-500 hover:bg-gold-400 text-black-pure text-xs rounded font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                        + Add Tool Image
                      </button>
                    </label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {aboutSettings.tools.map((tool, index) => (
                        <div key={index} className="relative group w-16 h-16 bg-black-light border border-white/10 rounded-xl flex items-center justify-center p-2">
                          <img src={tool.icon} alt={tool.name || "Tool"} className="w-full h-full object-contain opacity-80" />
                          <button onClick={() => handleRemoveTool(index)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                        </div>
                      ))}
                      {aboutSettings.tools.length === 0 && <p className="text-xs text-gray-500">No tools added yet.</p>}
                    </div>
                  </div>

                  <button onClick={handleSaveAbout} disabled={savingSettings} className="mt-6 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-black-pure font-bold py-3 px-8 rounded self-start shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    {savingSettings ? "Saving..." : "Save About Settings"}
                  </button>
                </div>
              )}

              {/* SOCIAL TAB */}
              {activeTab === "social" && (
                <div className="flex flex-col gap-8 max-w-3xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Social Media Control</h2>
                    {settingsMessage && <span className="text-sm text-gold-500">{settingsMessage}</span>}
                  </div>
                  
                    <div className="flex flex-col gap-6 bg-black-pure/50 p-8 rounded-xl border border-white/10">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="flex items-center gap-3 w-48 shrink-0">
                        <span className="text-2xl text-gold-500">B</span>
                        <label className="text-sm font-bold text-gray-300">Behance Profile</label>
                      </div>
                      <input type="text" value={socialSettings.behanceProfile} onChange={(e) => setSocialSettings({...socialSettings, behanceProfile: e.target.value})} placeholder="https://behance.net/username" className="w-full bg-black-pure border border-white/10 rounded p-3 text-white focus:border-gold-500" dir="ltr" />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="flex items-center gap-3 w-48 shrink-0">
                        <span className="text-2xl text-gold-500">I</span>
                        <label className="text-sm font-bold text-gray-300">Instagram Profile</label>
                      </div>
                      <input type="text" value={socialSettings.instagramProfile} onChange={(e) => setSocialSettings({...socialSettings, instagramProfile: e.target.value})} placeholder="https://instagram.com/username" className="w-full bg-black-pure border border-white/10 rounded p-3 text-white focus:border-gold-500" dir="ltr" />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="flex items-center gap-3 w-48 shrink-0">
                        <span className="text-2xl text-gold-500">W</span>
                        <label className="text-sm font-bold text-gray-300">WhatsApp Number</label>
                      </div>
                      <input type="text" value={socialSettings.whatsAppNumber} onChange={(e) => setSocialSettings({...socialSettings, whatsAppNumber: e.target.value})} placeholder="+20100000000" className="w-full bg-black-pure border border-white/10 rounded p-3 text-white focus:border-gold-500" dir="ltr" />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="flex items-center gap-3 w-48 shrink-0">
                        <span className="text-2xl text-gold-500">@</span>
                        <label className="text-sm font-bold text-gray-300">Email Address</label>
                      </div>
                      <input type="text" value={socialSettings.emailAddress} onChange={(e) => setSocialSettings({...socialSettings, emailAddress: e.target.value})} placeholder="contact@example.com" className="w-full bg-black-pure border border-white/10 rounded p-3 text-white focus:border-gold-500" dir="ltr" />
                    </div>
                  </div>

                  <button onClick={handleSaveSocial} disabled={savingSettings} className="bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-black-pure font-bold py-3 px-8 rounded self-start shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    {savingSettings ? "Saving..." : "Save Social Links"}
                  </button>
                </div>
              )}

              {/* PROJECTS TAB */}
              {activeTab === "projects" && (
                <div className="flex flex-col gap-6">
                  {projectMode === "menu" && (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Video Project Management</h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div onClick={() => { setCurrentProject({ title: "", description: "", videoUrl: "", thumbnailPath: "" }); setProjectMode("add"); }} className="group p-8 border border-white/10 hover:border-gold-500 rounded-xl bg-black-pure/50 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col items-center justify-center text-center">
                          <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center text-2xl mb-4 group-hover:bg-gold-500 group-hover:text-black-pure transition-colors">+</div>
                          <h3 className="font-bold text-lg text-white">Add Video</h3>
                          <p className="text-sm text-gray-500 mt-2">Upload thumbnail and add new video link.</p>
                        </div>
                        <div onClick={() => setProjectMode("edit-list")} className="group p-8 border border-white/10 hover:border-gold-500 rounded-xl bg-black-pure/50 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col items-center justify-center text-center">
                          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">✎</div>
                          <h3 className="font-bold text-lg text-white">Edit Video</h3>
                          <p className="text-sm text-gray-500 mt-2">Modify details or replace thumbnails.</p>
                        </div>
                        <div onClick={() => setProjectMode("delete")} className="group p-8 border border-white/10 hover:border-red-500 rounded-xl bg-black-pure/50 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] flex flex-col items-center justify-center text-center">
                          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-xl mb-4 group-hover:bg-red-500 group-hover:text-white transition-colors">🗑</div>
                          <h3 className="font-bold text-lg text-white">Delete Video</h3>
                          <p className="text-sm text-gray-500 mt-2">Permanently remove videos and assets.</p>
                        </div>
                        <div onClick={() => { setSortableProjects([...projects].sort((a,b)=>a.order-b.order)); setProjectMode("sort"); }} className="group p-8 border border-white/10 hover:border-green-500 rounded-xl bg-black-pure/50 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] flex flex-col items-center justify-center text-center">
                          <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center text-xl mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors">↕</div>
                          <h3 className="font-bold text-lg text-white">Sort Videos</h3>
                          <p className="text-sm text-gray-500 mt-2">Reorder projects and update featured list.</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Add & Edit Form */}
                  {(projectMode === "add" || projectMode === "edit-form") && (
                    <form onSubmit={handleSaveProject} className="flex flex-col gap-6 max-w-2xl bg-black-pure border border-white/10 rounded-xl p-8">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{projectMode === "add" ? "Add New Video" : "Edit Video"}</h2>
                        <button type="button" onClick={() => setProjectMode(projectMode === "add" ? "menu" : "edit-list")} className="text-gray-400 hover:text-white">Cancel</button>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400 font-bold">Thumbnail Upload</label>
                        <div className="flex items-center gap-4">
                          <div className="w-32 aspect-video bg-black-light border border-white/20 rounded overflow-hidden">
                            {currentProject?.thumbnailPath ? (
                              <img src={currentProject.thumbnailPath} className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex w-full h-full items-center justify-center text-xs text-gray-600">No Img</div>
                            )}
                          </div>
                          <div className="flex flex-col items-start gap-2">
                            <button type="button" onClick={() => thumbInputRef.current?.click()} className="bg-white/10 hover:bg-white/20 px-4 py-2 text-sm rounded transition-colors disabled:opacity-50" disabled={uploadingThumb}>
                              {uploadingThumb ? "Uploading..." : "Upload Thumbnail"}
                            </button>
                            <span className="text-xs text-gray-500">Saves directly to /media/thumbnails/</span>
                            <input type="file" accept="image/*" ref={thumbInputRef} onChange={handleThumbUpload} className="hidden" />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400 font-bold">Video URL (YouTube/Vimeo)</label>
                        <input type="url" required value={currentProject?.videoUrl || ""} onChange={(e) => setCurrentProject({...currentProject, videoUrl: e.target.value})} className="bg-black-light border border-white/10 rounded p-3 text-white focus:border-gold-500" dir="ltr" />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400 font-bold">Video Title (Arabic)</label>
                        <input type="text" required value={currentProject?.title || ""} onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})} className="bg-black-light border border-white/10 rounded p-3 text-white focus:border-gold-500" dir="rtl" />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400 font-bold">Video Description (Arabic)</label>
                        <textarea required value={currentProject?.description || ""} onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})} className="bg-black-light border border-white/10 rounded p-3 text-white focus:border-gold-500 h-24" dir="rtl" />
                      </div>

                      <button type="submit" disabled={uploadingThumb} className="mt-4 bg-gold-500 hover:bg-gold-400 text-black-pure font-bold py-3 px-6 rounded transition-colors self-start disabled:opacity-50">
                        {projectMode === "add" ? "Save New Project" : "Update Project"}
                      </button>
                    </form>
                  )}

                  {/* Edit List */}
                  {projectMode === "edit-list" && (
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Select Video to Edit</h2>
                        <button onClick={() => setProjectMode("menu")} className="text-gray-400 hover:text-white text-sm">Back to Menu</button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {projects.map(p => (
                          <div key={p.id} onClick={() => { setCurrentProject(p); setProjectMode("edit-form"); }} className="group p-4 border border-white/10 rounded bg-black-pure hover:border-gold-500 cursor-pointer flex items-center gap-6 transition-colors">
                            <div className="w-32 aspect-video bg-black-light rounded overflow-hidden shrink-0">
                              <img src={p.thumbnailPath} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="flex-grow flex flex-col text-right" dir="rtl">
                              <h3 className="font-bold text-lg">{p.title}</h3>
                              <p className="text-sm text-gray-500 line-clamp-1">{p.description}</p>
                            </div>
                            <div className="shrink-0 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold px-4">Edit</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delete List */}
                  {projectMode === "delete" && (
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-red-500">Delete Video</h2>
                        <button onClick={() => setProjectMode("menu")} className="text-gray-400 hover:text-white text-sm">Back to Menu</button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {projects.map(p => (
                          <div key={p.id} className="p-4 border border-red-500/20 rounded bg-black-pure flex items-center gap-6">
                            <div className="w-32 aspect-video bg-black-light rounded overflow-hidden shrink-0">
                              <img src={p.thumbnailPath} className="w-full h-full object-cover grayscale opacity-70" />
                            </div>
                            <div className="flex-grow flex flex-col text-right" dir="rtl">
                              <h3 className="font-bold text-lg text-gray-300">{p.title}</h3>
                              <p className="text-sm text-gray-600 line-clamp-1">{p.description}</p>
                            </div>
                            <button onClick={() => handleDelete(p.id)} className="shrink-0 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-bold transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sort List */}
                  {projectMode === "sort" && (
                    <div className="flex flex-col gap-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-bold">Sort Projects Order</h2>
                          <p className="text-sm text-gray-500 mt-1">Drag and drop cards to reorder. Top 3 projects become "Featured Works".</p>
                        </div>
                        <div className="flex gap-4">
                          <button onClick={() => setProjectMode("menu")} className="text-gray-400 hover:text-white px-4 py-3 rounded border border-white/10 hover:border-white/30 transition-colors">Cancel</button>
                          <button onClick={handleSaveNewOrder} className="bg-gold-500 hover:bg-gold-400 text-black-pure font-bold px-6 py-3 rounded transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)]">SAVE NEW ORDER</button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        {sortableProjects.map((p, index) => (
                          <div 
                            key={p.id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                            className={`p-4 border rounded-xl flex items-center gap-6 cursor-grab active:cursor-grabbing transition-all ${
                              draggedIndex === index ? "opacity-50 scale-[0.98] border-gold-500" : ""
                            } ${
                              index < 3 ? "border-gold-500/50 bg-gold-500/10 shadow-[0_0_15px_rgba(212,175,55,0.1)]" : "border-white/10 bg-black-pure hover:border-white/20"
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center gap-1 border-r border-white/10 pr-6 shrink-0 w-16">
                              <span className="text-gray-600 text-xl cursor-grab active:cursor-grabbing">≡</span>
                              <span className={`font-bold text-xl ${index < 3 ? "text-gold-500" : "text-gray-500"}`}>#{index + 1}</span>
                            </div>
                            <div className="w-32 aspect-video bg-black-light rounded overflow-hidden shrink-0 shadow-lg">
                              <img src={p.thumbnailPath} className="w-full h-full object-cover pointer-events-none" />
                            </div>
                            <div className="flex-grow text-right pr-4" dir="rtl">
                              <div className="flex items-center gap-3 justify-end mb-2">
                                {index < 3 && <span className="text-xs font-bold bg-gold-500/20 text-gold-500 px-3 py-1 rounded">Featured</span>}
                                <h3 className="font-bold text-lg">{p.title}</h3>
                              </div>
                              <p className="text-sm text-gray-400 line-clamp-1 max-w-xl ml-auto">{p.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === "settings" && (
                <div className="flex flex-col gap-6">
                  <h2 className="text-xl font-bold">Global Settings</h2>
                  <div className="p-4 border border-white/10 rounded bg-black-pure text-gray-400 text-sm text-center">Settings module coming soon...</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
