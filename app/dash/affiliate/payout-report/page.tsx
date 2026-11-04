import PayoutReportList from '@/component/financial-manager/payout-report-list';
import PayoutForm from '@/component/financial-manager/payout-request';
import { FileText } from 'lucide-react';
import { AffiliatePageHeader } from '@/components/layouts/affiliate/affiliate-ui';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Multiple Tables',
};

const PayoutReportPage = () => {
    return (
        <div>
            <AffiliatePageHeader title="Financial Manager" icon={FileText} />
            <PayoutReportList />
        </div>
    );
};

export default PayoutReportPage;
