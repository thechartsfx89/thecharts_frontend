'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconXCircle from '@/components/icon/icon-x-circle';
import IconPencil from '@/components/icon/icon-pencil';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import { getImageUrl, getRandomColor, getTextColor } from '@/utils/common/common';
import { formatDateAndTime, formatDateTimeUTC, formatLastSeen } from '@/utils/dateFormatter';
import { capitalizeFirstWord, capitalizeSubstring } from '@/utils/helpers/capitalize';



const MySponsorList = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState([]);
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');

    const getDirectReferral = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/dash/affiliate/direct-referral", {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await res.json();
            setInitialRecords(data?.data?.users ?? []);
            // console.log(data?.data?.members?.users , ">>>>>>")
        } catch (err) {
            console.error("Data fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDirectReferral()
    }, [])

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        if (!search) {
            setRecordsData(initialRecords); // ✅ restore original data
            setPage(1);
            return;
        }

        const searchText = search.toLowerCase().trim();

        const filtered = initialRecords.filter((item) => {
            const fullName = item?.user?.fullName?.toLowerCase() || '';
            const username = item?.user?.username?.toString().toLowerCase() || '';
            const joinedAt = item?.joinedAt?.toLowerCase() || '';
            const affiliateJoinedAt = item?.user?.affiliateJoinedAt?.toLowerCase() || '';
            const mobile = item?.user?.mobile?.toString() || '';

            return (
                fullName.includes(searchText) ||
                username.includes(searchText) ||
                joinedAt.includes(searchText) ||
                affiliateJoinedAt.includes(searchText) ||
                mobile.includes(searchText)
            );
        });

        setRecordsData(filtered);
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);


   

    const formatDate = (date: string | number | Date) => {
        if (date) {
            const dt = new Date(date);
            const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
            const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            return day + '/' + month + '/' + dt.getFullYear();
        }
        return '';
    };

    const randomColor = () => {
        const color = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
        const random = Math.floor(Math.random() * color.length);
        return color[random];
    };

    const randomStatus = () => {
        const status = ['PAID', 'APPROVED', 'FAILED', 'CANCEL', 'SUCCESS', 'PENDING', 'COMPLETE'];
        const random = Math.floor(Math.random() * status.length);
        return status[random];
    };
    return (
        <>
            <div className="panel mt-6">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">Direct Referral List</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="datatables">
                    {isMounted && (
                        <DataTable
                            striped
                            className="table-striped whitespace-nowrap"
                            records={recordsData}
                            columns={[
                                {
                                    accessor: 'sno',
                                    title: 'S.No.',
                                    width: 70,
                                    render: (_row, index) => <span>{index + 1}</span>,
                                },

                                {
                                    accessor: 'name',
                                    title: 'Name',
                                    sortable: true,
                                    render: ({ user }) => {
                                        const bg = getRandomColor(user?.id);

                                        return (

                                            <div className="relative flex items-center ">
                                                {/* <img src={getImageUrl(person?.profile_image?.url)} className="h-12 w-12 rounded-full object-cover" alt="" /> */}
                                                {(user?.profile_image?.url || user?.profile_img_path )? (
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
                                                        className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-[12px] uppercase"
                                                        style={{ backgroundColor: bg, color: getTextColor(bg) }}
                                                    >
                                                        {user?.fullName
                                                            ?.split(' ')
                                                            .map((name: any) => name[0])
                                                            .slice(0, 2)
                                                            .join('')}

                                                    </div>
                                                )}
                                                <div className="pr">

                                                    <p className="px-2.5 font-semibold">{`${capitalizeSubstring(user?.fullName)}`} </p>

                                                </div>

                                            </div>
                                        )
                                    },
                                },
                                {
                                    accessor: 'username',
                                    title: 'Username',
                                    sortable: true,
                                    render: ({ user }) => (
                                        <span className="badge bg-dark">
                                            {user?.username ?? ""}
                                        </span>
                                    ),
                                },
                                {
                                    accessor: 'registrationDate',
                                    title: 'Registration Date',
                                    sortable: true,
                                    render: ({ user }) => <span>{formatDateTimeUTC(user?.createdAt ?? "")}</span>,
                                },
                                {
                                    accessor: 'doa',
                                    title: 'DOA',
                                    render: ({ joinedAt, user }) => <span className={(user?.status && joinedAt) ? `badge bg-secondary-light text-dark` : ""}>{(user?.status && joinedAt) ? formatDateTimeUTC(joinedAt) : "-"}</span>,
                                },
                                {
                                    accessor: 'phone',
                                    title: 'Mobile',
                                    sortable: true,
                                    render: ({ user }) => <span>{user?.mobile ?? ""}</span>,
                                },
                                {
                                    accessor: 'activation',
                                    title: 'Activation',
                                    render: () => <span>-</span>,
                                },
                                {
                                    accessor: 'members',
                                    title: 'No of Member',
                                    render: ({ downlineCount }) => (
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold
                                             ${downlineCount > 0
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-red-500 text-white'
                                                }`}
                                        >
                                            {downlineCount ?? 0}
                                        </span>
                                    ),
                                },

                                {
                                    accessor: 'status',
                                    title: 'Status',
                                    sortable: false,
                                    render: ({ user }) => (
                                        <span
                                            className={`badge ${user?.status
                                                ? 'bg-success'
                                                : 'bg-warning'
                                                }`}
                                        >
                                            {/* {user?.affiliateJoinedAt ? 'Activated' : 'Not Activated'} */}
                                            {user?.status ? 'Activated' : 'Not Activated'}

                                        </span>
                                    ),
                                },
                            ]}
                            totalRecords={initialRecords.length}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                        />

                    )}
                </div>
            </div>


        </>
    );
};

export default MySponsorList;
