'use client';

import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { formatDateTime } from '@/utils/dateFormatter';
import { getImageUrl, getRandomColor, getTextColor } from '@/utils/common/common';
import IconBell from '@/components/icon/icon-bell';
import { capitalizeFirstWord, capitalizeSubstring } from '@/utils/helpers/capitalize';

const PAGE_SIZES = [10, 20, 30, 50, 100];

const DownlineList = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    const [initialRecords, setInitialRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [recordsData, setRecordsData] = useState([]);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'username',
        direction: 'asc',
    });
    const [loading, setLoading] = useState(true);

    // Fetch downline data
    const getDownline = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/dash/affiliate/downline', {
                method: 'GET',
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch data');

            const data = await res.json();
            setInitialRecords(data?.data?.data?.users || []);
            setFilteredRecords(data?.data?.data?.users || []);
        } catch (err) {
            console.error('Data fetch failed:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDownline();
    }, []);

    // Pagination: derive current page
    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(filteredRecords.slice(from, to));
    }, [page, pageSize, filteredRecords]);

    // Search filter
    useEffect(() => {
        const searchText = search.toLowerCase().trim();

        if (!searchText) {
            setFilteredRecords(initialRecords);
            setPage(1);
            return;
        }

        const filtered = initialRecords.filter((item) => {
            const fullName = item?.user?.fullName?.toLowerCase() || '';
            const username = item?.user?.username?.toLowerCase() || '';
            const createdAt = item?.user?.createdAt?.toLowerCase() || '';

            return (
                username.includes(searchText) ||
                fullName.includes(searchText) ||
                createdAt.includes(searchText)
            );
        });

        setFilteredRecords(filtered);
        setPage(1);
    }, [search, initialRecords]);

    // Sorting
    useEffect(() => {
        const data = sortBy(filteredRecords.length ? filteredRecords : initialRecords, sortStatus.columnAccessor);
        const sorted = sortStatus.direction === 'desc' ? data.reverse() : data;
        setFilteredRecords(sorted);
        setPage(1);
    }, [sortStatus]);

    // Skeleton placeholder
    const skeletonRecords = Array.from({ length: 10 }).map((_, i) => ({
        sno: i,
        username: '',
        name: '',
        registrationDate: '',
    }));
    const Skeleton = ({ width = 'w-full' }) => (
        <div className={`h-4 ${width} rounded bg-gray-300 animate-pulse`} />
    );

    return (
        <div className="panel mt-6">
            <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                <h5 className="text-lg font-semibold dark:text-white-light">Downline List</h5>
                <div className="ltr:ml-auto rtl:mr-auto">
                    <input
                        type="text"
                        className="form-input w-auto"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <DataTable
                striped
                className="table-striped whitespace-nowrap"
                records={loading ? skeletonRecords : recordsData}
                columns={[
                    {
                        accessor: 'sno',
                        title: 'S.No',
                        width: 80,
                        render: (_record, index) =>
                            loading ? (
                                <Skeleton width="w-12" />
                            ) : (
                                <span>{(page - 1) * pageSize + index + 1}</span>
                            ),
                    },
                    {
                        accessor: 'name',
                        title: 'Name',
                        sortable: true,
                        render: ({ user }) => {
                            if (!user) return <Skeleton width="w-24" />;

                            const bg = getRandomColor(user?.id);

                            return (
                                <div className="relative flex items-center">
                                    {(user?.profile_image?.url || user?.profile_img_path) ? (
                                        <img
                                            // src={getImageUrl(user?.profile_image?.url)}
                                            src={
                                                user?.profile_image?.url
                                                    ? `${getImageUrl(user?.profile_image?.url)}?t=${Date.now()}`
                                                    : user?.profile_img_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/${user?.profile_img_path}` : "/assets/images/fallback-profile.png"
                                            }
                                            className="h-10 w-10 rounded-full object-cover"
                                            alt=""
                                        />
                                    ) : (
                                        <div
                                            className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-md uppercase"
                                            style={{ backgroundColor: bg, color: getTextColor(bg) }}
                                        >
                                            {user?.fullName
                                                ?.split(' ')
                                                .map((n: any) => n[0])
                                                .slice(0, 2)
                                                .join('')}
                                        </div>
                                    )}
                                    <div className="px-2.5 text-dark font-semibold">{capitalizeSubstring(user?.fullName)}</div>
                                </div>
                            );
                        },
                    },
                    {
                        accessor: 'username',
                        title: 'Username',
                        sortable: true,
                        render: ({ user }) =>
                            loading ? <Skeleton width="w-12" /> : <span className="badge bg-dark">{user?.username}</span>,
                    },
                    //   {
                    //     accessor: 'level',
                    //     title: 'Level',
                    //     sortable: true,
                    //     render: ({ level }) =>
                    //       loading ? <Skeleton width="w-12" /> : <span className="badge bg-success">{level}</span>,
                    //   },
                    {
                        accessor: 'level',
                        title: 'Level',
                        sortable: true,
                        render: ({ level }) => {
                            if (loading) return <Skeleton width="w-12" />;
                            return (
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
                                            }[level] ?? '#6B7280',
                                    }}
                                >
                                    Level {level}
                                </span>
                            );
                        },
                    },

                    {
                        accessor: 'registrationDate',
                        title: 'Registration Date',
                        sortable: true,
                        render: ({ user }) => (loading ? <Skeleton width="w-12" /> : <span>{formatDateTime(user?.createdAt)}</span>),
                    },

                ]}
                totalRecords={filteredRecords.length}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={setPage}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                minHeight={200}
                paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
            />
        </div>
    );
};

export default DownlineList;
