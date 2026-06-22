import React from 'react';

const DashboardLayout = ({ children }) => {
    return (
        <div className='flex min-h-screen'>
            {children}
        </div>
    );
};

export default DashboardLayout;