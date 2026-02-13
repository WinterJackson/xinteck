import { getDashboardStats, getRecentActivity } from "@/actions/dashboard";
import { DashboardClient } from "@/components/admin/DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, activity] = await Promise.all([
    getDashboardStats(),
    getRecentActivity()
  ]);

  return <DashboardClient stats={stats} activity={activity} />;
}
