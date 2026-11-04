import TransactionHistory from '@/component/E-wallet-manager/transaction-history-list';
import MySponsorList from '@/component/my-network/my-sponsor-list';
import { ReceiptText } from 'lucide-react';
import { AffiliatePageHeader } from '@/components/layouts/affiliate/affiliate-ui';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Multiple Tables',
};

const TransactionHistoryPage = () => {
    return (
        <div>
            <AffiliatePageHeader title="Transaction History" icon={ReceiptText} />
            <TransactionHistory />
        </div>
    );
};

export default TransactionHistoryPage;
