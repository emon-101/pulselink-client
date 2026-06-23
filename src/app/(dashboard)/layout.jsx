import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { getUserSession } from '@/lib/core/session';
import { redirect } from 'next/navigation';

const DashboardLayout = async({ children }) => {
    const user = await getUserSession();
    if(!user) {
        return redirect('/auth/login');
    }
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