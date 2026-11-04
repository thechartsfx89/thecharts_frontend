'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ArrowDownLeft, ArrowRight, ArrowUpRight, ChartSpline, IndianRupee, Layers, PieChart, ReceiptText, Trophy, UserPlus, Users, Wallet } from 'lucide-react';
import { getImageUrl, getRandomColor, getTextColor } from '@/utils/common/common';
import { formatDateUTC } from '@/utils/dateFormatter';
import { DashCard, DashEmpty } from '@/components/layouts/dash-ui';
import { AffiliatePageHeader, TransactionRow, inr } from '@/components/layouts/affiliate/affiliate-ui';
import HeldCommissions from '@/component/E-wallet-manager/held-commissions';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const INK = '#0b1b33';
const GREEN = '#16c75f';

function Avatar({ user, size = 'h-9 w-9' }: { user: any; size?: string }) {
    const image = user?.profile_image?.url
        ? `${getImageUrl(user?.profile_image?.url)}?t=${Date.now()}`
        : user?.profile_img_path
          ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/${user?.profile_img_path}`
          : null;
    if (image) return <img src={image} className={`${size} shrink-0 rounded-full object-cover`} alt="" />;
    const bg = getRandomColor(user?.id);
    return (
        <span className={`${size} flex shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase`} style={{ backgroundColor: bg, color: getTextColor(bg) }}>
            {user?.fullName
                ?.split(' ')
                .map((name: any) => name[0])
                .slice(0, 2)
                .join('')}
        </span>
    );
}

function StatCard({ title, value, icon: Icon, loading, href, extra }: { title: string; value: React.ReactNode; icon: typeof Users; loading: boolean; href?: string; extra?: React.ReactNode }) {
    return (
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    {loading ? <div className="mt-2 h-8 w-28 animate-pulse rounded-lg bg-slate-200" /> : <p className="tc-serif mt-1 truncate text-2xl font-black text-[#0b1b33] xl:text-3xl">{value}</p>}
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0b1b33] text-[#16c75f]">
                    <Icon className="h-6 w-6" />
                </span>
            </div>
            {(href || extra) && (
                <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-sm">
                    <span className="text-slate-500">{extra}</span>
                    {href && (
                        <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#0e9f4a] hover:underline">
                            View Report <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}

const ViewMore = ({ href }: { href: string }) => (
    <Link href={href} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#0e9f4a] hover:underline">
        View More <ArrowRight className="h-3.5 w-3.5" />
    </Link>
);

export default function AffiliateDashboard() {
    const { data: session } = useSession<any>();

    const [directReferralData, setDirectReferralData] = useState<any[]>([]);
    const [statsGraphData, setStatsGraphData] = useState<any>(null);
    const [transHistoryData, setTransHistoryData] = useState<any[]>([]);
    const [walletByCategory, setWalletByCategory] = useState<any>(null);
    const [allDownlineData, setAllDownlineData] = useState<any[]>([]);
    const [affiliateCountData, setAffiliateCountData] = useState<any>(null);
    const [wallet, setWallet] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { LEVEL_INCOME, CLUB_INCOME } = walletByCategory || {};

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const [txRes, walletRes, directReferralRes, allDownlineRes, statsGraphRes, affiliateCountRes] = await Promise.all([
                    fetch(`/api/dash/affiliate/transaction-history?page=1&pageSize=5&sort=createdAt:desc`, { credentials: 'include' }),
                    fetch(`/api/dash/affiliate/wallet/my-wallet`, { credentials: 'include' }),
                    fetch('/api/dash/affiliate/direct-referral', { method: 'GET', credentials: 'include' }),
                    fetch('/api/dash/affiliate/downline', { method: 'GET', credentials: 'include' }),
                    fetch('/api/dash/affiliate/dashboard/statsGraph', { method: 'GET', credentials: 'include' }),
                    fetch('/api/dash/affiliate/dashboard/affiliateDetails', { method: 'GET', credentials: 'include' }),
                ]);

                if (!txRes.ok || !walletRes.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }

                const [txData, walletData, directReferral, allDownline, statsGraph, affiliateCount] = await Promise.all([
                    txRes.json(),
                    walletRes.json(),
                    directReferralRes.json(),
                    allDownlineRes.json(),
                    statsGraphRes.json(),
                    affiliateCountRes.json(),
                ]);

                setTransHistoryData(txData?.data || []);
                setDirectReferralData(directReferral?.data?.users || []);
                setAllDownlineData(allDownline?.data?.data?.users || []);
                setStatsGraphData(statsGraph?.data?.data || null);
                setWallet(walletData?.data?.grand_total || null);
                setWalletByCategory(walletData?.data?.by_category || null);
                setAffiliateCountData(affiliateCount?.data || null);
            } catch (err) {
                console.error('Dashboard fetch failed:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const commissionChart: any = {
        series: [
            { name: 'Level', data: statsGraphData?.map((item: any) => item.LEVEL) ?? [] },
            { name: 'Club', data: statsGraphData?.map((item: any) => item.CLUB) ?? [] },
        ],
        options: {
            chart: { type: 'area', fontFamily: 'inherit', zoom: { enabled: false }, toolbar: { show: false } },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 2 },
            colors: [INK, GREEN],
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: { axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: '#64748b', fontSize: '12px' } } },
            yaxis: {
                tickAmount: 4,
                min: 0,
                forceNiceScale: true,
                labels: {
                    formatter: (value: number) => (value >= 1000 ? `${value / 1000}K` : `${Math.round(value)}`),
                    style: { colors: '#64748b', fontSize: '12px' },
                },
            },
            grid: { borderColor: '#e2e8f0', strokeDashArray: 4, xaxis: { lines: { show: false } } },
            legend: { position: 'top', horizontalAlign: 'right', fontSize: '13px', markers: { width: 10, height: 10 } },
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.22, opacityTo: 0.02, stops: [0, 100] } },
        },
    };

    const earningChart: any = {
        series: [Number(LEVEL_INCOME?.net ?? 0), Number(CLUB_INCOME?.net ?? 0)],
        options: {
            chart: { type: 'donut', fontFamily: 'inherit' },
            dataLabels: { enabled: false },
            stroke: { width: 4, colors: ['#ffffff'] },
            colors: [INK, GREEN],
            labels: ['Level', 'Club'],
            legend: { position: 'bottom', fontSize: '13px', markers: { width: 10, height: 10 } },
            plotOptions: {
                pie: {
                    donut: {
                        size: '72%',
                        labels: {
                            show: true,
                            value: { fontSize: '20px', fontWeight: 700, color: INK, formatter: (val: any) => inr(val) },
                            total: { show: true, label: 'Total', color: '#64748b', fontSize: '13px', formatter: () => inr(wallet?.total_earned) },
                        },
                    },
                },
            },
            states: { hover: { filter: { type: 'none' } }, active: { filter: { type: 'none' } } },
        },
    };

    return (
        <div className="space-y-6">
            <AffiliatePageHeader title="Dashboard" crumbs={false} />

            {/* Headline numbers */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Total Team Size" value={affiliateCountData?.totalHierarchyCount ?? 0} icon={Users} loading={loading} href="/dash/affiliate/genealogy" extra={<>Total Admission <b className="font-semibold text-[#0b1b33]">{affiliateCountData?.totalActiveCount ?? 0}</b></>} />
                <StatCard title="Total Income" value={inr(wallet?.total_earned)} icon={IndianRupee} loading={loading} href="/dash/affiliate/wallet" />
                <StatCard title="Level Income" value={inr(LEVEL_INCOME?.net)} icon={Layers} loading={loading} href="/dash/affiliate/level-report" />
                <StatCard title="Club Income" value={inr(CLUB_INCOME?.net)} icon={Trophy} loading={loading} href="/dash/affiliate/club-report" />
            </div>

            <HeldCommissions />

            <div className="grid gap-6 xl:grid-cols-3">
                {/* Commission */}
                <DashCard title="Commission" icon={ChartSpline} className="xl:col-span-2">
                    <div className="p-5">
                        <p className="text-sm text-slate-500">
                            Total Earning <span className="tc-serif ml-2 text-xl font-black text-[#0b1b33]">{inr(wallet?.total_earned)}</span>
                        </p>
                        <ReactApexChart series={commissionChart.series} options={commissionChart.options} type="area" height={325} width="100%" />
                    </div>
                </DashCard>

                {/* Wallet */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="tc-grid-bg relative overflow-hidden bg-[#0b1b33] p-6 pb-16 text-white">
                        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#16c75f]/20 blur-3xl" />
                        <div className="relative">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-2.5">
                                    <Avatar user={{ id: session?.user?.id, fullName: session?.user?.fullName, profile_img_path: session?.user?.profile_img_path, profile_image: session?.user?.profileImage ? { url: session?.user?.profileImage } : null }} />
                                    <span className="truncate text-sm font-semibold">{session?.user?.fullName ?? ''}</span>
                                </div>
                                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${wallet ? 'bg-[#16c75f]/15 text-[#16c75f]' : 'bg-white/10 text-white/70'}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${wallet ? 'bg-[#16c75f]' : 'bg-white/60'}`} />
                                    {wallet ? 'Active' : 'Pending'}
                                </span>
                            </div>
                            <p className="mt-6 text-sm text-white/65">Wallet Balance</p>
                            {loading ? <div className="mt-2 h-9 w-40 animate-pulse rounded-lg bg-white/15" /> : <p className="tc-serif mt-1 text-3xl font-black">{inr(wallet?.wallet_balance)}</p>}
                        </div>
                    </div>

                    <div className="relative -mt-10 grid grid-cols-2 gap-3 px-5">
                        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                            <span className="flex items-center justify-between text-xs font-medium text-slate-500">
                                Received <ArrowDownLeft className="h-4 w-4 text-[#0e9f4a]" />
                            </span>
                            <p className="mt-1.5 truncate font-bold text-[#0b1b33]">{inr(wallet?.total_earned)}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                            <span className="flex items-center justify-between text-xs font-medium text-slate-500">
                                Withdraw <ArrowUpRight className="h-4 w-4 text-red-500" />
                            </span>
                            <p className="mt-1.5 truncate font-bold text-[#0b1b33]">{inr(wallet?.total_debit)}</p>
                        </div>
                    </div>

                    <div className="p-5">
                        <dl className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <dt className="text-slate-500">Level</dt>
                                <dd className="font-semibold text-[#0b1b33]">{inr(LEVEL_INCOME?.net)}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-slate-500">Club</dt>
                                <dd className="font-semibold text-[#0b1b33]">{inr(CLUB_INCOME?.net)}</dd>
                            </div>
                        </dl>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <Link href="/dash/affiliate/wallet" className="inline-flex items-center justify-center rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-[#0b1b33] transition hover:border-[#0b1b33]">
                                View Details
                            </Link>
                            <Link href="/dash/affiliate/payout-request" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#16c75f] py-2.5 text-sm font-semibold text-[#0b1b33] transition hover:bg-[#2fe079]">
                                <Wallet className="h-4 w-4" /> Withdraw
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                {/* Transactions */}
                <DashCard title="Transactions" icon={ReceiptText} className="xl:col-span-2" action={<ViewMore href="/dash/affiliate/transaction-history" />}>
                    {transHistoryData.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {transHistoryData.map((item) => (
                                <TransactionRow key={item?.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <DashEmpty icon={ReceiptText} title="No data available." />
                    )}
                </DashCard>

                {/* Earning by commission */}
                <DashCard title="Earning by commission" icon={PieChart}>
                    <div className="p-4">
                        <ReactApexChart series={earningChart.series} options={earningChart.options} type="donut" height={320} width="100%" />
                    </div>
                </DashCard>
            </div>

            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
                {/* Direct Referral */}
                <DashCard title="Direct Referral" icon={UserPlus} action={<ViewMore href="/dash/affiliate/my-sponsor-list" />}>
                    {directReferralData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left">
                                        <th className="px-5 py-3">Name</th>
                                        <th className="px-5 py-3">Username</th>
                                        <th className="px-5 py-3">Registration</th>
                                        <th className="px-5 py-3">Member</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {directReferralData.slice(0, 5).map((data, index) => (
                                        <tr key={`${index}_sponsor`}>
                                            <td className="min-w-[180px] px-5 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <Avatar user={data?.user} />
                                                    <span className="whitespace-nowrap font-medium text-[#0b1b33]">{data?.user?.fullName}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">{data?.user?.username}</td>
                                            <td className="whitespace-nowrap px-5 py-3">{formatDateUTC(data?.user?.createdAt ?? '')}</td>
                                            <td className="px-5 py-3 font-semibold text-[#0b1b33]">{data?.downlineCount ?? 0}</td>
                                            <td className="px-5 py-3">
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${data?.user?.status ? 'bg-[#e9f8ef] text-[#0e9f4a]' : 'bg-amber-50 text-amber-700'}`}>{data?.user?.status ? 'Activated' : 'Not Active'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <DashEmpty icon={UserPlus} title="No data available." />
                    )}
                </DashCard>

                {/* Indirect Referral */}
                <DashCard title="Indirect Referral" icon={Users} action={<ViewMore href="/dash/affiliate/downline-list" />}>
                    {allDownlineData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left">
                                        <th className="px-5 py-3">Name</th>
                                        <th className="px-5 py-3">Username</th>
                                        <th className="px-5 py-3">Registration</th>
                                        <th className="px-5 py-3">Level</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {allDownlineData.slice(0, 5).map((data, index) => (
                                        <tr key={`${index}_downline`}>
                                            <td className="min-w-[180px] px-5 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <Avatar user={data?.user} />
                                                    <span className="whitespace-nowrap font-medium text-[#0b1b33]">{data?.user?.fullName}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">{data?.user?.username}</td>
                                            <td className="whitespace-nowrap px-5 py-3">{formatDateUTC(data?.user?.createdAt ?? '')}</td>
                                            <td className="whitespace-nowrap px-5 py-3">
                                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-[#0b1b33]">Level {data?.level}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <DashEmpty icon={Users} title="No data available." />
                    )}
                </DashCard>
            </div>
        </div>
    );
}
