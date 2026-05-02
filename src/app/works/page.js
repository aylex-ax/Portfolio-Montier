import fs from 'fs';
import path from 'path';
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PlayableCard from "@/components/ui/PlayableCard";
import WorksGridClient from "@/components/sections/WorksGridClient";

export default function WorksPage() {
  const projectsPath = path.join(process.cwd(), 'src', 'data', 'projects.json');
  const contentPath = path.join(process.cwd(), 'src', 'data', 'siteContent.json');
  
  let projects = [];
  let siteContent = { brandName: "X AYLEX" };

  try {
    if (fs.existsSync(projectsPath)) {
      projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    }
    if (fs.existsSync(contentPath)) {
      siteContent = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    }
  } catch (err) {
    console.error("Error reading data", err);
  }

  // Sort by order
  const displayProjects = projects.sort((a, b) => a.order - b.order);

  return (
    <div className="bg-black-pure min-h-screen text-white flex flex-col">
      <Navigation brandName={siteContent.brandName} />
      
      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-4 mb-16 items-center text-center">
          <h1 className="text-xs md:text-sm font-sans tracking-[0.4em] text-gold-500 uppercase drop-shadow-md">All Works</h1>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-100 drop-shadow-lg">جميع الأعمال</h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mt-6 opacity-70" />
        </div>

        <div className="w-full">
          <WorksGridClient projects={displayProjects} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
