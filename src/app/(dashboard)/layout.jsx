import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

const DashboardLayout = async({ children }) => {
    return (
        <div className='flex min-h-screen bg-(--pl-bg)'>
            <DashboardSidebar />
            <main className='min-w-0 flex-1 p-4 sm:p-6 lg:p-8'>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;