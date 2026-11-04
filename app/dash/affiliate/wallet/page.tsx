"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ArrowRight, Banknote, DollarSign, PieChart, ReceiptText, ShoppingBag, Wallet } from "lucide-react";
// import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux'
import { IRootState } from '@/store'
import dynamic from 'next/dynamic'
import { formatDateAndTime } from '@/utils/dateFormatter'
import { AccountDashboardSkeleton } from './walletSkelton'
import { DashCard, DashEmpty } from '@/components/layouts/dash-ui'
import { AffiliatePageHeader, TransactionRow } from '@/components/layouts/affiliate/affiliate-ui'
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function page() {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);


    const [initialRecords, setInitialRecords] = useState([]);
    // const [records, setRecords] = useState(initialRecords);
    const [search, setSearch] = useState('');
    const [wallet, setWallet] = useState(null)
    const [myWallet, setMyWallet] = useState(null)

    const [loading, setLoading] = useState(true);
    // console.log({ wallet })
    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const [txRes, myWalletRes] = await Promise.all([
                fetch(
                    `/api/dash/affiliate/transaction-history?page=1&pageSize=5&sort=createdAt:desc`,
                    { credentials: "include" }
                ),
                //   fetch(`/api/dash/affiliate/wallet`, {
                //     credentials: "include",
                //   }),
                fetch(`/api/dash/affiliate/wallet/my-wallet`, {
                    credentials: "include",
                }),
            ]);

            if (!txRes.ok || !myWalletRes.ok) {
                throw new Error("Failed to fetch dashboard data");
            }

            const [txData, myWalletData] = await Promise.all([
                txRes.json(),

                myWalletRes.json()
            ]);

            // 🧾 Transaction History (recent 5)
            setInitialRecords(txData?.data || []);

            // 💰 Wallet
            // setWallet(walletData?.data || null);
            setMyWallet(myWalletData?.data?.grand_total || null);
            // console.log("My Wallet API response:", myWalletData); // Debug log to check the structure

        } catch (err) {
            console.error("Dashboard fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    //     const fetchTransactionHistory = async () => {
    //         try {
    //             setLoading(true);
    //        const res = await fetch(
    //   `/api/dash/affiliate/transaction-history?page=1&pageSize=5&sort=createdAt:desc`,
    //   {
    //     credentials: 'include',
    //   }
    // );


    //             if (!res.ok) {
    //                 throw new Error("Failed to fetch data");
    //             }

    //             const data = await res.json();
    //             setInitialRecords(data?.data || []);
    //             setLoading(false);

    //             // console.log(data?.data?.members?.users , ">>>>>>")
    //         } catch (err) {
    //             console.error("Data fetch failed:", err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     useEffect(() => {
    //         fetchTransactionHistory()
    //     }, [])

    // const totalCommissionAmount = initialRecords?.reduce((acc: number, item: any) => {
    //     return acc + Number(item?.amount || 0);
    // }, 0);
    // console.log({totalCommissionAmount})
    const walletBalance = myWallet?.wallet_balance ?? "";
    const withdrawnAmount = myWallet?.total_debit ?? "";

    const salesByCategory: any = {
        series: [walletBalance, withdrawnAmount],
        options: {
            chart: {
                type: 'donut',
                height: 300,
                fontFamily: 'inherit',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 4,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: ['#16c75f', '#0b1b33'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '13px',
                labels: {
                    colors: isDark ? '#bfc9d4' : '#000',
                },
                markers: {
                    width: 14,
                    height: 14,
                    offsetX: -2,
                },
                
            },
            labels: ['Wallet Balance', 'Withdrawn'],
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '18px',
                                fontWeight: 'bold',
                            },
                            value: {
                                show: true,
                                fontSize: '14px',
                                fontWeight: 'bold',
                                formatter: (val: number) => `₹${Number(val).toLocaleString()}`,
                            },
                            total: {
                                show: true,
                                label: 'Total Earned',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                formatter: () =>
                                    `₹${(myWallet?.total_earned ?? "").toLocaleString()}`,
                            },
                        },
                    },
                },
            },
            states: {
                hover: {
                    filter: { type: 'none' },
                },
                active: {
                    filter: { type: 'none' },
                },
            },
        },
    };

    const tiles = [
        { label: 'Total Earned', value: myWallet?.total_earned, icon: Banknote },
        { label: 'Available Balance', value: myWallet?.wallet_balance, icon: Wallet },
        { label: 'Withdrawn', value: myWallet?.total_debit, icon: DollarSign },
        { label: 'Wrong Income', value: myWallet?.total_deduct, icon: ShoppingBag },
    ];

    return (
        <>
            <AffiliatePageHeader title="Wallet" icon={Wallet} />
            {loading ? <AccountDashboardSkeleton /> :
                <div className="space-y-6">
                    <div className="grid gap-6 xl:grid-cols-3">
                        <div className="grid gap-4 sm:grid-cols-2 xl:col-span-2">
                            {tiles.map((tile) => (
                                <div key={tile.label} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-500">{tile.label}</p>
                                        <p className="tc-serif mt-1 truncate text-2xl font-black text-[#0b1b33] xl:text-3xl">₹ {Number(tile.value || 0).toLocaleString('en-IN')}</p>
                                    </div>
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0b1b33] text-[#16c75f]">
                                        <tile.icon size={22} />
                                    </span>
                                </div>
                            ))}
                        </div>

                        <DashCard title="My Account" icon={PieChart}>
                            <div className="p-4">
                                {isMounted ? (
                                    <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={300} width={'100%'} />
                                ) : (
                                    <div className="h-[300px] animate-pulse rounded-xl bg-slate-100" />
                                )}
                            </div>
                        </DashCard>
                    </div>

                    <DashCard
                        title="Recent Transaction"
                        icon={ReceiptText}
                        action={
                            <Link href="/dash/affiliate/transaction-history" className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#0e9f4a] hover:underline">
                                View More <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        }
                    >
                        {initialRecords.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {initialRecords.map((item) => (
                                    <TransactionRow key={item?.documentId} item={item} datePrefix="Paid on " />
                                ))}
                            </div>
                        ) : (
                            <DashEmpty icon={ReceiptText} title="No data available." />
                        )}
                    </DashCard>
                </div>}
        </>
    )
}
