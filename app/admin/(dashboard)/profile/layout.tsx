import { PageContainer } from "@/components/admin/ui";
import { ProfileHeader } from "./_components/ProfileHeader";
import { ProfileTabs } from "./_components/ProfileTabs";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <PageContainer>
            <ProfileHeader />
            <ProfileTabs />
            <div className="layout-content flex flex-col items-center w-full">
                <div className="w-full">
                    {children}
                </div>
            </div>
        </PageContainer>
    );
}
