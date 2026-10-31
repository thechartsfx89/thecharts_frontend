import ComponentsDashboardAnalytics from '@/components/dashboard/components-dashboard-analytics';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Student Dashboard',
};

const Sales = () => {
    return  <ComponentsDashboardAnalytics />
};

export default Sales;
