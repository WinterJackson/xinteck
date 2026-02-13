import { getAuditEntities, getAuditLogs } from "@/actions/audit";
import { AuditFilters } from "@/components/admin/AuditFilters";
import { AuditLogTable } from "@/components/admin/AuditLogTable";
import { PageContainer, PageHeader } from "@/components/admin/ui";
import { requireRole } from "@/lib/auth-check";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AuditPage({ 
  searchParams 
}: { 
  searchParams: { page?: string; action?: string; entity?: string; dateFrom?: string; dateTo?: string } 
}) {
  await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

  const page = Number(searchParams.page) || 1;
  const action = searchParams.action;
  const entity = searchParams.entity;
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;

  const [{ data, totalPages, currentPage, total }, entities] = await Promise.all([
    getAuditLogs({ page, limit: 15, action, entity, dateFrom, dateTo }),
    getAuditEntities(),
  ]);

  return (
    <PageContainer>
      <PageHeader 
        title="Audit Log" 
        subtitle={`System activity tracking. Total Events: ${total}`}
      />

      {/* Filters */}
      <AuditFilters 
        entities={entities}
        currentAction={action}
        currentEntity={entity}
        currentDateFrom={dateFrom}
        currentDateTo={dateTo}
      />

      {/* Main Table */}
      <AuditLogTable 
        logs={data} 
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </PageContainer>
  );
}
