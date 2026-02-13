import { getProjects } from "@/actions/project";
import { ProjectManager } from "@/components/admin/ProjectManager";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;

  const result = await getProjects({ page, pageSize: limit, search, category });
  
  return <ProjectManager initialData={result} />;
}
