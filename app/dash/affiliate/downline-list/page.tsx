import DownlineList from '@/component/my-network/downline-list';
import { Users } from 'lucide-react';
import { AffiliatePageHeader } from '@/components/layouts/affiliate/affiliate-ui';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Multiple Tables',
};

const DownlineListPage = () => {
    return (
        <div>
            <AffiliatePageHeader title="Downline List" icon={Users} />
            <DownlineList />
        </div>
    );
};

export default DownlineListPage;
