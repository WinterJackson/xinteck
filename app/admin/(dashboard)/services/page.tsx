import { getServices } from "@/actions/service";
import { ServiceHeaderActions } from "@/components/admin/ServiceHeaderActions";
import { ServiceList } from "@/components/admin/services/ServiceList";
import { ServiceToolbar } from "@/components/admin/services/ServiceToolbar";
import { PageContainer, PageHeader } from "@/components/admin/ui";
import { Pagination } from "@/components/admin/ui/Pagination";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ServicesPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 12;
    const search = typeof params.search === 'string' ? params.search : undefined;

    const { data: services, page: currentPage, totalPages, total } = await getServices({ page, pageSize: limit, search });

    return (
    <PageContainer>
            <PageHeader
                title="Services"
                subtitle="Manage your service offerings and packages."
                actions={<ServiceHeaderActions />}
            />

            {/* Content List */}
            <div className="mt-6">
                <ServiceToolbar />
                <ServiceList initialServices={services} />
            </div>
            
            <div className="mt-8 flex justify-center">
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl="/admin/services"
                />
            </div>
    </PageContainer>
    );
}
