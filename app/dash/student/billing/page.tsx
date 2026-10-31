import BillingHistoryList from '@/component/billing-history/billing-history-list';
import PayoutReportList from '@/component/financial-manager/payout-report-list';
import ComponentsAppsInvoicePreview from '@/components/apps/mailbox/invoice/components-apps-invoice-preview';
import IconBell from '@/components/icon/icon-bell';
import React from 'react'

export default function page() {
  // return <ComponentsAppsInvoicePreview />;
  return (
        <div>
            <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
                    <IconBell />
                </div>
                <span className="ltr:mr-3 rtl:ml-3 font-bold">Billing History</span>
               
            </div>
            <BillingHistoryList />
        </div>
    );
}
