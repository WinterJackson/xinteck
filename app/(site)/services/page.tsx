import ServicesClient from "@/components/services/ServicesClient";
import { getPublicServices } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getPublicServices();
  
  return <ServicesClient services={services} />;
}
