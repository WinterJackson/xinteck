import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { getPublicProject } from "@/lib/public-data";
import { VIDEO_STATS } from "@/lib/videoStats";
import { ChevronLeft, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// export const dynamic = "force-static"; 
// export async function generateStaticParams() { ... }

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const project = await getPublicProject(slug);
    if (!project) return { title: "Project Not Found" };
    return {
      title: project.title,
      description: project.description,
    };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const project = await getPublicProject(slug);

  if (!project) {
      notFound();
  }

  return (
    <VideoScrollLayout videoSrc={VIDEO_STATS.portfolio.src} videoStats={VIDEO_STATS.portfolio}>
      <article className="py-20 px-6 max-w-5xl mx-auto">
      <Link 
        href="/portfolio" 
        className="flex items-center gap-2 text-gold font-bold mb-12 hover:-translate-x-2 transition-transform w-fit"
      >
        <ChevronLeft size={20} /> Back to Projects
      </Link>
      
      <div className="grid lg:grid-cols-3 gap-16 mb-24">
        <header className="lg:col-span-2 flex flex-col gap-8 text-left">
          <div className="flex flex-wrap items-center gap-6 text-sm text-foreground/40 font-bold uppercase tracking-[0.2em]">
             <span className="text-gold">{project.category}</span>
             <span>{project.year}</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            {project.title}
          </h1>
          
          <p className="text-2xl text-foreground/60 leading-relaxed max-w-2xl">
            {project.description}
          </p>

          <div className="flex gap-4 mt-4">
             <button className="px-8 py-2 bg-primary text-black font-black rounded-full hover:bg-gold-hover transition-all flex items-center gap-3">
                Live View <ExternalLink size={18} />
             </button>
             <button className="px-8 py-2 border border-primary/20 text-foreground/60 font-bold rounded-full hover:text-gold hover:border-gold transition-all flex items-center gap-3">
                Source <Github size={18} />
             </button>
          </div>
        </header>

        <aside className="lg:col-span-1 bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 rounded-[2.5rem] p-10 flex flex-col gap-8 h-fit shadow-lg">
           <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">The Mission</span>
              <p className="font-bold text-lg">{project.client}</p>
           </div>
           <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">Our Contribution</span>
              <p className="font-bold text-lg">{project.role}</p>
           </div>
           <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">Core Stack</span>
              <div className="flex flex-wrap gap-2">
                 {project.tags?.map((tag: string) => (
                   <span key={tag} className="px-3 py-1 rounded-md bg-background border border-primary/10 text-[10px] font-bold text-foreground/40">
                      {tag}
                   </span>
                 ))}
              </div>
           </div>
        </aside>
      </div>

      <div className="prose prose-invert prose-gold max-w-none 
        prose-headings:font-black prose-headings:tracking-tighter prose-headings:italic
        prose-p:text-foreground/70 prose-p:text-xl prose-p:leading-relaxed
        prose-strong:text-gold prose-a:text-gold hover:prose-a:underline
        prose-blockquote:border-l-gold prose-blockquote:bg-primary/5 prose-blockquote:p-12 prose-blockquote:rounded-[10px] prose-blockquote:italic prose-blockquote:text-lg
        prose-li:text-foreground/70 prose-img:rounded-[10px] prose-img:border prose-img:border-primary/20"
        dangerouslySetInnerHTML={{ __html: project.content || "" }}
      />

      <div className="mt-32 pt-16 border-t border-primary/10 text-center">
         <h4 className="text-4xl font-black tracking-tighter mb-8">READY TO SCALE?</h4>
         <Link href="/contact" className="px-12 py-3 bg-primary text-black font-black text-xl rounded-full hover:bg-gold-hover transition-all inline-block shadow-2xl shadow-primary/20">
            Start Your Project
         </Link>
      </div>
    </article>
  </VideoScrollLayout>
  );
}
