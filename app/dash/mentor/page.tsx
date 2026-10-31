import ComponentsDashboardAnalytics from '@/components/dashboard/components-dashboard-analytics';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata: Metadata = {
    title: 'Analytics Admin',
};

const Analytics = () => {
    redirect("/dash/mentor/student")
    return (<></>)
};

export default Analytics;
