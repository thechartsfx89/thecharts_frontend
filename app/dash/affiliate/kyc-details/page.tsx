import PayoutReportList from '@/component/financial-manager/payout-report-list';
import PayoutForm from '@/component/financial-manager/payout-request';
import IconBell from '@/components/icon/icon-bell';
import { Metadata } from 'next';
import React from 'react';
import KYCUploadDocument from './kyc-details';

export const metadata: Metadata = {
    title: 'Multiple Tables',
};

const MyProfilePage = () => {
    return (
        <div>
            <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <IconBell />
                </div>
                <span className="ltr:mr-3 rtl:ml-3 font-bold">Upload KYC Document</span>
               
            </div>
            <KYCUploadDocument />
        </div>
    );
};

export default MyProfilePage;
