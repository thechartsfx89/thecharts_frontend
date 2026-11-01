'use client';

import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useMemo, useState, useCallback } from 'react';
import sortBy from 'lodash/sortBy';
// import { Modal, Button, Select } from '@mantine/core';
import { formatDateAndTime, formatDateTime, formatDateTimeUTC } from '@/utils/dateFormatter';
import { TransactionHistorySkeleton } from '../E-wallet-manager/transactionSkeleton';
import { Modal, Select, Button, Text, Stack, Group, Avatar, Badge, Divider, Textarea } from '@mantine/core';
import { showToast } from '@/utils/toast';
import { IconCheck, IconUser } from '@tabler/icons-react';
const AdmissionApprovalList = () => {
    const PAGE_SIZES = [10, 20, 30, 50];

    // Search States
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [isUpdating, setIsUpdating] = useState(false);

    const [opened, setOpened] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [statusValue, setStatusValue] = useState<string>('');
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination & Sorting States
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [userAllData, setUserAllData] = useState(null);
    const [adminComment, setAdminComment] = useState("")
    const [isUpdatedState, setIsUpdatedState] = useState(false);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'createdAt',
        direction: 'desc',
    });

    /**
     * EFFECT: Debounce Search
     * Only triggers a re-fetch after the user stops typing for 500ms
     */
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to first page when searching
        }, 500);

        return () => clearTimeout(handler);
    }, [search]);

    /**
     * FUNCTION: Fetch Data from API
     * Sends page, size, sort, and search query to the server
     */
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

            const res = await fetch(`/api/dash/admin/admission-approval?${params.toString()}`, {
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to fetch');

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

    // const filteredRecords = useMemo(() => {
    //     if (!search) return records;
    //     const query = search.toLowerCase();
    //     return records.filter((item:any) =>
    //         item?.user?.username?.toLowerCase()?.includes(query) ||
    //     item?.user?.fullName?.toLowerCase()?.includes(query) ||
    //         item?.course?.course_title?.toLowerCase()?.includes(query) ||
    //         item?.purchased_course?.course?.course_title?.toLowerCase()?.includes(query) ||

    //         item?.transaction_id?.toLowerCase()?.includes(query)
    //     );
    // }, [records, search]);
//     const filteredRecords = useMemo(() => {
//   try {
//     // Safety check for records
//     if (!Array.isArray(records)) return [];

//     // If no search, return original data
//     if (!search || typeof search !== "string") return records;

//     const query = search.toLowerCase().trim();

//     if (!query) return records;

//     return records.filter((item: any) => {
//       try {
//         const username = item?.user?.username?.toLowerCase?.() || "";
//         const fullName = item?.user?.fullName?.toLowerCase?.() || "";
//         const courseTitle = item?.course?.course_title?.toLowerCase?.() || "";
//         const purchasedCourseTitle =
//           item?.purchased_course?.course?.course_title?.toLowerCase?.() || "";
//         const transactionId = item?.transaction_id?.toLowerCase?.() || "";

//         return (
//           username.includes(query) ||
//           fullName.includes(query) ||
//           courseTitle.includes(query) ||
//           purchasedCourseTitle.includes(query) ||
//           transactionId.includes(query)
//         );
//       } catch (err) {
//         console.error("Filter item error:", err, item);
//         return false;
//       }
//     });
//   } catch (error) {
//     console.error("Filtering error:", error);
//     return [];
//   }
// }, [records, search]);

//     const sortedRecords = useMemo(() => {
//         const data = sortBy(filteredRecords, sortStatus.columnAccessor);
//         return sortStatus.direction === 'desc' ? data.reverse() : data;
//     }, [filteredRecords, sortStatus]);

//     const paginatedRecords = useMemo(() => {
//         const from = (page - 1) * pageSize;
//         const to = from + pageSize;
//         return sortedRecords.slice(from, to);
//     }, [sortedRecords, page, pageSize]);

    const openUpdateModal = (record:any) => {
        setSelectedId(record?.documentId);
        setStatusValue(record?.payment_status);
        setOpened(true);
        setUserAllData(record)
    };

    // const saveStatus = () => {
    //     const updated = records.map((item) =>
    //         item.id === selectedId ? { ...item, paymentStatus: statusValue } : item
    //     );
    //     setRecords(updated);
    //     setOpened(false);
    // };
const saveStatus = async () => {
        if ((statusValue === 'REJECTED' || statusValue === 'FAILED') && !adminComment.trim()) {
            showToast("info", "Please provide a reason for rejection or failed.");
        }
        setIsUpdating(true)

        try {
            const response = await fetch('/api/dash/admin/admission-approval', { // Update this path to your route
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentId: selectedId, // The unique ID for the KYC record
                    payment_status: statusValue,
                    admin_comment: adminComment,
                }),
            });

            const result = await response.json();

            if (response?.ok && result?.status == 200) {
                showToast("success", result.message ?? "Success")
                setOpened(false);
                setIsUpdatedState(!isUpdatedState)
            } else {
                // throw new Error(result.message || 'Failed to update');
                showToast("error", "Something went wrong")
            }
        } catch (error) {
            console.error("Update failed:", error);
            // alert("Error updating status. Please try again.");
            showToast("error", "Failed to update")

        } finally {
            // setIsSaving(false);
            setIsUpdating(false)

        }
    };
    return (
        <div className="panel border-none shadow-none">
            <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center justify-between">
                <h5 className="text-lg font-bold text-dark">Payments</h5>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by user id..."
                        className="form-input w-full md:w-72"
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
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={records}
                        columns={[
                            {
                                accessor: 'id',
                                title: '#',
                                width: 70,
                                render: (_row, index) => (page - 1) * pageSize + index + 1,
                            },
                            {
                                accessor: 'user',
                                title: 'User Id',
                                titleClassName: 'text-black font-bold',
                                render: ({ user }) => <span className="font-bold text-black">{user?.username || 'N/A'}</span>,
                            },
                            {
                                accessor: 'name',
                                title: 'Name',
                                titleClassName: 'text-black font-bold',
                                render: ({ user }) => <span className="font-bold text-black">{user?.fullName || 'N/A'}</span>,
                            },
                            {
                                accessor: 'course',
                                title: 'Course',
                                titleClassName: 'text-black font-bold',
                                render: ({ course, purchased_course }) => (
                                    <span className="text-gray-700 font-medium">
                                        {course?.course_title || purchased_course?.course?.course_title || 'N/A'}
                                    </span>
                                ),
                            },
                            {
                                accessor: 'course',
                                title: 'Course Price',
                                titleClassName: 'text-black font-bold',
                                render: ({ course, purchased_course }) => <span className="text-gray-700 font-medium">{course?.course_price ?? purchased_course?.course?.course_price ?? ""}</span>,
                            },
                            {
                                accessor: 'paymentDate',
                                title: 'Payment date',
                                titleClassName: 'text-black font-bold',
                                sortable: true,
                                render: ({ payment_date }) => (
                                    <span className="text-gray-500 text-sm">
                                        {payment_date ? formatDateTimeUTC(payment_date) : '-'}
                                    </span>
                                ),
                            },
                            {
                                accessor: 'paymentStatus',
                                title: 'Status',
                                titleClassName: 'text-black font-bold',
                                render: ({ payment_status }) => {
                                    const status = payment_status?.toUpperCase();
                                    const isSuccess = status === 'SUCCESS';
                                    const isFailed = status === 'FAILED' || status === 'REJECTED';
                                    const isPending = status === 'UNDER_VERIFICATION';
                                    
                                    return (
                                        <div className={`flex w-fit items-center gap-1 rounded-md border px-2 py-0.5 ${
                                            isSuccess ? 'border-green-100 bg-green-50 text-green-600' :
                                            isFailed ? 'border-red-100 bg-red-50 text-red-600' :
                                            isPending ? 'border-yellow-200 bg-yellow-50 text-yellow-700' : 'border-gray-200 bg-gray-50 text-gray-600'
                                        }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${isSuccess ? 'bg-green-500' : isFailed ? 'bg-red-500' : isPending ? 'bg-yellow-500' : "bg-gray-400"}`} />
                                            <span className="text-[11px] font-bold capitalize">
                                                {payment_status?.toLowerCase()?.replace('_', ' ')}
                                            </span>
                                        </div>
                                    );
                                },
                            },
                            {
                                accessor: 'paymentMode',
                                title: 'Mode',
                                titleClassName: 'text-black font-bold',
                                render: ({ payment_mode }) => (
                                    <span className="text-xs font-bold text-gray-400 uppercase">{payment_mode ? payment_mode?.replace('_', ' ') : ""}</span>
                                ),
                            },
                            {
                                accessor: 'transactionId',
                                title: 'Transaction Id',
                                titleClassName: 'text-black font-bold',
                                render: ({ transaction_id }) => (
                                    <span className="font-mono text-gray-600 tracking-tighter">{transaction_id || '-'}</span>
                                ),
                            },
                            {
                                accessor: 'actions',
                                title: 'Actions',
                                titleClassName: 'text-black font-bold text-right',
                                cellsClassName: 'text-right',
                                render: (record) => (
                                    <button
                                        onClick={() => openUpdateModal(record)}
                                        className="font-semibold text-blue-600 hover:underline"
                                    >
                                        Review
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
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) =>
                            `Showing ${from} to ${to} of ${totalRecords} entries`
                        }
                    />
                )}
            </div>

            {/* Modal */}
            {/* <Modal opened={opened} onClose={() => setOpened(false)} title="Update Payment Status" centered>
                <div className="space-y-4">
                    <Select
                        label="Payment Status"
                        placeholder="Select status"
                        value={statusValue}
                        onChange={(value) => setStatusValue(value || '')}
                        data={[
                            { value: 'UNDER_VERIFICATION', label: 'Under Verification' },
                            { value: 'SUCCESS', label: 'Success' },
                            { value: 'FAILED', label: 'Failed' },
                        ]}
                    />
                    <Button fullWidth onClick={saveStatus} className="bg-brand text-white hover:bg-brand-hover">
                        Update Status
                    </Button>
                </div>
            </Modal> */}

          <Modal
    opened={opened}
    onClose={() => setOpened(false)}
    title={<Text weight={700} color="dark">Course Payment Request</Text>}
    radius="md"
    padding="xl"
    overlayOpacity={0.55}
    overlayBlur={3}
>
    <Stack spacing="md">
        {/* User Info Section */}
        <Group noWrap align="flex-start" spacing="sm">
            <Avatar radius="xl" size="lg" color="blue">
                <IconUser size="2rem" />
            </Avatar>
            <Stack spacing={2}>
                <Text weight={600} size="md" color="dark">{userAllData?.user?.fullName ?? ""}</Text>
                <Badge variant="light" color="gray" size="md">{userAllData?.user?.username ?? ""}</Badge>
            </Stack>
        </Group>

        {/* --- NEW: Course Payment Details Section --- */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="bg-gray-50 p-2 border-b border-gray-200">
                <Text size="xs" weight={700} color="gray" transform="uppercase">Payment Information</Text>
            </div>
            <div className="p-3">
                <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Course:</span>
                    <span className="text-sm font-bold text-black">{userAllData?.courseName ?? "Full Course"}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="text-sm font-bold text-green-700">₹ {userAllData?.course?.course_price ?? userAllData?.purchased_course?.course?.course_price ?? "0"}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Date:</span>
                    <span className="text-sm text-black">{userAllData?.payment_date ? formatDateAndTime(userAllData?.payment_date) : "N/A"}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Mode:</span>
                    <Badge size="xs" color="blue" variant="filled">{userAllData?.payment_mode ?? ""}</Badge>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transaction ID:</span>
                    <span className="text-sm font-mono font-semibold text-black">{userAllData?.transaction_id ?? "N/A"}</span>
                </div>
            </div>
        </div>

        <Divider my="xs" label="Status Management" labelPosition="center" />

        {/* Selection Section */}
        <Select
            label="Course Payment Decision"
            description="Update the status for this enrollment request"
            placeholder="Select status"
            withinPortal
            value={statusValue}
            onChange={(val) => setStatusValue(val || '')}
            data={[
                { value: 'UNDER_VERIFICATION', label: '⏳ Under Verification' },
                { value: 'SUCCESS', label: '✅ Success' },
                { value: 'REJECTED', label: '❌ Rejected' },
                { value: 'FAILED', label: '❌ Failed' },
            ]}
            styles={(theme) => ({
                input: { color: '#000000', fontWeight: 500 },
                item: { color: '#000000' },
                dropdown: { border: '1px solid #ced4da', boxShadow: theme.shadows.md }
            })}
        />

        {/* Admin Comment Input */}
        <Textarea
            label="Admin Remarks"
            placeholder={(statusValue === 'REJECTED' || statusValue === 'FAILED' )? "" : "Optional internal notes..."}
            minRows={3}
            value={adminComment}
            onChange={(event) => setAdminComment(event.currentTarget.value)}
            error={(statusValue === 'REJECTED' || statusValue === 'FAILED' ) && !adminComment ? "Reason is required for rejection or failed" : null}
            styles={{
                label: { fontWeight: 500 },
                input: { color: '#000' }
            }}
        />

        

        {/* Footer Actions */}
        <Stack spacing="sm" mt="lg">
            <Button
                fullWidth
                onClick={saveStatus}
                size="md"
                radius="md"
                leftIcon={<IconCheck size={18} />}
                className="bg-brand hover:bg-brand-hover transition-all"
                loading={isUpdating}
                disabled={(statusValue === 'REJECTED' || statusValue === 'FAILED' ) && !adminComment}
            >
                Confirm Changes
            </Button>

            <Button
                fullWidth
                className="bg-danger text-white"
                onClick={() => setOpened(false)}
            >
                Cancel
            </Button>
        </Stack>
    </Stack>
</Modal>
        </div>
    );
};

export default AdmissionApprovalList;