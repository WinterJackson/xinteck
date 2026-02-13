import { BlogListClient } from "@/components/blog/BlogListClient";
import { BlogNewsletter } from "@/components/sections/BlogNewsletter";
import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { getPublicPosts } from "@/lib/public-data";
import { VIDEO_STATS } from "@/lib/videoStats";

export const metadata = {
  title: "Insights & Innovation | Xinteck Blog",
  description: "Deep dives into technology, engineering, and the future of software.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const sortedPosts = await getPublicPosts();

  return (
    <VideoScrollLayout videoSrc={VIDEO_STATS.portfolio.src} videoStats={VIDEO_STATS.portfolio}>
      <div className="flex flex-col gap-12 md:gap-24 py-12 md:py-20">
        
        {/* Client Side Search & List */}
        <BlogListClient allPosts={sortedPosts} />

        {/* Newsletter Section */}
        <section className="px-6 mb-12 md:mb-20">
          <div className="max-w-7xl mx-auto">
            <BlogNewsletter />
          </div>
        </section>
      </div>
    </VideoScrollLayout>
  );
}
