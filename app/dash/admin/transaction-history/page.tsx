import TransactionHistory from '@/component/E-wallet-manager/transaction-history-list';
import MySponsorList from '@/component/my-network/my-sponsor-list';
import IconBell from '@/components/icon/icon-bell';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Multiple Tables',
};

const TransactionHistoryPage = () => {
    return (
        <div>
            <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <IconBell />
                </div>
                <span className="ltr:mr-3 rtl:ml-3 ">Transaction History  </span>
               
            </div>
            <TransactionHistory />
        </div>
    );
};

export default TransactionHistoryPage;
