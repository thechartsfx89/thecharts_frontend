"use client"

import LevelManager from '@/component/level-manager/level-manager';
import LevelMangerDetailsList from '@/component/level-tree-manger-details/level-report-details';
// import LevelMangerDetailsList from '@/component/level-tree-manager/level-report';
import { IconBell } from '@tabler/icons-react';
import React from 'react';

const LevelManagerDetailsPage = () => {
    return (
        <div>
            <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <IconBell />
                </div>
                <span className="ltr:mr-3 rtl:ml-3 font-bold">Report Level Manager </span>
               
            </div>
            <LevelMangerDetailsList/>
        </div>
    );
};

export default LevelManagerDetailsPage;
