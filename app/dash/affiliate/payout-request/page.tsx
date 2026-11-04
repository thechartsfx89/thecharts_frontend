import PayoutForm from '@/component/financial-manager/payout-request';
import { Banknote } from 'lucide-react';
import { AffiliatePageHeader } from '@/components/layouts/affiliate/affiliate-ui';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Multiple Tables',
};

const PayoutRequestPage = () => {
    return (
        <div>
            <AffiliatePageHeader title="Financial Manager" icon={Banknote} />
            <PayoutForm />
        </div>
    );
};

export default PayoutRequestPage;
