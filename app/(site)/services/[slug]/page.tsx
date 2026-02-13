import { ServicePageClient } from "@/components/services/ServicePageClient";
import { getPublicService } from "@/lib/public-data";
import { notFound } from "next/navigation";

// export const dynamic = "force-static";
// export async function generateStaticParams() { ... }

export default async function ServiceDynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getPublicService(slug);

  if (!service) {
    notFound();
  }

  // ServicePageClient currently expects 'slug' and uses SERVICES_DATA.
  // We need to refactor ServicePageClient to accept "service data" directly.
  // For now, let's look at ServicePageClient. It is a Client Component.
  // We should pass the service object.
  // But wait, ServicePageClient imports SERVICES_DATA.
  // We must refactor ServicePageClient as well.
  
  return <ServicePageClient service={service} />;
}
