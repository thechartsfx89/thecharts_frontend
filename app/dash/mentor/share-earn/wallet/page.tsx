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
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useSelector } from 'react-redux'
import { IRootState } from '@/store'
import dynamic from 'next/dynamic'

export default function page() {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    const salesByCategory: any = {
        series: [985, 737],
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
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            // legend: {
            //     position: 'bottom',
            //     horizontalAlign: 'center',
            //     fontSize: '18px',
            //     markers: {
            //         width: 14,
            //         height: 14,
            //         offsetX: -2,
            //     },
            //     height: 80,
            //     offsetY: 20,
            // },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',   // 👈 text-sm
                labels: {
                    colors: isDark ? '#bfc9d4' : '#000', // 👈 optional: dark/light mode
                },
                markers: {
                    width: 14,
                    height: 14,
                    offsetX: -2,
                },
                height: 80,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            name: { show: true, fontSize: '18px', fontWeight: 'bold' },
                           value: {
  show: true,
  fontSize: '14px',
  fontWeight: 'bold', // use ApexCharts style prop
  formatter: (val: number) => `₹${val}` // 👈 plain string, no <strong>
},
total: {
  show: true,
  fontSize: '14px',
  fontWeight: 'bold',
  formatter: (w: any) => {
    const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
    return `₹${total}`; // 👈 plain string
  }},
                        }
                    }
                }
            },
            // plotOptions: {
            //     pie: {
            //         donut: {
            //             size: '65%',
            //             background: 'transparent',
            //             labels: {
            //                 show: true,
            //                 name: {
            //                     show: true,
            //                     fontSize: '19px',
            //                     offsetY: -10,
            //                 },
            //                 value: {
            //                     show: true,
            //                     fontSize: '16px',
            //                     color: isDark ? '#bfc9d4' : undefined,
            //                     offsetY: 16,
            //                     formatter: (val: any) => {
            //                         return val;
            //                     },
            //                 },
            //                 total: {
            //                     show: true,
            //                     label: 'Total',
            //                     color: '#888ea8',
            //                     fontSize: '24px',
            //                     formatter: (w: any) => {
            //                         const total = w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);
            //                         return `₹ ${total}`;
            //                     },
            //                 },
            //             },
            //         },
            //     },
            // },
            labels: ['Wallet','Commission'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };
    const items1 = [
        {
            id: 1,
            text: 'Bill Payment for The Charts',
            name: 'Paid on 08 Sep, 12:41 PM',
        },
        {
            id: 2,
            text: 'Bill Payment for The Charts',
            name: 'Paid on 08 Sep, 12:41 PM',
        },
        {
            id: 3,
            text: 'Bill Payment for The Charts',
            name: 'Paid on 08 Sep, 12:41 PM',
        },
        {
            id: 4,
            text: 'Bill Payment for The Charts',
            name: 'Paid on 08 Sep, 12:41 PM',
        },
        {
            id: 5,
            text: 'Bill Payment for The Charts',
            name: 'Paid on 08 Sep, 12:41 PM',
        },
    ];
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
                        <div className="flex flex-wrap gap-2 justify-end md:w-1/2">
                            <Link href="" className="flex-1 min-w-[160px]">
                                <div className="bg-[#ecf5ff] px-3 py-2 font-semibold flex gap-3 items-center h-full">
                                    <div
                                        className="bg-[#2773dd] w-12 h-12 border flex justify-center items-center text-[#ffff]"
                                        style={{
                                            clipPath:
                                                "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                                        }}
                                    ><Banknote /></div>
                                    <div>Add Money</div>
                                </div>
                            </Link>

                            <Link href="" className="flex-1 min-w-[160px]">
                                <div className="bg-[#fff6eb] px-3 py-2 font-semibold flex gap-3 items-center h-full">
                                    <div
                                        className="bg-[#feb750] w-12 h-12 border flex justify-center items-center text-[#ffff]"
                                        style={{
                                            clipPath:
                                                "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                                        }}
                                    ><CirclePlus /></div>
                                    <div>To Bank A/C</div>
                                </div>
                            </Link>

                            <Link href="" className="flex-1 min-w-[160px]">
                                <div className="bg-[#ecfef3] px-3 py-2 font-semibold flex gap-3 items-center h-full">
                                    <div
                                        className="bg-[#3ba965] w-12 h-12 border flex justify-center items-center text-[#ffff]"
                                        style={{
                                            clipPath:
                                                "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                                        }}
                                    ><DollarSign /></div>
                                    <div>Earning</div>
                                </div>
                            </Link>

                            <Link href="" className="flex-1 min-w-[160px]">
                                <div className="bg-[#fff3f2] px-3 py-2 font-semibold flex gap-3 items-center h-full">
                                    <div
                                        className="bg-[#fd5151] w-12 h-12 border flex justify-center items-center text-[#ffff]"
                                        style={{
                                            clipPath:
                                                "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                                        }}
                                    ><ShoppingBag /></div>
                                    <div>Purchase</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Swap */}
                <div className="panel">
                    <div className="mb-5 text-lg font-semibold dark:text-white">Transaction History</div>
                    <ul id="example7">
                        {items1.map((item) => (
                            <li key={item.id} className="cursor-pointer mt-4">
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
                                            <div className="text-md text-dark dark:text-[#bfc9d4]">{item.text}</div>
                                            <div className="text-xs text-white-dark">{item.name}</div>
                                        </div>
                                        <div className='text-dark dark:text-[#bfc9d4] font-semibold'>&#8377; 4500</div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </>
    )
}
