// import LevelTreeList from '@/component/level-tree-manager/level-report-details';
import LevelTreeList from '@/component/level-tree-manager/level-report';
import DownlineList from '@/component/my-network/downline-list';
import { Network } from 'lucide-react';
import { AffiliatePageHeader } from '@/components/layouts/affiliate/affiliate-ui';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Multiple Tables',
};

const LevelReportPage = () => {
    return (
        <div>
            <AffiliatePageHeader title="Level Report" icon={Network} />
            <LevelTreeList />
        </div>
    );
};

export default LevelReportPage;
