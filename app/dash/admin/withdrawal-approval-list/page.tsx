"use client"

import AdmissionApprovalList from '@/component/admission-approval/admission-approval-list';
import MySponsorList from '@/component/my-network/my-sponsor-list';
import WithdrawalApprovalList from '@/component/withdrawal-approval/withdrawal-approval-list';
import IconBell from '@/components/icon/icon-bell';
import { Metadata } from 'next';
import React from 'react';


const WithdrawalApprovalListPage = () => {
    return (
        <div>
            
            <WithdrawalApprovalList />
        </div>
    );
};

export default WithdrawalApprovalListPage;
