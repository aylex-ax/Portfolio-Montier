"use client";
import PlayableCard from "@/components/ui/PlayableCard";
import Link from "next/link";

export default function FeaturedWorks({ projects }) {
  // Admin Data Structure Mockup
  const mockProjects = [
    {
      id: "1",
      title: "الحملة الإعلانية للسيارات الفاخرة",
      thumbnailUrl: "/background.jpg",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "تحرير سينمائي متقدم مع تصحيح ألوان دقيق لإبراز فخامة التفاصيل. تم العمل باستخدام DaVinci Resolve.",
      isFeatured: true,
      orderNumber: 1
    },
    {
      id: "2",
      title: "فيلم وثائقي قصير: عبق الماضي",
      thumbnailUrl: "/personal portrait.jpg",
      videoUrl: "https://vimeo.com/76979871",
      description: "مونتاج سردي يركز على إيقاع القصة ودمج المؤثرات الصوتية لخلق تجربة غامرة وتاريخية.",
      isFeatured: true,
      orderNumber: 2
    },
    {
      id: "3",
      title: "إعلان أزياء راقي",
      thumbnailUrl: "/background.jpg",
      videoUrl: "https://www.youtube.com/watch?v=1La4QzGeaaQ",
      description: "تعديل ديناميكي يتزامن مع الإيقاع الموسيقي، مصمم خصيصاً لمنصات العرض الفاخرة لجذب الجمهور.",
      isFeatured: true,
      orderNumber: 3
    }
  ];

  // Filter and limit to 3 featured projects
  const activeProjects = projects?.length ? projects : mockProjects;
  const displayProjects = activeProjects
    .filter(p => p.isFeatured)
    .sort((a, b) => (a.order || a.orderNumber) - (b.order || b.orderNumber))
    .slice(0, 3);

  return (
    <section className="w-full py-32 bg-black-pure text-white relative border-t border-white/5" id="works">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-24 items-center text-center">
          <h2 className="text-xs md:text-sm font-sans tracking-[0.4em] text-gold-500 uppercase drop-shadow-md">Featured Works</h2>
          <h3 className="text-4xl md:text-6xl font-bold text-gray-100 drop-shadow-lg">أبرز الأعمال</h3>
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mt-6 opacity-70" />
        </div>

        {/* 3 Featured Projects List */}
        <div className="flex flex-col gap-32">
          {displayProjects.map((project, index) => (
            <PlayableCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* View More Works Gateway Button */}
        <div className="mt-32 flex justify-center">
          <Link href="/works">
            <button className="px-12 py-5 border border-gold-500/40 hover:border-gold-500 text-gold-400 hover:text-white font-bold rounded-sm tracking-widest transition-all duration-500 bg-black-pure/50 hover:bg-gold-500/10 hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:-translate-y-1">
              Show All Projects
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
