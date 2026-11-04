import { TheChartsMark } from '@/components/pages/Landing/logo';
import { formatDateAndTime } from '@/utils/dateFormatter';
import { DashPageHeader } from '../dash-ui';

export function AffiliatePageHeader(props: React.ComponentProps<typeof DashPageHeader>) {
    return <DashPageHeader home="/dash/affiliate" {...props} />;
}

export const inr = (value: any) => `₹ ${Number(value || 0).toLocaleString('en-IN')}`;

export function TransactionRow({ item, datePrefix = '' }: { item: any; datePrefix?: string }) {
    return (
        <div className="flex items-center gap-3 px-5 py-3.5">
            <TheChartsMark className="h-9 w-9 shrink-0" />
            <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-[#0b1b33]">
                    {item?.remark ? item?.remark?.replace('<b>', '').replace('</b>', '') : `${item?.type == 'LEVEL' ? '' : item?.type} Commission by ${item?.sourceUser?.username} at ${item?.level ? `(Level${item?.level})` : ''}`}
                </div>
                <div className="mt-0.5 text-xs text-slate-500">{`${datePrefix}${item?.paidAt || item?.createdAt ? formatDateAndTime(item?.paidAt || item?.createdAt) : ''}`}</div>
            </div>
            {item?.credit > 0 && <div className="shrink-0 text-sm font-bold text-[#0e9f4a]">+ {inr(item?.credit)}</div>}
            {item?.debit > 0 && <div className="shrink-0 text-sm font-bold text-red-600">- {inr(item?.debit)}</div>}
        </div>
    );
}
