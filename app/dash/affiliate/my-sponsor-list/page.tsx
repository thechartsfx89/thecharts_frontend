"use client"

import MySponsorList from '@/component/my-network/my-sponsor-list';
import { UserPlus } from 'lucide-react';
import { AffiliatePageHeader } from '@/components/layouts/affiliate/affiliate-ui';
import { Metadata } from 'next';
import React from 'react';


const MySponsorListPage = () => {
    return (
        <div>
            <AffiliatePageHeader title="Direct Referral List" icon={UserPlus} />
            <MySponsorList />
        </div>
    );
};

export default MySponsorListPage;
