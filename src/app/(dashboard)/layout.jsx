import DashboardHeader from '@/components/dashboard/DashboardHeader';
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
            <div className='flex min-w-0 flex-1 flex-col'>
                <DashboardHeader user={user} />
                <main className='flex-1 p-4 sm:p-6 lg:p-8'>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;