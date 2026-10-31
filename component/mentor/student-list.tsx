'use client';

import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { getImageUrl } from '@/utils/common/common';
import { showToast } from '@/utils/toast';
import { TransactionHistorySkeleton } from '../E-wallet-manager/transactionSkeleton';

interface Student {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    profile_image?: {
        url: string;
    };
}

const PAGE_SIZES = [10, 20, 30, 50, 100];

const MyStudentList = () => {
    // const [isMounted, setIsMounted] = useState(false);
    // const [page, setPage] = useState(1);
    // const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    // const [search, setSearch] = useState('');

    // const [students, setStudents] = useState<Student[]>([]);
    // const [initialRecords, setInitialRecords] = useState<Student[]>([]);
    // const [recordsData, setRecordsData] = useState<Student[]>([]);

    // const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    //     columnAccessor: 'firstName',
    //     direction: 'asc',
    // });
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [totalRecords, setTotalRecords] = useState(0);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'createdAt',
        direction: 'desc',
    });
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
     useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);

        return () => clearTimeout(handler);
    }, [search]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/user/allUserList?page=${page}&pageSize=${pageSize}&sort=${sortStatus.columnAccessor}:${sortStatus.direction}&search=${debouncedSearch}`);
            const result = await res.json();

            const users = result?.data || [];
            setRecords(users?.data || []);
            setTotalRecords(users?.meta?.pagination?.total || 0);
        } catch (err) {
            showToast("error", "Something went wrong")
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [page, pageSize, sortStatus, debouncedSearch]);

   
    return (
        <div className="panel mt-6">
            <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                <h5 className="text-lg font-semibold">Student List</h5>

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

            <div className="datatables">
                {loading ? (
                    <TransactionHistorySkeleton />
                ) : (
                    <DataTable
                        className="table-hover whitespace-nowrap"
                        records={records}
                        columns={[
                            {
                                accessor: 'id',
                                title: '#',
                                width: 60,
                            },
                            {
                                accessor: 'firstName',
                                title: 'Student',
                                sortable: true,
                                render: ({ firstName, lastName, profile_image }) => (
                                    <div className="flex items-center gap-2">
                                        <img
                                            className="h-9 w-9 rounded-full object-cover"
                                            src={
                                                getImageUrl(profile_image?.url)
                                            }
                                            alt="profile"
                                        />
                                        <span className="font-medium">
                                            {firstName} {lastName}
                                        </span>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'username',
                                title: 'Username',
                                sortable: true,
                            },
                            {
                                accessor: 'mobileNumber',
                                title: 'Mobile',
                            },
                            {
                                accessor: 'email',
                                title: 'Email',
                            },
                            {
                                accessor: 'actions',
                                title: 'Action',
                                render: (record) => (
                                    <button
                                        className="btn btn-primary btn-sm rounded-full px-4"
                                        onClick={() =>
                                            (window.location.href = `/dash/mentor/student/${record.id}`)
                                        }
                                    >
                                        View Details
                                    </button>
                                ),
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
                        paginationText={({ from, to, totalRecords }) =>
                            `Showing ${from} to ${to} of ${totalRecords} entries`
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default MyStudentList;
