'use client';
import Dropdown from '@/components/dropdown';
import IconArrowLeft from '@/components/icon/icon-arrow-left';
import IconBolt from '@/components/icon/icon-bolt';
import IconCaretDown from '@/components/icon/icon-caret-down';
import IconCashBanknotes from '@/components/icon/icon-cash-banknotes';
import IconCreditCard from '@/components/icon/icon-credit-card';
import IconDollarSign from '@/components/icon/icon-dollar-sign';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
import IconInbox from '@/components/icon/icon-inbox';
import IconMultipleForwardRight from '@/components/icon/icon-multiple-forward-right';
import IconNetflix from '@/components/icon/icon-netflix';
import IconPlus from '@/components/icon/icon-plus';
import IconShoppingCart from '@/components/icon/icon-shopping-cart';
import IconTag from '@/components/icon/icon-tag';
import IconUser from '@/components/icon/icon-user';
import { IRootState } from '@/store';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import IconTrendingUp from '../icon/icon-trending-up';
import IconEye from '../icon/icon-eye';
import { useSession } from 'next-auth/react';
import { getImageUrl, getRandomColor, getTextColor } from '@/utils/common/common';
import { formatDateAndTime, formatDateTimeUTC, formatDateUTC } from '@/utils/dateFormatter';
import { set } from 'lodash';
import { co } from '@fullcalendar/core/internal-common';

const ComponentsDashboardSales = () => {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    const { data: session } = useSession<any>();
    const isAdmin = session?.user?.role == "admin"
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [directReferralData, setDirectReferralData] = useState([]);
    const [totalTeamSize, setTotalTeamSize] = useState(null);
    const [totalActiveUsers, setTotalActiveUsers] = useState(null);
    const [statsGraphData, setStatsGraphData] = useState(null);
    const [transHistoryData, setTransHistoryData] = useState([]);
    const [walletByCategory, setWalletByCategory] = useState(null);
    const [allDownlineData, setAllDownlineData] = useState([]);
    const [affiliateCountData, setAffiliateCountData] = useState(null);
    const { LEVEL_INCOME, CLUB_INCOME, WITHDRAWN, DEDUCT } = walletByCategory || {};
    // const [records, setRecords] = useState(initialRecords);
    const [search, setSearch] = useState('');
    const [wallet, setWallet] = useState(null)
    const [loading, setLoading] = useState(true);
    // console.log({ wallet }, directReferralData.length, allDownlineData.length)
    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const [txRes, walletRes, directReferralRes, allDownlineRes, statsGraphRes, transHistoryRes, affiliateCountRes] = await Promise.all([
                fetch(
                    `/api/dash/affiliate/transaction-history?page=1&pageSize=5&sort=createdAt:desc`,
                    { credentials: "include" }
                ),
                fetch(`/api/dash/affiliate/wallet/my-wallet`, {
                    credentials: "include",
                }),
                fetch("/api/dash/affiliate/direct-referral", {
                    method: "GET",
                    credentials: "include",
                }),
                fetch('/api/dash/affiliate/downline', {
                    method: 'GET',
                    credentials: 'include',
                }),
                fetch('/api/dash/affiliate/dashboard/statsGraph', {
                    method: 'GET',
                    credentials: 'include',
                }),
                fetch('/api/dash/affiliate/transaction-history?page=1&pageSize=7&sort=createdAt:desc', {
                    method: 'GET',
                    credentials: 'include',
                }),
                fetch('/api/dash/affiliate/dashboard/affiliateDetails', {
                    method: 'GET',
                    credentials: 'include',
                })
            ]);

            if (!txRes.ok || !walletRes.ok) {
                throw new Error("Failed to fetch dashboard data");
            }

            const [txData, walletData, directReferralData, allDownlineData, statsGraphData, transHistoryData, affiliateCountData] = await Promise.all([
                txRes.json(),
                walletRes.json(),
                directReferralRes.json(),
                allDownlineRes.json(),
                statsGraphRes.json(),
                transHistoryRes.json(),
                affiliateCountRes.json()
            ]);

            // 🧾 Transaction History (recent 5)
            setTransactionHistory(txData?.data || []);
            setDirectReferralData(directReferralData?.data?.users || []);
            setAllDownlineData(allDownlineData?.data?.data?.users || []);
            setTotalTeamSize(allDownlineData?.data?.data?.count ?? 0);
            setTotalActiveUsers(directReferralData?.data?.count ?? 0);
            setStatsGraphData(statsGraphData?.data?.data || null);
            // 💰 Wallet
            setWallet(walletData?.data?.grand_total || null);
            setWalletByCategory(walletData?.data?.by_category || null);
            setTransHistoryData(txData?.data || []);
            setAffiliateCountData(affiliateCountData?.data || null);

        } catch (err) {
            console.error("Dashboard fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);







    //Revenue Chart
    const revenueChart: any = {
        series: [
            {
                name: 'Level',
                data: statsGraphData?.map((item: any) => item.LEVEL) ?? [],
            },
            {
                name: 'Club',
                data: statsGraphData?.map((item: any) => item.CLUB) ?? [],
            },
        ],
        options: {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },

            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#2196F3', '#E7515A'] : ['#1B55E2', '#E7515A'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#1B55E2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#E7515A',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: (value: number) => {
                        return value / 1000 + 'K';
                    },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
        },
    };


    //Sales By Category
    const salesByCategory: any = {
        series: [wallet?.total_earned ?? 0, 0, 0],
        options: {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Level', 'Club', "others"],
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

    //Daily Sales
    const dailySales: any = {
        series: [
            {
                name: 'Sales',
                data: [44, 55, 41, 67, 22, 43, 21],
            },
            {
                name: 'Last Week',
                data: [13, 23, 20, 8, 13, 27, 33],
            },
        ],
        options: {
            chart: {
                height: 160,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
                stacked: true,
                stackType: '100%',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#e2a03f', '#e0e6ed'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0,
                        },
                    },
                },
            ],
            xaxis: {
                labels: {
                    show: false,
                },
                categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            },
            yaxis: {
                show: false,
            },
            fill: {
                opacity: 1,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '25%',
                },
            },
            legend: {
                show: false,
            },
            grid: {
                show: false,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 10,
                    right: -20,
                    bottom: -20,
                    left: -20,
                },
            },
        },
    };

    //Total Orders
    const totalOrders: any = {
        series: [
            {
                name: 'Sales',
                data: [28, 40, 36, 52, 38, 60, 38, 52, 36, 40],
            },
        ],
        options: {
            chart: {
                height: 290,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: isDark ? ['#00ab55'] : ['#00ab55'],
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            yaxis: {
                min: 0,
                show: false,
            },
            grid: {
                padding: {
                    top: 125,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            fill: {
                opacity: 1,
                type: 'gradient',
                gradient: {
                    type: 'vertical',
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: 0.3,
                    opacityTo: 0.05,
                    stops: [100, 100],
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
            },
        },
    };
    const paidVisit: any = {
        series: [{ data: [22, 19, 30, 47, 32, 44, 34, 55, 41, 69] }],
        options: {
            chart: {
                height: 58,
                type: 'line',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: '#e2a03f',
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#e2a03f'],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
        },
    };
    return (
        <>
            <div>
                {/* <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link href="/" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Sales</span>
                    </li>
                </ul> */}

                <div className="">
                    <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-4">
                        <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
                            <div className="flex justify-between">
                                <div className="text-base font-bold ltr:mr-1 rtl:ml-1">Total Team Size</div>
                                <div className="dropdown">
                                    <Dropdown
                                        offset={[0, 5]}
                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                        btnClassName="hover:opacity-80"
                                        button={<IconHorizontalDots className="opacity-70 hover:opacity-80" />}
                                    >
                                        <ul className="text-black dark:text-white-dark">
                                            <li>
                                                <Link href={isAdmin ? `/dash/admin/genealogy` : `/dash/affiliate/genealogy`}>
                                                    <button type='button' className='text-xs p-0'>View Report</button>
                                                </Link>
                                            </li>

                                        </ul>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="mt-1 flex items-center">

                                {loading ? (
                                    <div className="h-9 w-[10ch] rounded-md bg-white/20 animate-pulse backdrop-blur-sm mr-2" />
                                ) : (
                                    <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3 text-white">
                                        {affiliateCountData?.totalHierarchyCount ?? ''}
                                    </div>
                                )}


                                <div className="badge bg-white/30">+ 0% </div>
                            </div>

                            <div className="grid gap-8 text-sm font-bold text-white grid-cols-2 mt-2">
                                <div>
                                    <div>
                                        <div>Total Admission</div>
                                        {loading ? (
                                            <div className="h-9 w-[10ch] rounded-md bg-white/20 animate-pulse backdrop-blur-sm mr-2" />
                                        ) : (
                                            <div className="text-lg text-white">{affiliateCountData?.totalActiveCount ?? ""}</div>

                                        )}
                                    </div>
                                </div>

                                <div>


                                </div>
                            </div>
                        </div>

                        {/* Sessions */}
                        <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                            <div className="flex justify-between">
                                <div className="text-base font-bold ltr:mr-1 rtl:ml-1">Total Income</div>
                                <div className="dropdown">
                                    <Dropdown
                                        offset={[0, 5]}
                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                        btnClassName="hover:opacity-80"
                                        button={<IconHorizontalDots className="opacity-70 hover:opacity-80" />}
                                    >
                                        <ul className="text-black dark:text-white-dark">
                                            <li>
                                                <Link href={isAdmin ? `/dash/admin/wallet` : `/dash/affiliate/wallet`}>
                                                    <button type='button' className='text-xs p-0'>View Report</button>

                                                </Link>
                                            </li>

                                        </ul>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="mt-5 flex items-center">
                                {loading ? (
                                    <div className="h-9 w-[10ch] rounded-md bg-white/20 animate-pulse backdrop-blur-sm mr-2" />
                                ) : (
                                    <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">Rs {wallet?.total_earned ?? "0"} </div>
                                )}

                                <div className="badge bg-white/30">0% </div>
                            </div>
                            <div className="mt-5 flex items-center font-semibold">
                                <IconEye className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                Last Week 0
                            </div>
                        </div>

                        {/*  Time On-Site */}
                        <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                            <div className="flex justify-between">
                                <div className="text-base font-bold ltr:mr-1 rtl:ml-1">Level Income</div>
                                <div className="dropdown">
                                    <Dropdown
                                        offset={[0, 5]}
                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                        btnClassName="hover:opacity-80"
                                        button={<IconHorizontalDots className="opacity-70 hover:opacity-80" />}
                                    >
                                        <ul className="text-black dark:text-white-dark">
                                            <li>
                                                <Link href={isAdmin ? `/dash/admin/level-report` : `/dash/affiliate/level-report`}>
                                                    <button type='button' className='text-xs p-0'>View Report</button>

                                                </Link>
                                            </li>

                                        </ul>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="mt-5 flex items-center">
                                {loading ? (
                                    <div className="h-9 w-[10ch] rounded-md bg-white/20 animate-pulse backdrop-blur-sm mr-2" />
                                ) : (
                                    <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> Rs {LEVEL_INCOME?.net ?? "0"}</div>

                                )}
                                <div className="badge bg-white/30">+0% </div>
                            </div>
                            <div className="mt-5 flex items-center font-semibold">
                                <IconEye className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                Last Week 0
                            </div>
                        </div>

                        {/* Bounce Rate */}
                        <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                            <div className="flex justify-between">
                                <div className="text-base font-bold ltr:mr-1 rtl:ml-1">Club Income</div>

                            </div>
                            <div className="mt-5 flex items-center">
                                {loading ? (
                                    <div className="h-9 w-[10ch] rounded-md bg-white/20 animate-pulse backdrop-blur-sm mr-2" />
                                ) : (
                                    <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">  </div>

                                )}

                                <div className="badge bg-white/30">0% </div>
                            </div>
                            <div className="mt-5 flex items-center font-semibold">
                                <IconEye className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                Last Week 0
                            </div>
                        </div>
                    </div>


                    <div className="mb-6 grid gap-6 xl:grid-cols-3">
                        <div className="panel h-full xl:col-span-2">
                            <div className="mb-5 flex items-center justify-between dark:text-white-light">
                                <h5 className="text-lg font-semibold">Commission</h5>
                                <div className="dropdown">
                                    <Dropdown
                                        offset={[0, 1]}
                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                        button={<IconHorizontalDots className="text-black/70 hover:!text-primary dark:text-white/70" />}
                                    >
                                        <ul>
                                            <li>
                                                <button type="button">Yearly</button>
                                            </li>
                                        </ul>
                                    </Dropdown>
                                </div>
                            </div>
                            <p className="text-lg dark:text-white-light/90">
                                Total Earning <span className="ml-2 text-primary">{wallet?.total_earned ?? ""}</span>
                            </p>
                            <div className="relative">
                                <div className="rounded-lg bg-white dark:bg-black">
                                    {isMounted ? (
                                        <ReactApexChart series={revenueChart.series} options={revenueChart.options} type="area" height={325} width={'100%'} />
                                    ) : (
                                        <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                            <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>


                        <div className="panel h-full overflow-hidden border-0 p-0">
                            <div className="min-h-[190px] bg-gradient-to-r from-[#4361ee] to-[#160f6b] p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    {loading ?
                                        <div className="flex items-center rounded-full bg-black/50 p-1 font-semibold text-white ltr:pr-3 rtl:pl-3">
                                            <div className="h-7 w-24 animate-pulse rounded-full" />
                                        </div> :
                                        <>
                                            <div className="flex items-center rounded-full bg-black/50 p-1 font-semibold text-white ltr:pr-3 rtl:pl-3">

                                                {(session?.user?.profileImage || session?.user?.profile_img_path) ? (
                                                    <img

                                                        src={
                                                            session?.user?.profileImage
                                                                ? `${getImageUrl(session?.user?.profileImage)}?t=${Date.now()}`
                                                                : session?.user?.profile_img_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/${session?.user?.profile_img_path}` : "/assets/images/fallback-profile.png"
                                                        }

                                                        className="block h-8 w-8 rounded-full border-2 border-white/50 object-cover ltr:mr-1 rtl:ml-1"
                                                        alt="avatar"
                                                    />
                                                ) : (
                                                    <div
                                                        className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-[12px] uppercase mr-1"
                                                        style={{ backgroundColor: getRandomColor(session?.user?.id), color: getTextColor(getRandomColor(session?.user?.id)) }}
                                                    >
                                                        {session?.user?.fullName
                                                            ?.split(' ')
                                                            .map((name: any) => name[0])
                                                            .slice(0, 2)
                                                            .join('')}

                                                    </div>
                                                )}
                                                {session?.user?.fullName ?? ""}
                                            </div>
                                            <button type="button" className="flex h-9 w-9 items-center justify-between rounded-md bg-black text-white hover:opacity-80 ltr:ml-auto rtl:mr-auto">
                                                <IconPlus className="m-auto h-6 w-6" />
                                            </button></>}
                                </div>
                                <div className="flex items-center justify-between text-white">
                                    <p className="text-xl">Wallet Balance</p>
                                    <h5 className="text-2xl ltr:ml-auto rtl:mr-auto">
                                        {loading ? (
                                            <div className="h-9 w-[10ch] rounded-md bg-white/20 animate-pulse backdrop-blur-sm mr-2" />
                                        ) : (
                                            <span><span className="text-white-light">Rs </span>{wallet?.wallet_balance ?? "0"}</span>
                                        )}

                                    </h5>
                                </div>
                            </div>
                            <div className="-mt-12 grid grid-cols-2 gap-2 px-8">
                                <div className="rounded-md bg-white px-4 py-2.5 shadow dark:bg-[#060818]">
                                    <span className="mb-4 flex items-center justify-between dark:text-white">
                                        Received
                                        <IconCaretDown className="h-4 w-4 rotate-180 text-success" />
                                    </span>
                                    <div className="btn w-full  border-0 bg-[#ebedf2] py-1 text-base text-[#515365] shadow-none dark:bg-black dark:text-[#bfc9d4]">Rs {wallet?.total_earned ?? ""}</div>
                                </div>
                                <div className="rounded-md bg-white px-4 py-2.5 shadow dark:bg-[#060818]">
                                    <span className="mb-4 flex items-center justify-between dark:text-white">
                                        Withdraw
                                        <IconCaretDown className="h-4 w-4 text-danger" />
                                    </span>
                                    <div className="btn w-full  border-0 bg-[#ebedf2] py-1 text-base text-[#515365] shadow-none dark:bg-black dark:text-[#bfc9d4]">Rs {wallet?.total_debit ?? ""}</div>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="mb-5">
                                    <span className="rounded-full bg-[#1b2e4b] px-4 py-1.5 text-xs text-white before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-white ltr:before:mr-2 rtl:before:ml-2">
                                        {wallet ? "Active" : "Pending"}
                                    </span>
                                </div>
                                <div className="mb-5 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-[#515365]">Level</p>
                                        <p className="text-base">
                                            <span>Rs </span> <span className="font-semibold">{LEVEL_INCOME?.net ?? ""}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-[#515365]">Club</p>
                                        <p className="text-base">
                                            <span>Rs </span> <span className="font-semibold ">{""}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-around px-2 text-center">
                                    <Link href={isAdmin ? `/dash/admin/wallet` : `/dash/affiliate/wallet`}>
                                        <button type="button" className="btn btn-secondary ltr:mr-2 rtl:ml-2">
                                            View Details
                                        </button>
                                    </Link>
                                    <Link href={isAdmin ? `/dash/admin/payout-request` : `/dash/affiliate/payout-request`}>
                                        <button type="button" className="btn btn-success">
                                            Withdraw
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        <div className="panel h-full pb-0 sm:col-span-2 xl:col-span-1">
                            <h5 className="mb-5 text-lg font-semibold dark:text-white-light">Recent Activities</h5>
                            <PerfectScrollbar className="relative mb-4 h-[290px] ltr:-mr-3 ltr:pr-3 rtl:-ml-3 rtl:pl-3" options={{ suppressScrollX: true }}>
                                <div className="cursor-pointer text-sm">

                                </div>
                            </PerfectScrollbar>
                            <div className="border-t border-white-light dark:border-white/10">
                                <button type="button" className="group group flex w-full items-center justify-center p-4 font-semibold hover:text-primary">
                                    View All
                                    <IconArrowLeft className="transition duration-300 group-hover:translate-x-1 ltr:ml-1 rtl:mr-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                                </button>
                            </div>
                        </div>
                        <div className="panel h-full">
                            <div className="mb-5 flex items-center justify-between dark:text-white-light">
                                <h5 className="text-lg font-semibold">Transactions</h5>

                                <Link href={isAdmin ? `/dash/admin/transaction-history` : `/dash/affiliate/transaction-history`} >
                                    <div className="text-xs hover:underline text-primary dark:text-white cursor-pointer btn shadow-none">View More</div>
                                </Link>
                            </div>
                            <div>
                                <div className="space-y-6">
                                    {Array.isArray(transHistoryData) && transHistoryData?.length > 0 && transHistoryData.map((item) => (
                                        <div key={item?.id} className="flex">
                                            <span className="grid h-8 w-8 shrink-0 place-content-center rounded-md bg-success-light text-base text-success dark:bg-success dark:text-success-light">

                                                <img
                                                    alt="avatar"
                                                    src={`/favicon.png`}
                                                    className="mx-auto h-6 w-6 rounded-full"
                                                />
                                            </span>
                                            <div className="flex-1 px-3">
                                                {item?.remark ?
                                                    <div className="text-md text-dark dark:text-[#bfc9d4]">{item?.remark ? item?.remark?.replace("<b>", "").replace("</b>", "") : ""}</div>
                                                    :
                                                    <div className="text-md text-dark dark:text-[#bfc9d4]">{item?.type == "LEVEL" ? "" : item?.type} Commission by {item?.sourceUser?.username} at {item?.level ? `(Level${item?.level})` : ""}</div>
                                                }

                                                <div className="text-xs text-white-dark dark:text-gray-500">{item?.createdAt ? formatDateAndTime(item?.createdAt) : ""}</div>
                                            </div>

                                            {item?.credit > 0 && <div className='text-success dark:text-[#bfc9d4] font-bold'>+ &#8377; {item?.credit}</div>}
                                            {item?.debit > 0 && <div className='text-danger dark:text-[#bfc9d4] font-bold'>- &#8377; {item?.debit}</div>}
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>

                        <div className="panel h-full">
                            <div className="mb-5 flex items-center">
                                <h5 className="text-lg font-semibold dark:text-white-light">Earning by commission</h5>
                            </div>
                            <div>
                                <div className="rounded-lg bg-white dark:bg-black">
                                    {isMounted ? (
                                        <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} width={'100%'} />
                                    ) : (
                                        <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                            <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {!isAdmin &&
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="panel h-full w-full">
                                <div className="mb-3 flex items-center justify-between">
                                    <h5 className="text-lg font-semibold dark:text-white-light">Direct Referral</h5>
                                    <Link href="/dash/affiliate/my-sponsor-list" >
                                        <div className="text-md hover:underline text-primary dark:text-white cursor-pointer btn shadow-none">View More</div>
                                    </Link>
                                </div>
                                <div className="table-responsive">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th className="ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                                                <th>Username</th>
                                                <th>Registration</th>
                                                <th>Member</th>
                                                <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(directReferralData) && directReferralData?.length > 0 && directReferralData?.slice(0, 5)?.map((data, index) => {
                                                return (
                                                    <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90" key={`${index}_sponsor`}>
                                                        <td className="min-w-[150px] text-black dark:text-white">
                                                            <div className="flex items-center">

                                                                {(data?.user?.profile_image?.url || data?.user?.profile_img_path) ? (
                                                                    <img

                                                                        src={
                                                                            data?.user?.profile_image?.url
                                                                                ? `${getImageUrl(data?.user?.profile_image?.url)}?t=${Date.now()}`
                                                                                : data?.user?.profile_img_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/${data?.user?.profile_img_path}` : "/assets/images/fallback-profile.png"
                                                                        }
                                                                        className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3"
                                                                        alt=""
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="whitespace-nowrap"
                                                                        style={{ backgroundColor: getRandomColor(data?.user?.id), color: getTextColor(getRandomColor(data?.user?.id)) }}
                                                                    >
                                                                        {data?.user?.fullName
                                                                            ?.split(' ')
                                                                            .map((name: any) => name[0])
                                                                            .slice(0, 2)
                                                                            .join('')}

                                                                    </div>
                                                                )} <span className="whitespace-nowrap">{data?.user?.fullName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="text-primary">{data?.user?.username}</td>
                                                        <td>
                                                            <span>{formatDateUTC(data?.user?.createdAt ?? "")}</span>

                                                        </td>
                                                        <td>
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-bold
                                             ${data?.downlineCount > 0
                                                                        ? 'bg-green-600 text-white'
                                                                        : 'bg-red-500 text-white'
                                                                    }`}
                                                            >
                                                                {data?.downlineCount ?? 0}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={`badge ${data?.user?.status
                                                                    ? 'bg-success'
                                                                    : 'bg-warning'
                                                                    }`}
                                                            >

                                                                {data?.user?.status ? 'Activated' : 'Not_Active'}

                                                            </span>

                                                        </td>
                                                    </tr>
                                                )
                                            })}


                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="panel h-full w-full">
                                <div className="mb-3 flex items-center justify-between">
                                    <h5 className="text-lg font-semibold dark:text-white-light">Indirect Referral</h5>
                                    <Link href="/dash/affiliate/downline-list" >
                                        <div className="text-md hover:underline text-primary dark:text-white cursor-pointer btn shadow-none">View More</div>
                                    </Link>
                                </div>
                                <div className="table-responsive">
                                    <table>
                                        <thead>
                                            <tr className="border-b-0">
                                                <th className="ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                                                <th>Username</th>
                                                <th>Registration</th>
                                                <th>Level</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(allDownlineData) && allDownlineData?.length > 0 && allDownlineData?.slice(0, 5)?.map((data, index) => {
                                                return (
                                                    <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90" key={`${index}_sponsor`}>
                                                        <td className="min-w-[150px] text-black dark:text-white">
                                                            <div className="flex items-center">

                                                                {(data?.user?.profile_image?.url || data?.user?.profile_img_path) ? (
                                                                    <img

                                                                        src={
                                                                            data?.user?.profile_image?.url
                                                                                ? `${getImageUrl(data?.user?.profile_image?.url)}?t=${Date.now()}`
                                                                                : data?.user?.profile_img_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/${data?.user?.profile_img_path}` : "/assets/images/fallback-profile.png"
                                                                        }
                                                                        className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3"
                                                                        alt=""
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="whitespace-nowrap"
                                                                        style={{ backgroundColor: getRandomColor(data?.user?.id), color: getTextColor(getRandomColor(data?.user?.id)) }}
                                                                    >
                                                                        {data?.user?.fullName
                                                                            ?.split(' ')
                                                                            .map((name: any) => name[0])
                                                                            .slice(0, 2)
                                                                            .join('')}

                                                                    </div>
                                                                )} <span className="whitespace-nowrap">{data?.user?.fullName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="text-primary">{data?.user?.username}</td>
                                                        <td>
                                                            <span>{formatDateUTC(data?.user?.createdAt ?? "")}</span>

                                                        </td>
                                                        <td>
                                                            <span
                                                                className="badge text-white"
                                                                style={{
                                                                    backgroundColor:
                                                                        {
                                                                            1: '#2563EB',
                                                                            2: '#4F46E5',
                                                                            3: '#7C3AED',
                                                                            4: '#DB2777',
                                                                            5: '#E11D48',
                                                                            6: '#334155',
                                                                            7: '#D97706',
                                                                            8: '#4338CA',
                                                                            9: '#6D28D9',
                                                                            10: '#0F766E',
                                                                        }[data?.level] ?? '#6B7280',
                                                                }}
                                                            >
                                                                Level {data?.level}
                                                            </span>

                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>}
                </div>
            </div>
        </>
    );
};

export default ComponentsDashboardSales;
