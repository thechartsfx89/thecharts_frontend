import LevelClubList from '@/component/level-tree-manager/club-report';
import LevelTreeList from '@/component/level-tree-manager/level-report';
import DownlineList from '@/component/my-network/downline-list';
import { Trophy } from 'lucide-react';
import { AffiliatePageHeader } from '@/components/layouts/affiliate/affiliate-ui';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Multiple Tables',
};

const LevelReportPage = () => {
    return (
        <div>
            <AffiliatePageHeader title="Club Report" icon={Trophy} />
            <LevelClubList />
        </div>
    );
};

export default LevelReportPage;
