'use client';

import { useEffect, useState } from 'react';
import { Hourglass } from 'lucide-react';
import { DashCard } from '@/components/layouts/dash-ui';
import { inr } from '@/components/layouts/affiliate/affiliate-ui';

const dateOnly = (value: string) => new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// Each referral's commission waiting out the 7-day refund hold. Hidden when nothing is on hold.
const HeldCommissions = () => {
    const [records, setRecords] = useState<any[]>([]);

    useEffect(() => {
        const fetchHeldCommissions = async () => {
            try {
                const res = await fetch('/api/dash/affiliate/held-commissions', { credentials: 'include' });
                if (!res.ok) throw new Error('Failed to fetch');

                const json = await res.json();
                setRecords(json.data || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchHeldCommissions();
    }, []);

    if (!records.length) return null;

    const total = records.reduce((sum, item) => sum + Number(item?.amount || 0), 0);

    return (
        <DashCard title="Commission on hold" icon={Hourglass} action={<span className="ml-auto text-sm font-bold text-[#0b1b33]">{inr(total)}</span>}>
            <p className="border-b border-slate-100 px-5 py-3 text-sm text-slate-500">Credited to your wallet 7 days after the payment is verified. A refund in that time cancels the commission.</p>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <th className="whitespace-nowrap px-5 py-3">Referral</th>
                            <th className="whitespace-nowrap px-5 py-3">Level</th>
                            <th className="whitespace-nowrap px-5 py-3">Amount</th>
                            <th className="whitespace-nowrap px-5 py-3">Verified on</th>
                            <th className="whitespace-nowrap px-5 py-3">Estimated credit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {records.map((item) => (
                            <tr key={item?.id}>
                                <td className="whitespace-nowrap px-5 py-3 font-medium text-[#0b1b33]">{item?.sourceUser?.fullName || item?.sourceUser?.username || '-'}</td>
                                <td className="whitespace-nowrap px-5 py-3 text-slate-600">{item?.level}</td>
                                <td className="whitespace-nowrap px-5 py-3 font-semibold text-[#0b1b33]">{inr(item?.amount)}</td>
                                <td className="whitespace-nowrap px-5 py-3 text-slate-600">{dateOnly(item?.createdAt)}</td>
                                <td className="whitespace-nowrap px-5 py-3 font-semibold text-[#0e9f4a]">{dateOnly(item?.estimated_credit_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashCard>
    );
};

export default HeldCommissions;
