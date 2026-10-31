"use client"

import AdmissionApprovalList from '@/component/admission-approval/admission-approval-list';
import KYCApprovalList from '@/component/kyc-approval/kyc-approval-list';
import MySponsorList from '@/component/my-network/my-sponsor-list';
import IconBell from '@/components/icon/icon-bell';
import { Metadata } from 'next';
import React from 'react';


const KYCApprovalListPage = () => {
    return (
        <div>
            {/* <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <IconBell />
                </div>
                <span className="ltr:mr-3 rtl:ml-3 font-bold">KYC Approval List </span>
               
            </div> */}
            <KYCApprovalList />
        </div>
    );
};

export default KYCApprovalListPage;
