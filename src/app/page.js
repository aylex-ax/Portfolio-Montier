import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FeaturedWorks from "@/components/sections/FeaturedWorks";
import AboutMerged from "@/components/sections/AboutMerged";
import { getSiteContent, getProjects } from "@/lib/api";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [fetchedSiteContent, fetchedProjects] = await Promise.all([
    getSiteContent(),
    getProjects()
  ]);

  const siteContent = fetchedSiteContent || {
    brandName: "X AYLEX",
    heroTagline: "مع الفنان {BRAND_NAME} تكتسب اللقطة نبضًا فنيًا مختلفًا",
    heroSubtitle: "",
    heroPortraitUrl: "/personal portrait.jpg",
    heroBgUrl: "/background.jpg"
  };

  const projects = fetchedProjects || [];

  return (
    <>
      <Navigation brandName={siteContent?.brandName || "X AYLEX"} />
      <main className="flex-grow flex flex-col w-full overflow-hidden">
        <Hero settings={siteContent} />
        <FeaturedWorks projects={projects} />
        <AboutMerged settings={siteContent} />
      </main>
      <Footer />
    </>
  );
}
