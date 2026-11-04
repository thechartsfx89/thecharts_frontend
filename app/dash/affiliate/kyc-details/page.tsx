import PayoutReportList from '@/component/financial-manager/payout-report-list';
import PayoutForm from '@/component/financial-manager/payout-request';
import { ShieldCheck } from 'lucide-react';
import { AffiliatePageHeader } from '@/components/layouts/affiliate/affiliate-ui';
import { Metadata } from 'next';
import React from 'react';
import KYCUploadDocument from './kyc-details';

export const metadata: Metadata = {
    title: 'Multiple Tables',
};

const MyProfilePage = () => {
    return (
        <div>
            <AffiliatePageHeader title="Upload KYC Document" icon={ShieldCheck} />
            <KYCUploadDocument />
        </div>
    );
};

export default MyProfilePage;
