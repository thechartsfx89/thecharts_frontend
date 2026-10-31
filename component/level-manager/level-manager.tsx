'use client';

import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import sortBy from 'lodash/sortBy';
// import { Modal, Button, Select } from '@mantine/core';
import IconEye from '@/components/icon/icon-eye';
import IconDownload from '@/components/icon/icon-download';
import { formatDateAndTime, formatDateTime } from '@/utils/dateFormatter';
import { getImageUrl } from '@/utils/common/common';
import { Modal, Select, Button, Text, Stack, Group, Avatar, Badge, Divider, Textarea, Skeleton } from '@mantine/core';
// import { IconUser, IconCheck, IconAlertCircle, IconRefresh, IconSearch } from '@tabler/icons-react';
import { forwardRef } from 'react';
import { showToast } from '@/utils/toast';
import IconLoader from '@/components/icon/icon-loader';
import IconSearch from '@/components/icon/icon-search';
import { IconRefresh } from '@tabler/icons-react';
import { TransactionHistorySkeleton } from '../E-wallet-manager/transactionSkeleton';
import Link from 'next/link';
const LevelManager = () => {
    const PAGE_SIZES = [10, 20, 30];
    const [recordsData, setRecordsData] = useState([]);
    const [totalIncome, setTotalIncome] = useState(null);
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUpdatedState, setIsUpdatedState] = useState(false);

    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'createdAt',
        direction: 'desc',
    });

    const [opened, setOpened] = useState(false);
    const [statusValue, setStatusValue] = useState('');
    const [fullName, setFullName] = useState('');
    const [userId, setUserId] = useState('');
    const [adminComment, setAdminComment] = useState("")
    const [studentComment, setStudentComment] = useState("")

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [docModal, setDocModal] = useState(false);
    const [docUrl, setDocUrl] = useState('');

    // ✅ Debounce Search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);

        return () => clearTimeout(handler);
    }, [search]);

    // ✅ API Call
    // const fetchKYCData = async () => {
    //     try {
    //         setLoading(true);

    //         let url = `/api/dash/admin/kyc-approval?page=${page}&pageSize=${pageSize}&sort=${sortStatus.columnAccessor}:${sortStatus.direction}&search=${debouncedSearch}`;

    //         if (fromDate) url += `&from=${fromDate}`;
    //         if (toDate) url += `&to=${toDate}`;

    //         const res = await fetch(url, { credentials: 'include' });
    //         if (!res.ok) throw new Error('Failed to fetch');

    //         const json = await res.json();

    //         setRecords(json.data || []);
    //         setTotalRecords(json.meta?.pagination?.total || 0);
    //     } catch (err) {
    //         console.error("Fetch error:", err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchKYCData();
    // }, [page, pageSize, sortStatus, fromDate, toDate, debouncedSearch, isUpdatedState]);

    const fetchTransactionHistory = useCallback(async () => {
        try {
            setLoading(true);

            // Construct URL with search parameter for Server-Side filtering
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: pageSize.toString(),
                sort: `${sortStatus.columnAccessor}:${sortStatus.direction}`,
                search: debouncedSearch, // This is key for searching all data
            });

            const res = await fetch(`/api/dash/admin/level-manager?${params.toString()}`, {
                credentials: 'include',
            });

            //   if (!res.ok) throw new Error('Failed to fetch');

            const json = await res.json();

            // Set data from API
            setRecords(json.data || []);
            // Update total count so pagination knows how many pages exist in total
            setTotalRecords(json.meta?.pagination?.total || 0);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, sortStatus, debouncedSearch, isUpdatedState]);

    useEffect(() => {
        fetchTransactionHistory();
    }, [page, pageSize, sortStatus, isUpdatedState, debouncedSearch]);


    const handleReset = () => {

    }

    const handleSearch = () => {

    }
    const skeletonRecords = Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        level: "",
        perLevelAmount: "",
        totalEarned: "",
    }));
    const Skeleton = ({ width = "w-full" }) => (
        <div
            className={`h-4 ${width} rounded bg-gray-300 animate-pulse`}
        />
    );



    return (
        <>
            <div className="panel flex flex-col lg:flex-row md:flex-row md:items-center justify-between gap-4 my-6">
                <div>
                    <h5 className="text-sm lg:text-base font-bold text-dark dark:text-white-light">Search Level Report</h5>
                    <p className="text-white-dark text-xs font-medium">View and manage commission distribution across network levels.</p>
                </div>

                {/* Optimized Search Bar */}
                <div>


                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                        className="flex items-center gap-2 w-full md:w-auto"
                    >
                        <div className="relative flex-1 md:w-72">
                            <span className="absolute inset-y-0 ltr:left-1 rtl:right-2 ltr:pl-3 flex items-center text-gray-400">
                                <IconSearch />
                            </span>
                            <input
                                type="text"
                                className="form-input ltr:pl-10  shadow-sm border-gray-200 focus:border-primary"
                                placeholder="Search User ID (e.g. EC288073)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {/* <button type="submit" className="btn btn-primary gap-2 whitespace-nowrap shadow-md">
                            <IconSearch />
                            Search
                        </button> */}
                        {search && (
                            <button
                                type="button"
                                onClick={() => { setSearch(''); handleReset(); }}
                                className="btn btn-outline-danger p-2"
                                title="Clear Search"
                            >
                                <IconRefresh size={18} />
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className="panel mt-6 border-none shadow-none">



                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-bold  text-black">Total Level Manager</h5>
                    {/* <input
                    className="form-input w-60"
                    placeholder="Search User or PAN..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                /> */}
                </div>

                <div className="datatables">
                    {loading ? (
                        <TransactionHistorySkeleton />
                    ) : (
                        <DataTable
                            striped
                            className="table-striped whitespace-nowrap"
                            records={records}
                            columns={[
                                {
                                    accessor: 'level',
                                    title: 'Username',
                                    render: ({ username }) =><span>{username}</span>    
                                },
                                {
                                    accessor: 'perLevelAmount',
                                    title: 'Name',
                                    render: ({ fullName }) => <span>{fullName}</span>
                                },
                                {
                                    accessor: 'totalEarned',
                                    title: 'Total Level Income',
                                    render: ({ levelIncome }) =><span className={`block px-2 font-bold`}>{levelIncome}</span>
                                },
                                {
                                    accessor: 'level',
                                    title: 'Check Current Level',
                                    render: ({userId}) =><Link href={`/dash/admin/level-manager/${userId}`} className='text-primary cursor-pointer hover:underline'><span>View</span> </Link> 
                                },
                            ]}
                            totalRecords={totalRecords}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={setPage}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={(size) => {
                                setPageSize(size);
                                setPage(1);
                            }}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}

                        />)}
                </div>





            </div>

        </>
    );
};

export default LevelManager;