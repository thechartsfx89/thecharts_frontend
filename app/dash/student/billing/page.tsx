import BillingHistoryList from '@/component/billing-history/billing-history-list';
import { DashPageHeader } from '@/components/layouts/student/dash-ui';
import { ReceiptText } from 'lucide-react';
import React from 'react'

export default function page() {
  return (
        <div>
            <DashPageHeader title="Billing History" icon={ReceiptText} />
            <BillingHistoryList />
        </div>
    );
}
