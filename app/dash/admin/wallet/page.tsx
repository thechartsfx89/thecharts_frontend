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
    ShoppingBag,      // purchase (alt)
    Search
} from "lucide-react";
// import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux'
import { IRootState } from '@/store'
import dynamic from 'next/dynamic'
import { formatDateAndTime } from '@/utils/dateFormatter'
import { AccountDashboardSkeleton } from './walletSkelton'
import { IconUser } from '@tabler/icons-react'
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
    const [earnerData, setEarnerData] = useState(null)
    const [loading, setLoading] = useState(true);
    console.log({ wallet })
    // const fetchDashboardData = async () => {
    //     try {
    //         setLoading(true);

    //         const [txRes, walletRes] = await Promise.all([
    //             fetch(
    //                 `/api/dash/affiliate/master-transaction-history?page=1&pageSize=5&sort=createdAt:desc`,
    //                 { credentials: "include" }
    //             ),
    //             fetch(`/api/dash/admin/master-e-wallet`, {
    //                 credentials: "include",
    //             }),
    //         ]);

    //         if (!txRes.ok || !walletRes.ok) {
    //             throw new Error("Failed to fetch dashboard data");
    //         }

    //         const [txData, walletData] = await Promise.all([
    //             txRes.json(),
    //             walletRes.json(),
    //         ]);

    //         // 🧾 Transaction History (recent 5)
    //         setInitialRecords(txData?.data || []);

    //         // 💰 Wallet
    //         setWallet(walletData?.data?.grand_total || null);

    //     } catch (err) {
    //         console.error("Dashboard fetch failed:", err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const [searchId, setSearchId] = useState(''); // State for input
    // const [wallet, setWallet] = useState(null);
    // const [loading, setLoading] = useState(true);

    const fetchDashboardData = async (targetUserId = '') => {
        try {
            setLoading(true);

            // Build URLs - append userId if provided
            const walletUrl = targetUserId
                ? `/api/dash/admin/master-e-wallet?userId=${targetUserId}`
                : `/api/dash/admin/master-e-wallet`;

            const historyUrl = targetUserId
                ? `/api/dash/admin/master-transaction-history?page=1&pageSize=100&userId=${targetUserId}`
                : `/api/dash/admin/master-transaction-history?page=1&pageSize=60`;

            const [txRes, walletRes] = await Promise.all([
                fetch(historyUrl, { credentials: "include" }),
                fetch(walletUrl, { credentials: "include" }),
            ]);

            const [txData, walletData] = await Promise.all([
                txRes.json(),
                walletRes.json(),
            ]);

            setInitialRecords(txData?.data || []);
            // Check if data is nested or direct based on your Strapi response
            setWallet(walletData?.data?.grand_total || walletData?.data || null);
            setEarnerData(walletData?.data?.earner ?? null)
        } catch (err) {
            console.error("Dashboard fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchDashboardData(searchId); // Fetch data for specific user
    };
    useEffect(() => {
        fetchDashboardData();
    }, []);


    const walletBalance = wallet?.wallet_balance ?? 0;
    const withdrawnAmount = wallet?.total_debit ?? 0;

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
                                    `₹${(wallet?.total_earned ?? 0).toLocaleString()}`,
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
    let userAllData = null
    return (
        <>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5">
                <ol className="flex items-center flex-wrap text-gray-500 font-semibold dark:text-white-dark gap-y-4">
                    <li>
                        <button className="p-2.5 border border-gray-500/20 rounded-md shadow flex items-center justify-center dark:border-0 dark:bg-[#191e3a] bg-white">
                            <IconMenuDashboard className="shrink-0" />
                        </button>
                    </li>
                    <li className="flex items-center before:w-1 before:h-1 before:rounded-full before:bg-primary before:mx-4">
                        <button className="p-2.5 border border-gray-500/20 rounded-md shadow flex items-center justify-center dark:border-0 dark:bg-[#191e3a] bg-white">
                            <IconMenuComponents /> Share and Earn
                        </button>
                    </li>
                    <li className="flex items-center before:w-1 before:h-1 before:rounded-full before:bg-primary before:mx-4">
                        <button className="p-2.5 border border-gray-500/20 rounded-md shadow flex items-center justify-center text-primary dark:border-0 dark:bg-[#191e3a] bg-white">
                            Wallet
                        </button>
                    </li>
                </ol>

                {/* ADMIN SEARCH BAR */}
                {/* <form  className="w-full md:w-auto flex items-center gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter User ID..."
                            className="form-input shadow-none bg-white dark:bg-[#1b2e4b] ltr:pr-11 rtl:pl-11"
                            
                        />
                        <button type="submit" className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-primary">
                            <Search size={18} />
                        </button>
                    </div>
                    <button type="submit" className="btn btn-primary whitespace-nowrap">
                        Search User
                    </button>
                </form> */}
                <form onSubmit={handleSearch} className="w-full md:w-auto flex items-center gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter User ID..."
                            className="form-input shadow-none bg-white dark:bg-[#1b2e4b] ltr:pr-11 rtl:pl-11"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-primary"
                        >
                            <Search size={18} />
                        </button>
                    </div>
                    <button type="submit" className="btn btn-primary whitespace-nowrap">
                        {loading ? 'Searching...' : 'Search User'}
                    </button>

                    {/* Optional: Clear button to go back to Global View */}
                    {searchId && (
                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => { setSearchId(''); fetchDashboardData(); }}
                        >
                            Reset
                        </button>
                    )}
                </form>
            </div>
            {loading ? <AccountDashboardSkeleton /> : <>
                {/* <div className='panel'>
                        <div>
                            <div>Name: {""}</div>
                            <div>user id: {""}</div>
                        </div>
                    </div> */}
                {earnerData && <div className="panel p-5 bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Left Side: User Primary Info */}
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <IconUser size={24} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Holder</span>
                                </div>
                                <div className="text-base lg:text-lg font-bold text-dark leading-tight">
                                    {earnerData?.fullName || <span className="text-gray-300">N/A</span>}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Identity Details */}
                        <div className="flex flex-col md:items-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">System Identifier</span>
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                <span className="text-sm font-mono font-bold text-primary">
                                    {earnerData?.username || "N/A"}
                                </span>
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Active Account"></div>
                            </div>
                        </div>
                    </div>
                </div>}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    {/* My Account */}

                    <div className="panel">
                        {/* <div className="font-semibold">My Account</div> */}
                        <div className="flex flex-col md:flex-row justify-between gap-4 mt-4">
                            {/* Balance */}

                            <div className="panel h-full">
                                <div className="mb-5 flex items-center">
                                    <h5 className="text-lg font-semibold dark:text-white-light">{searchId ? "Account": "System Gross"}</h5>
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

                            <div className="flex flex-wrap gap-4 justify-end md:w-1/2">

                                {/* TOTAL EARNED */}
                                <Link href="" className="flex-1 min-w-[180px]">
                                    <div className="relative rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-sm hover:shadow-md transition">
                                        <p className="text-sm text-blue-700 font-medium">Total Earned</p>
                                        <h3 className="text-xl font-bold text-dark mt-1">

                                            ₹{wallet?.total_earned?.toLocaleString()}
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

                                            ₹{wallet?.wallet_balance?.toLocaleString()}
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

                                            ₹{wallet?.total_debit?.toLocaleString()}
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
                                        <p className="text-sm text-rose-700 font-medium">Locked Amount</p>
                                        <h3 className="text-xl font-bold text-dark mt-1">
                                            ₹{wallet?.total_deduct?.toLocaleString()}
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
                            <div className="text-lg font-semibold dark:text-white">{searchId ? "Last 100 Transaction":"System Recent Transaction"}</div>
                           {!earnerData && <Link href="/dash/affiliate/transaction-history" >
                                <div className="text-md hover:underline text-primary dark:text-white cursor-pointer btn shadow-none">View More</div>
                            </Link>}
                        </div>
                        <div 
        className="overflow-y-auto pr-2 custom-scrollbar" 
        style={{ 
            maxHeight: 'calc(100vh - 450px)', // Adjust 450px based on your header/search bar height
            minHeight: '300px' 
        }}
    >
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
                                                {/* <div className="text-md text-dark dark:text-[#bfc9d4]">{item?.type == "LEVEL" ? "" : item?.type} Commission by {item?.sourceUser?.username} at {item?.level ? `(Level${item?.level})` : ""}</div> */}
                                                {/* <div className="text-md text-dark dark:text-[#bfc9d4]">{item?.remark?.replace("<b>", "").replace("</b>", "")}</div> */}
                                                {item?.remark ?
                                                    <div className="text-md text-dark dark:text-[#bfc9d4]">{item?.remark ? item?.remark?.replace("<b>", "").replace("</b>", "") : ""}</div>
                                                    :
                                                    <div className="text-md text-dark dark:text-[#bfc9d4]">{item?.transaction_for == "LEVEL_INCOME" ? "" : item?.type} Commission by {item?.sourceUser?.username} at {item?.level ? `(Level${item?.level})` : ""}</div>
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
                    </div>
                </div>
            </>}

        </>
    )
}
