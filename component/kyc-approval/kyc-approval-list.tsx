'use client';

import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import sortBy from 'lodash/sortBy';
// import { Modal, Button, Select } from '@mantine/core';
import IconEye from '@/components/icon/icon-eye';
import IconDownload from '@/components/icon/icon-download';
import { formatDateAndTime, formatDateTime } from '@/utils/dateFormatter';
import { getImageUrl } from '@/utils/common/common';
import { Modal, Select, Button, Text, Stack, Group, Avatar, Badge, Divider, Textarea } from '@mantine/core';
import { IconUser, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { forwardRef } from 'react';
import { showToast } from '@/utils/toast';
import IconLoader from '@/components/icon/icon-loader';
const KYCApprovalList = () => {
    const PAGE_SIZES = [10, 20, 30];

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
    const fetchKYCData = async () => {
        try {
            setLoading(true);

            let url = `/api/dash/admin/kyc-approval?page=${page}&pageSize=${pageSize}&sort=${sortStatus.columnAccessor}:${sortStatus.direction}&search=${debouncedSearch}`;

            if (fromDate) url += `&from=${fromDate}`;
            if (toDate) url += `&to=${toDate}`;

            const res = await fetch(url, { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch');

            const json = await res.json();

            setRecords(json.data || []);
            setTotalRecords(json.meta?.pagination?.total || 0);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKYCData();
    }, [page, pageSize, sortStatus, fromDate, toDate, debouncedSearch, isUpdatedState]);

    const openUpdateModal = (id: number, status: string, name: string, username: string) => {
        setSelectedId(id);
        setStatusValue(status);
        setOpened(true);
        setFullName(name)
        setUserId(username)

    };



    const openDoc = (path: string) => {
        console.log({ path })
        if (!path) return;

        // If your API returns just the filename, prepend your upload folder path here
        // Example: const fullUrl = `https://api.yourdomain.com/uploads/${path}`;
        setDocUrl(path);
        setDocModal(true);
    };
    // interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    //     label: string;
    //     value: string;
    // }
    // const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    //     ({ label, value, ...others }, ref) => (
    //         <div ref={ref} {...others}>
    //             <Group noWrap spacing="xs" sx={(theme) => ({
    //                 padding: '10px 12px',
    //                 cursor: 'pointer',
    //                 // Force black color for text
    //                 color: theme.black,
    //                 '&:hover': {
    //                     backgroundColor: theme.colors.gray[1],
    //                 },
    //                 // If selected, give it a subtle background
    //                 '&[data-selected]': {
    //                     backgroundColor: theme.colors.blue[0],
    //                     color: theme.colors.blue[9],
    //                 }
    //             })}>
    //                 <Text size="sm" weight={500} sx={{ color: 'inherit' }}>
    //                     {label}
    //                 </Text>
    //             </Group>
    //         </div>
    //     )
    // );
    //  const saveStatus = async () => {
    //         const updated = records.map((item) =>
    //             item.id === selectedId ? { ...item, kyc_status: statusValue } : item
    //         );
    //         setRecords(updated);
    //         setOpened(false);
    //     };
    const saveStatus = async () => {
        if (statusValue === 'REJECTED' && !adminComment.trim()) {
            showToast("info", "Please provide a reason for rejection.");
        }
        setIsUpdating(true)

        try {
            const response = await fetch('/api/dash/admin/kyc-approval', { // Update this path to your route
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentId: selectedId, // The unique ID for the KYC record
                    kyc_status: statusValue,
                    admin_remarks: adminComment,
                }),
            });

            const result = await response.json();

            if (response?.ok && result?.status == 200) {
                showToast("success", result.message ?? "OK")
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
        <div className="panel mt-6 border-none shadow-none">

            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-bold uppercase text-black">KYC Approval List</h5>
                <input
                    className="form-input w-60"
                    placeholder="Search User or PAN..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="datatables">
                <DataTable
                    highlightOnHover
                    fetching={loading}
                    className="whitespace-nowrap table-hover"
                    records={records}
                    columns={[
                        {
                            accessor: 'user',
                            title: 'User Id',
                            titleClassName: 'text-black font-bold',
                            render: ({ user }) => <span className="font-bold text-black">{user && (user?.username ?? "")}</span>,
                        },
                        {
                            accessor: 'name',
                            title: 'Name',
                            titleClassName: 'text-black font-bold',
                            render: ({ user }) => <span className="font-bold text-black">{user && (user?.fullName ?? "")}</span>,
                        },
                        {
                            accessor: 'pan_card',
                            title: 'PAN',
                            titleClassName: 'text-black font-bold',
                            render: ({ pan_card, pan_doc_path, pan_doc }) => (
                                <div className="flex items-center gap-2 hover:underline hover:text-primary cursor-pointer">
                                    <button
                                        onClick={() => openDoc(pan_doc?.url ? getImageUrl(pan_doc?.url) : pan_doc_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/kyc/${pan_doc_path}` : null)}
                                        className={`${(pan_doc_path || pan_doc?.url) ? 'text-primary' : 'text-gray-300 pointer-events-none'} hover:opacity-70 flex items-center gap-2 hover:underline hover:text-primary cursor-pointer`}
                                    >
                                        <span className="text-gray-700 hover:text-primary">{pan_card || 'N/A'}</span>

                                        <IconEye className="w-5 h-5 hover:text-primary" />
                                    </button>
                                </div>
                            ),
                        },

                        {
                            accessor: 'bank_name',
                            title: 'Bank Details',
                            titleClassName: 'text-black font-bold',
                            render: ({ bank_name, account_number, passbook_doc, passbook_doc_path }) => (
                                <div
                                    onClick={() => openDoc(passbook_doc?.url ? getImageUrl(passbook_doc?.url) : passbook_doc_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/kyc/${passbook_doc_path}` : null)}
                                    className="flex items-center gap-2 hover:underline hover:text-primary cursor-pointer">

                                    <div className="flex flex-col leading-tight"
                                    >
                                        <span className="font-bold text-black">{bank_name || 'N/A'}</span>
                                        <span className="text-xs font-semibold text-gray-400">{account_number}</span>

                                    </div>
                                    <button

                                        className={`${(passbook_doc_path || passbook_doc?.url) ? 'text-primary' : 'text-gray-300 pointer-events-none'} hover:opacity-70 flex items-center gap-2 hover:underline hover:text-primary cursor-pointer`}
                                    >
                                        {/* <span className="text-gray-700 hover:text-primary">{aadhar_card || 'N/A'}</span> */}

                                        <IconEye className="w-5 h-5 hover:text-primary" />
                                    </button>
                                </div>
                            ),
                        },
                        {
                            accessor: 'aadhar_card',
                            title: 'Aadhaar no.',
                            titleClassName: 'text-black font-bold',
                            render: ({ aadhar_card, address_proof_doc_path, aadhar_doc }) => (
                                <div className="flex items-center gap-2 hover:underline hover:text-primary cursor-pointer">
                                    <button
                                        onClick={() => openDoc(aadhar_doc?.url ? getImageUrl(aadhar_doc?.url) : address_proof_doc_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/kyc/${address_proof_doc_path}` : null)}
                                        className={`${(address_proof_doc_path || aadhar_doc?.url) ? 'text-primary' : 'text-gray-300 pointer-events-none'} hover:opacity-70 flex items-center gap-2 hover:underline hover:text-primary cursor-pointer`}
                                    >
                                        <span className="text-gray-700 hover:text-primary">{aadhar_card ?? 'N/A'}</span>

                                        <IconEye className="w-5 h-5 hover:text-primary" />
                                    </button>
                                </div>
                            ),
                        },
                        {
                            accessor: 'ifsc_code',
                            title: 'IFSC',
                            titleClassName: 'text-black font-bold',
                            render: ({ ifsc_code }) => <span className="text-gray-400 font-medium">{ifsc_code ?? 'N/A'}</span>,
                        },
                        {
                            accessor: 'upi_id',
                            title: 'UPI Id',
                            titleClassName: 'text-black font-bold',
                            render: ({ upi_id }) => <span className="text-gray-400 font-medium">{upi_id ?? 'N/A'}</span>,
                        },
                        {
                            accessor: 'kyc_status',
                            title: 'Status',
                            titleClassName: 'text-black font-bold',
                            render: ({ kyc_status }) => {
                                // const status = kyc_status || 'PENDING';
                                const isApproved = kyc_status === 'APPROVED';
                                const isRejected = kyc_status === 'REJECTED';
                                const isPending = !kyc_status || (kyc_status === 'PENDING' || kyc_status === 'IN_PROGRESS');
                                return (
                                    <div
                                        className={`flex w-fit items-center gap-1 rounded-md border px-2 py-0.5 ${isApproved
                                            ? 'border-green-100 bg-green-50 text-green-600'
                                            : isRejected
                                                ? 'border-red-100 bg-red-50 text-red-600'
                                                : isPending ? 'border-warning bg-warning-light text-warning'
                                                    : ''
                                            }`}
                                    >
                                        <span className={`h-1.5 w-1.5 rounded-full ${isApproved ? 'bg-green-500' : isRejected ? 'bg-red-500' : isPending ? 'bg-warning' : "bg-dark"}`} />
                                        <span className="text-[11px] font-bold capitalize">{kyc_status ? kyc_status?.toLowerCase()?.replace('_', ' ') : "PENDING"}</span>
                                    </div>
                                );
                            },
                        },
                        {
                            accessor: "remark",
                            title: "Admin Remarks",
                            sortable: true,
                            render: ({ admin_remarks }) => <span>{admin_remarks ?? ""}</span>,
                        },
                        {
                            accessor: "createdAt",
                            title: "Requested at",
                            sortable: true,
                            render: ({ createdAt }) => `${createdAt ? formatDateAndTime(createdAt) : ""}`,
                        },
                        {
                            accessor: "createdAt",
                            title: "Updated at",
                            sortable: true,
                            render: ({ updatedAt }) => `${updatedAt ? formatDateAndTime(updatedAt) : ""}`,
                        },
                        {
                            accessor: 'actions',
                            title: 'Actions',
                            titleClassName: 'text-black font-bold text-right',
                            render: ({ id, documentId, kyc_status, user }) => (
                                <div className="text-right">
                                    <button onClick={() => openUpdateModal(documentId, kyc_status, user?.fullName, user?.username)} className="font-semibold text-blue-600 hover:underline">
                                        Review
                                    </button>
                                </div>
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
                />
            </div>

            {/* <Modal opened={opened} onClose={() => setOpened(false)} title="Update KYC Status" >
                <div>Name: {"N/A"}</div>
                <div>Userame: {"N/A"}</div>
                <Select
                    label="KYC Status"
                    value={statusValue}
                    onChange={(val: any) => setStatusValue(val)}
                    data={[
                        { value: 'UNDER_VERIFICATION', label: 'Under Verification' },
                        { value: 'APPROVED', label: 'Approved' },
                        { value: 'REJECTED', label: 'Rejected' },
                    ]}
                />
                <Button fullWidth mt="md" onClick={saveStatus} className="bg-brand hover:bg-brand-hover">Update Status</Button>
            </Modal> */}



            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={<Text fw={700} className='text-dark'>Update KYC Verification</Text>}

                radius="md"
                padding="xl"
                // FIX: Change overlayProps to individual props
                overlayOpacity={0.55}
                overlayBlur={3}
            >
                <Stack spacing="md">
                    {/* User Info Section */}
                    <Group noWrap align="flex-start" spacing="sm">
                        <Avatar radius="xl" size="lg" color="blue">
                            <IconUser size="1.5rem" />
                        </Avatar>
                        <Stack spacing={2}>
                            <Text weight={600} className='text-dark '>{fullName ?? ""}</Text>
                            <Badge variant="light" color="gray">{userId ?? ""}</Badge>
                        </Stack>
                    </Group>

                    {/* NEW: Student Comment Display */}
                    {/* {studentComment && (
                        <div className="bg-gray-50 p-3 rounded-md border-l-4 border-blue-400">
                            <Text size="xs" color="dimmed" weight={700} transform="uppercase">Student's Comment:</Text>
                            <Text size="sm" className="text-black italic">"{studentComment}"</Text>
                        </div>
                    )} */}

                    <Divider my="xs" label="Status Management" labelPosition="center" />

                    {/* Selection Section */}
                    <Select
                        label="Verification Decision"
                        description="Choose the new status for this user's identity documents"
                        placeholder="Select status"
                        withinPortal
                        value={statusValue}
                        onChange={(val) => setStatusValue(val || '')}
                        data={[
                            { value: 'PENDING', label: '⏳ Under Verification' },
                            { value: 'APPROVED', label: '✅ Approved' },
                            { value: 'REJECTED', label: '❌ Rejected' },
                        ]}
                        styles={(theme) => ({
                            input: { color: '#000000', fontWeight: 500 },
                            item: { color: '#000000' },
                            dropdown: { border: '1px solid #ced4da', boxShadow: theme.shadows.md },
                            label: { textSize: "12px" }
                        })}
                    />

                    {/* NEW: Admin Comment Input */}
                    <Textarea
                        label="Admin Remarks"
                        placeholder={statusValue === 'REJECTED' ? "" : "Optional internal notes..."}
                        minRows={3}
                        value={adminComment}
                        onChange={(event) => setAdminComment(event.currentTarget.value)}
                        // Make it required/red-bordered if status is REJECTED to ensure clarity
                        error={statusValue === 'REJECTED' && !adminComment ? "Reason is required for rejection" : null}
                        styles={{
                            label: { fontWeight: 500, textSize: "12px" },
                            input: { color: '#000' }
                        }}
                    />

                    {/* Footer Actions */}
                    <Stack spacing="sm" mt="lg">
                        <Button
                            fullWidth
                            onClick={saveStatus}

                            radius="md"
                            leftIcon={<IconCheck size={18} />}
                            className={`bg-brand hover:bg-brand-hover transition-all`}
                            loading={isUpdating}
                            // Disable button if REJECTED but no comment provided
                            disabled={statusValue === 'REJECTED' && !adminComment}
                        >
                            {/* {isUpdating ?
                                <> <IconLoader className="inline-block shrink-0 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2" />Loading...</> :
                                "Confirm Changes"
                            } */}
                            Confirm Changes

                        </Button>

                        <Button
                            fullWidth
                            className="bg-danger text-white hover:bg-danger"
                            onClick={() => setOpened(false)}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </Modal>
            <Modal opened={docModal} onClose={() => setDocModal(false)} title="Document Preview" size="lg" centered>
                <img src={docUrl} alt="Document" className="w-full rounded shadow-sm" />
            </Modal>
        </div>
    );
};

export default KYCApprovalList;