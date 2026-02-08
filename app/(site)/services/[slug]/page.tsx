// Forces cache invalidation for Next.js build
import { ServicePageClient } from "@/components/services/ServicePageClient";
import { SERVICES_DATA } from "@/lib/services-data";
import { notFound } from "next/navigation";

// Generate static params for SSG
export function generateStaticParams() {
  return Object.keys(SERVICES_DATA).map((slug) => ({
    slug,
  }));
}

export default async function ServiceDynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Verify slug validity on server
  if (!SERVICES_DATA[slug as keyof typeof SERVICES_DATA]) {
    notFound();
  }

  return <ServicePageClient slug={slug} />;
}
