import AffiliateDashboard from '@/components/dashboard/affiliate-dashboard';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Affiliate Dashboard',
};

const Sales = () => {
    return <AffiliateDashboard />;
};

export default Sales;
