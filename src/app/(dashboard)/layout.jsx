import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { getUserSession } from '@/lib/core/session';

const DashboardLayout = async({ children }) => {
    const user = await getUserSession();
    const role = user?.role ?? "donor";
    return (
        <div className='flex min-h-screen flex-col lg:flex-row'>
            <DashboardSidebar userRole={role} />
            <main className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;