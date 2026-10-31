"use client"
import IconMenuComponents from '@/components/icon/menu/icon-menu-components'
import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {
    Banknote,        // bank / banknote
    CirclePlus,      // add / add money
    DollarSign,      // earning / money
    PiggyBank,       // earning / savings (alt)
    Wallet,          // add/hold money (alt)
    ShoppingCart,    // purchase
    ShoppingBag      // purchase (alt)
} from "lucide-react";
// import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux'
import { IRootState } from '@/store'
import dynamic from 'next/dynamic'
import { formatDateAndTime } from '@/utils/dateFormatter'
import { AccountDashboardSkeleton } from './walletSkelton'
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
                height: 480,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 16,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark
                ? ['#5c1ac3', '#e7515a']
                : ['#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                labels: {
                    colors: isDark ? '#bfc9d4' : '#000',
                },
                markers: {
                    width: 14,
                    height: 14,
                    offsetX: -2,
                },
                height: 80,
                offsetY: 20,
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

    return (
        <>
            <ol className="flex items-center flex-wrap text-gray-500 font-semibold dark:text-white-dark gap-y-4">
                <li>
                    <button className="p-2.5 border border-gray-500/20 rounded-md shadow flex items-center justify-center dark:border-0 dark:bg-[#191e3a] hover:text-gray-500/70 dark:hover:text-white-dark/70 bg-white">
                        <IconMenuDashboard className="shrink-0 group-hover:!text-primary" />
                    </button>
                </li>
                <li className="flex items-center before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4 bg-white">
                    <button className="p-2.5 border border-gray-500/20 rounded-md shadow flex items-center justify-center dark:border-0 dark:bg-[#191e3a] hover:text-gray-500/70 dark:hover:text-white-dark/70">
                        <IconMenuComponents />
                        share and Earn
                    </button>
                </li>
                <li className="flex items-center before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4 bg-white">
                    <button className="p-2.5 border border-gray-500/20 rounded-md shadow flex items-center justify-center text-primary dark:border-0 dark:bg-[#191e3a] gap-2">
                        Wallet
                    </button>
                </li>
            </ol>
            {loading ? <AccountDashboardSkeleton /> :
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    {/* My Account */}
                    <div className="panel">
                        {/* <div className="font-semibold">My Account</div> */}
                        <div className="flex flex-col md:flex-row justify-between gap-4 mt-4">
                            {/* Balance */}
                            {/* <div className="flex flex-col gap-2 md:w-1/2">
                            <div className="text-white-black font-medium">Total Balance</div>
                            <div className="font-semibold text-xl">&#8377; 2.5 Lacs</div>
                        </div> */}
                            <div className="panel h-full">
                                <div className="mb-5 flex items-center">
                                    <h5 className="text-lg font-semibold dark:text-white-light">My Account</h5>
                                </div>
                                <div>
                                    <div className="rounded-lg bg-white dark:bg-black">
                                        {isMounted ? (
                                            <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={480} width={'100%'} />
                                        ) : (
                                            <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                                <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Actions */}
                            {/* <div className="flex flex-wrap gap-2 justify-end md:w-1/2">
                            <Link href="" className="flex-1 min-w-[160px]">
                                <div className="bg-[#ecf5ff] px-3 py-2 font-semibold flex gap-3 items-center h-full">
                            <div>total Earned</div>
                              <div>{wallet?.totalEarned}</div>
                                    <div
                                        className="bg-[#2773dd] w-12 h-12 border flex justify-center items-center text-[#ffff]"
                                        style={{
                                            clipPath:
                                                "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                                        }}
                                    >
                                        <Banknote />
                                    </div>
                                    
                                </div>
                            </Link>

                            <Link href="" className="flex-1 min-w-[160px]">
                                <div className="bg-[#fff6eb] px-3 py-2 font-semibold flex gap-3 items-center h-full">
                                   <div>Available Balance</div>
                              <div>{wallet?.availableBalance}</div>
                                    <div
                                        className="bg-[#feb750] w-12 h-12 border flex justify-center items-center text-[#ffff]"
                                        style={{
                                            clipPath:
                                                "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                                        }}
                                    ><CirclePlus /></div>
                                    
                                </div>
                            </Link>

                            <Link href="" className="flex-1 min-w-[160px]">
                                <div className="bg-[#ecfef3] px-3 py-2 font-semibold flex gap-3 items-center h-full">
                                    <div>Withdrawn Balance</div>
                              <div>{wallet?.withdrawnBalance}</div>
                                    <div
                                        className="bg-[#3ba965] w-12 h-12 border flex justify-center items-center text-[#ffff]"
                                        style={{
                                            clipPath:
                                                "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                                        }}
                                    ><DollarSign /></div>
                                </div>
                            </Link>

                            <Link href="" className="flex-1 min-w-[160px]">
                             <div>Locked Amount</div>
                              <div>{wallet?.withdrawnBalance}</div>
                                <div className="bg-[#fff3f2] px-3 py-2 font-semibold flex gap-3 items-center h-full">
                                    <div
                                        className="bg-[#fd5151] w-12 h-12 border flex justify-center items-center text-[#ffff]"
                                        style={{
                                            clipPath:
                                                "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                                        }}
                                    ><ShoppingBag /></div>
                                </div>
                            </Link>
                        </div> */}
                            <div className="flex flex-wrap gap-4 justify-end md:w-1/2">

                                {/* TOTAL EARNED */}
                                <Link href="" className="flex-1 min-w-[180px]">
                                    <div className="relative rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-sm hover:shadow-md transition">
                                        <p className="text-sm text-blue-700 font-medium">Total Earned</p>
                                        <h3 className="text-xl font-bold text-dark mt-1">

                                            ₹ {myWallet?.total_earned?.toLocaleString()}
                                        </h3>

                                        <div className="absolute top-7 right-4 bg-blue-600 text-white w-11 h-11 flex items-center justify-center"
                                            style={{
                                                clipPath:
                                                    "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                                            }}
                                        >
                                            <Banknote size={20} />
                                        </div>
                                    </div>
                                </Link>

                                {/* AVAILABLE BALANCE */}
                                <Link href="" className="flex-1 min-w-[180px]">
                                    <div className="relative rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 p-4 shadow-sm hover:shadow-md transition">
                                        <p className="text-sm text-amber-700 font-medium">Available Balance</p>
                                        <h3 className="text-xl font-bold text-dark mt-1">

                                            ₹ {myWallet?.wallet_balance?.toLocaleString()}
                                        </h3>

                                        <div className="absolute top-7 right-4 bg-amber-500 text-white w-11 h-11 flex items-center justify-center"
                                            style={{
                                                clipPath:
                                                    "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                                            }}
                                        >
                                            <CirclePlus size={20} />
                                        </div>
                                    </div>
                                </Link>

                                {/* WITHDRAWN */}
                                <Link href="" className="flex-1 min-w-[180px]">
                                    <div className="relative rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 shadow-sm hover:shadow-md transition">
                                        <p className="text-sm text-emerald-700 font-medium">Withdrawn</p>
                                        <h3 className="text-xl font-bold text-dark mt-1">

                                            ₹ {myWallet?.total_debit?.toLocaleString()}
                                        </h3>

                                        <div className="absolute top-7 right-4 bg-emerald-600 text-white w-11 h-11 flex items-center justify-center"
                                            style={{
                                                clipPath:
                                                    "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                                            }}
                                        >
                                            <DollarSign size={20} />
                                        </div>
                                    </div>
                                </Link>

                                {/* LOCKED AMOUNT */}
                                <Link href="" className="flex-1 min-w-[180px]">
                                    <div className="relative rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 p-4 shadow-sm hover:shadow-md transition">
                                        <p className="text-sm text-rose-700 font-medium">Wrong Income</p>
                                        <h3 className="text-xl font-bold text-dark mt-1">
                                            ₹ {myWallet?.total_deduct ? myWallet?.total_deduct?.toLocaleString() : "0"}
                                        </h3>

                                        <div className="absolute top-7 right-4 bg-rose-600 text-white w-11 h-11 flex items-center justify-center"
                                            style={{
                                                clipPath:
                                                    "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                                            }}
                                        >
                                            <ShoppingBag size={20} />
                                        </div>
                                    </div>
                                </Link>

                            </div>

                        </div>
                    </div>

                    {/* Swap */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <div className="text-lg font-semibold dark:text-white">Recent Transaction</div>
                            <Link href="/dash/affiliate/transaction-history" >
                                <div className="text-md hover:underline text-primary dark:text-white cursor-pointer btn shadow-none">View More</div>
                            </Link>
                        </div>
                        <ul id="example7">
                            {initialRecords.map((item) => (
                                <li key={item?.documentId} className="cursor-pointer mt-4">
                                    <div className="flex flex-col md:flex-row items-center gap-4 rounded-md border border-white-light bg-white px-6 py-3.5 dark:border-dark dark:bg-[#1b2e4b]">
                                        <div>
                                            <img
                                                alt="avatar"
                                                src={`/favicon.png`}
                                                className="mx-auto h-9 w-10 rounded-full"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col md:flex-row items-center md:justify-between text-center md:text-left">
                                            <div className="my-3 md:my-0 font-semibold">
                                                {item?.remark ?
                                                    <div className="text-md text-dark dark:text-[#bfc9d4]">{item?.remark ? item?.remark?.replace("<b>", "").replace("</b>", "") : ""}</div>
                                                    :
                                                    <div className="text-md text-dark dark:text-[#bfc9d4]">{item?.type == "LEVEL" ? "" : item?.type} Commission by {item?.sourceUser?.username} at {item?.level ? `(Level${item?.level})` : ""}</div>
                                                }
                                                <div className="text-xs text-white-dark">{`Paid on ${item?.createdAt ? formatDateAndTime(item?.createdAt) : ""}`}</div>
                                            </div>
                                            {/* <div className='text-dark dark:text-[#bfc9d4] font-semibold'>+ &#8377; {item?.amount}</div> */}
                                            {item?.credit > 0 && <div className='text-success dark:text-[#bfc9d4] font-bold'>+ &#8377; {item?.credit}</div>}
                                            {item?.debit > 0 && <div className='text-danger dark:text-[#bfc9d4] font-bold'>- &#8377; {item?.debit}</div>}

                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>}

        </>
    )
}
