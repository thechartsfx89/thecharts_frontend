import LevelClubList from '@/component/level-tree-manager/club-report';
import LevelTreeList from '@/component/level-tree-manager/level-report';
import DownlineList from '@/component/my-network/downline-list';
import IconBell from '@/components/icon/icon-bell';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Multiple Tables',
};

const LevelReportPage = () => {
    return (
        <div>
            <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <IconBell />
                </div>
                <span className="ltr:mr-3 rtl:ml-3 font-bold">Club Report </span>
               
            </div>
            <LevelClubList />
        </div>
    );
};

export default LevelReportPage;
