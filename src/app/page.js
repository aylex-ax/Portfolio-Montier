import fs from 'fs';
import path from 'path';
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FeaturedWorks from "@/components/sections/FeaturedWorks";
import AboutMerged from "@/components/sections/AboutMerged";

export default function Home() {
  const contentPath = path.join(process.cwd(), 'src', 'data', 'siteContent.json');
  const projectsPath = path.join(process.cwd(), 'src', 'data', 'projects.json');
  
  let siteContent = {
    brandName: "X AYLEX",
    heroTagline: "مع الفنان {BRAND_NAME} تكتسب اللقطة نبضًا فنيًا مختلفًا",
    heroSubtitle: "",
    heroPortraitUrl: "/personal portrait.jpg",
    heroBgUrl: "/background.jpg"
  };

  let projects = [];

  try {
    if (fs.existsSync(contentPath)) {
      siteContent = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    }
    if (fs.existsSync(projectsPath)) {
      projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    }
  } catch (err) {
    console.error("Error reading site data", err);
  }

  return (
    <>
      <Navigation brandName={siteContent.brandName} />
      <main className="flex-grow flex flex-col w-full overflow-hidden">
        <Hero settings={siteContent} />
        <FeaturedWorks projects={projects} />
        <AboutMerged settings={siteContent} />
      </main>
      <Footer />
    </>
  );
}
