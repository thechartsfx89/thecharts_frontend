import ComponentsDashboardSales from '@/components/dashboard/components-dashboard-sales';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Affiliate Dashboard',
};

const Sales = () => {
    return  <ComponentsDashboardSales />;
    //  <ComponentsDashboardSales />;
};

export default Sales;
