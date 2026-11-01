'use client';

import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import sortBy from 'lodash/sortBy';
// import { Modal, Button, Select, TextInput, Textarea } from '@mantine/core';
import { formatDateTimeUTC } from '@/utils/dateFormatter';
import { IconDownload, IconArrowRight, IconUser, IconCheck } from '@tabler/icons-react'; // Example icons
import { TransactionHistorySkeleton } from '../E-wallet-manager/transactionSkeleton';
import Link from 'next/link';
import { Modal, Select, Button, Text, Stack, Group, Avatar, Badge, Divider, Textarea, Tooltip } from '@mantine/core';
import { showToast } from '@/utils/toast';
import * as XLSX from 'xlsx';



const WithdrawalApprovalList = () => {
    const PAGE_SIZES = [10, 20, 30, 50];

    // const [search, setSearch] = useState('');

    const [totalRecords, setTotalRecords] = useState(0);
    const [opened, setOpened] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [statusValue, setStatusValue] = useState<string>('');
    const [fullName, setFullName] = useState('');
    const [userAllData, setUserAllData] = useState(null);

    const [userId, setUserId] = useState('');
    const [adminComment, setAdminComment] = useState("")
    const [studentComment, setStudentComment] = useState("")

    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUpdatedState, setIsUpdatedState] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'createdAt',
        direction: 'desc',
    });

    const [search, setSearch] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    // const [opened, setOpened] = useState(false);
    // const [selectedId, setSelectedId] = useState<number | null>(null);
    // const [statusValue, setStatusValue] = useState<string>('');
    const [adminRemark, setAdminRemark] = useState('');



    const fetchTransactionHistory = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams({
                page: page.toString(),
                pageSize: pageSize.toString(),
                sort: `${sortStatus.columnAccessor}:${sortStatus.direction}`,
                search: search.trim(),
                from: fromDate,
                to: toDate,
            });

            const res = await fetch(`/api/dash/admin/withdraw-approval?${query.toString()}`, {
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to fetch');
            const json = await res.json();

            setRecords(json.data || []);
            setTotalRecords(json.meta?.pagination?.total || 0);

            // CHECK HERE: If your backend provides overall totals, set them here
            // Example: setServerTotals(json.meta.overall_totals); 

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactionHistory();
    }, [page, pageSize, sortStatus, fromDate, toDate, search, isUpdatedState]);
    // const [adminRemark, setAdminRemark] = useState('');
    const totals = useMemo(() => {
        if (!fromDate || !toDate) return { tds: 0, admin: 0 };

        // IMPORTANT: Currently this only sums the 10 records on the screen.
        // If the API doesn't send "overall totals", the UI will always be 
        // off by the records on other pages.
        return records.reduce((acc, curr) => ({
            tds: acc.tds + (Number(curr.tds_charges) || 0),
            admin: acc.admin + (Number(curr.admin_charges) || 0)
        }), { tds: 0, admin: 0 });
    }, [records, fromDate, toDate]);

    // --- NEW EXPORT LOGIC ---
    const exportToExcel = () => {
        if (!fromDate || !toDate) {
            alert("Please select a date range first to export data.");
            return;
        }

        // 1. Prepare the main data rows
        const excelData = records.map((row, index) => ({
            "S.No": index + 1,
            "User ID": row.user?.username || '',
            "Name": row.user?.fullName || '',
            "Request Date": row.request_date ? formatDateTimeUTC(row.request_date) : '',
            "Amount": Number(row.withdraw_amount) || 0,
            "TDS Charges": Number(row.tds_charges) || 0,
            "Admin Charges": Number(row.admin_charges) || 0,
            "Net Payable": Number(row.net_payable_amount) || 0,
            "Status": row.payout_status,
            "Admin Remarks": row.admin_remarks || ''
        }));

        // 2. Calculate Totals for the bottom row
        const totalAmount = excelData.reduce((sum, row) => sum + row["Amount"], 0);
        const totalTDS = excelData.reduce((sum, row) => sum + row["TDS Charges"], 0);
        const totalAdmin = excelData.reduce((sum, row) => sum + row["Admin Charges"], 0);
        const totalNet = excelData.reduce((sum, row) => sum + row["Net Payable"], 0);

        // 3. Push the Total Row
        excelData.push({
            "S.No": 0,
            "User ID": "TOTAL",
            "Name": "",
            "Request Date": "",
            "Amount": totalAmount,
            "TDS Charges": totalTDS,
            "Admin Charges": totalAdmin,
            "Net Payable": totalNet,
            "Status": "",
            "Admin Remarks": ""
        });

        // 4. Create Workbook and Worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();

        // Optional: Set column widths for better readability
        const wscols = [
            { wch: 8 },  // S.No
            { wch: 15 }, // User ID
            { wch: 20 }, // Name
            { wch: 20 }, // Date
            { wch: 12 }, // Amount
            { wch: 12 }, // TDS
            { wch: 12 }, // Admin
            { wch: 15 }, // Net Payable
            { wch: 12 }, // Status
            { wch: 25 }, // Remarks
        ];
        worksheet['!cols'] = wscols;

        XLSX.utils.book_append_sheet(workbook, worksheet, "Withdrawal Summary");

        const fileName = `Withdrawals_${fromDate}_to_${toDate}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    const openUpdateModal = (record: any) => {
        setSelectedId(record?.documentId);
        setStatusValue(record?.payout_status);
        setAdminRemark(record?.admin_remarks);
        setOpened(true);
        setFullName(record?.user?.fullName)
        setUserId(record?.user?.username)
        setStudentComment(record?.remark)
        setUserAllData(record)
    };

    // const saveStatus = () => {
    //     const updated = records.map((item) =>
    //         item.id === selectedId
    //             ? { ...item, status: statusValue, admin_remarks: adminRemark }
    //             : item
    //     );
    //     setRecords(updated);
    //     setOpened(false);
    // };
    // const [fromDate, setFromDate] = useState('2026-03-01');
    // const [toDate, setToDate] = useState('2026-03-16');


    const saveStatus = async () => {
        if (statusValue === 'REJECTED' && !adminComment.trim()) {
            showToast("info", "Please provide a reason for rejection.");
        }
        setIsUpdating(true)

        try {
            const response = await fetch('/api/dash/admin/withdraw-approval', { // Update this path to your route
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentId: selectedId, // The unique ID for the KYC record
                    payout_status: statusValue,
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
        <div className="panel border-none shadow-none">
            <div className="mb-8 bg-blue-100 flex flex-wrap items-end justify-between gap-4 rounded-lg bg-blue-50/50 p-6 border border-blue-100">
                <div className="flex flex-wrap items-center gap-4 ">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">From</label>
                        <input
                            type="date"
                            className="form-input py-2 px-3 focus:ring-primary"
                            value={fromDate}
                            onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
                        />
                    </div>

                    <IconArrowRight className="mt-6 text-gray-300" size={18} />

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">To</label>
                        <input
                            type="date"
                            className="form-input py-2 px-3 focus:ring-primary"
                            value={toDate}
                            onChange={(e) => { setToDate(e.target.value); setPage(1); }}
                        />
                    </div>

                    <div className="ml-4 flex gap-4">
                        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm min-w-[140px]">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Total TDS</p>
                            <p className="text-xl font-black text-black">
                                ₹{(fromDate && toDate) ? totals.tds.toLocaleString() : '0'}
                            </p>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm min-w-[140px]">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Admin Tax</p>
                            <p className="text-xl font-black text-black">
                                ₹{(fromDate && toDate) ? totals.admin.toLocaleString() : '0'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Updated Export Button */}
                <button
                    onClick={exportToExcel}
                    disabled={!fromDate || !toDate}
                    className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold text-white transition ${(!fromDate || !toDate) ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                        }`}
                >
                    <IconDownload size={18} />
                    Export
                </button>
            </div>

            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-base font-bold text-dark">Withdrawal Approval</h5>
                <input
                    className="form-input w-60"
                    placeholder="Search User ID..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
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
                            { accessor: 'id', title: '#', render: (_row, index) => (page - 1) * pageSize + index + 1 },
                            {
                                accessor: 'user',
                                title: 'User Id',
                                render: ({ user }) => <span className="font-bold text-black">{user?.username ?? ""}</span>,
                            },
                            {
                                accessor: 'name',
                                title: 'Name',
                                render: ({ user }) => <span className="font-bold text-black">{user?.fullName ?? ""}</span>,
                            },
                            {
                                accessor: 'request_date',
                                title: 'Requested at',
                                sortable: true,
                                render: ({ request_date }) => (
                                    <span className="text-gray-500 text-xs">{request_date ? formatDateTimeUTC(request_date) : ""}</span>
                                ),
                            },
                            {
                                accessor: 'withdraw_amount',
                                title: 'Withdrawal Details',
                                render: ({ withdraw_amount, remark }) => (
                                    <div className="flex flex-col leading-tight">
                                        <span className="font-bold text-black">₹{withdraw_amount ?? ""}</span>
                                        <span className="text-[10px] text-gray-400 italic truncate w-32">{remark ?? 'No remark'}</span>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'charges',
                                title: 'Charges(TDS/ADM)',
                                render: ({ tds_charges, admin_charges }) => (
                                    <div className="text-xs font-semibold text-red-500">
                                        {tds_charges || admin_charges ? (
                                            <>{tds_charges && `TDS: -₹${tds_charges}`} {tds_charges && admin_charges && "/"} {admin_charges && `Admin: -₹${admin_charges}`}</>
                                        ) : "NA"}
                                    </div>
                                ),
                            },
                            {
                                accessor: 'net_payable_amount',
                                title: 'Net Payable',
                                render: ({ net_payable_amount }) => (
                                    <span className="text-base font-bold text-green-600">{net_payable_amount ? `₹${net_payable_amount}` : "NA"}</span>
                                ),
                            },
                            {
                                accessor: 'student_remarks',
                                title: 'Student Remarks',
                                titleClassName: 'text-black font-bold',
                                render: ({ remark }) => (
                                    <Tooltip
                                        label={remark ?? '---'}
                                        multiline
                                        w={300} // This sets the width of the popup box
                                        withArrow
                                        withinPortal // Ensures the popup isn't cut off by table boundaries
                                    >
                                        <div className="max-w-[200px] truncate cursor-help">
                                            <span className="text-xs text-gray-600">
                                                {remark ?? '---'}
                                            </span>
                                        </div>
                                    </Tooltip>
                                ),
                            },
                            {
                                accessor: 'admin_remarks',
                                title: 'Admin Remarks',
                                width: 200, // Optional: forces a fixed width for the column
                                render: ({ admin_remarks }) => (
                                    <Tooltip
                                        label={admin_remarks ?? '---'}
                                        multiline
                                        w={300}
                                        withArrow
                                        withinPortal
                                    >
                                        <div className="max-w-[180px] truncate cursor-help">
                                            <span className="text-xs text-gray-600">
                                                {admin_remarks ?? '---'}
                                            </span>
                                        </div>
                                    </Tooltip>
                                ),
                            },
                            {
                                accessor: 'status',
                                title: 'Status',
                                render: ({ payout_status }) => {
                                    const status = payout_status?.toUpperCase();
                                    const isApproved = status === 'PAID';
                                    const isRejected = status === 'REJECTED';
                                    const isRequested = status === 'REQUESTED';
                                    return (
                                        <div className={`flex w-fit items-center gap-1 rounded-md border px-2 py-0.5 ${isApproved ? 'border-green-100 bg-green-50 text-green-600' : isRejected ? 'border-red-100 bg-red-50 text-red-600' : isRequested ? 'border-warning bg-warning-light text-warning' : ''}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${isApproved ? 'bg-green-500' : isRejected ? 'bg-red-500' : isRequested ? 'bg-warning' : "bg-dark"}`} />
                                            <span className="text-[11px] font-bold capitalize">{payout_status ? payout_status.toLowerCase() : ""}</span>
                                        </div>
                                    );
                                },
                            },
                            {
                                accessor: 'genealogy',
                                title: 'Genealogy',
                                cellsClassName: 'text-right',
                                render: ({ user }) => (
                                    <Link href={`/dash/admin/genealogy?id=${user?.id ?? ""}`}>
                                        <button className="font-semibold text-blue-600 hover:underline">View</button>
                                    </Link>
                                ),
                            },
                            {
                                accessor: 'actions',
                                title: 'Actions',
                                cellsClassName: 'text-right',
                                render: (record) => (
                                    <button onClick={() => openUpdateModal(record)} className="font-semibold text-blue-600 hover:underline">Review</button>
                                ),
                            },
                        ]}
                        totalRecords={totalRecords}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={setPage}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={(size) => { setPageSize(size); setPage(1); }}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                    />
                )}
            </div>

            {/* Status Modal remains the same */}
            {/* <Modal opened={opened} onClose={() => setOpened(false)} title="Process Withdrawal Request" centered>
                <div className="space-y-4">
                    <Select
                        label="Update Status"
                        placeholder="Select status"
                        value={statusValue}
                        onChange={(val: any) => setStatusValue(val)}
                        data={[
                            { value: 'REQUESTED', label: 'Requested' },
                            { value: 'PAID', label: 'Paid' },
                            { value: 'REJECTED', label: 'Rejected' },
                        ]}
                    />
                    <Textarea
                        label="Admin Remark"
                        placeholder="Reason..."
                        value={adminRemark}
                        onChange={(e) => setAdminRemark(e.currentTarget.value)}
                        minRows={3}
                    />
                    <Button fullWidth onClick={saveStatus} className="bg-brand hover:bg-brand-hover">Update Withdrawal</Button>
                </div>
            </Modal> */}
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={<Text fw={700} className='text-dark'>Process Withdrawal Request</Text>}

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
                            <Text weight={600} size="md" className='text-dark'>{fullName ?? ""}</Text>
                            <Badge variant="light" color="gray" size="md">{userId ?? ""}</Badge>
                        </Stack>
                    </Group>

                    {/* <div className="border border-gray-200 rounded-lg overflow-hidden"> */}

                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white ">
                        <div className="bg-gray-50 p-2 border-b border-gray-200">
                            <Text size="xs" weight={700} color="gray" transform="uppercase">
                                Withdrawal Summary
                            </Text>
                        </div>

                        <div className="p-3">
                            {/* Row 1: Requested Amount */}
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600 font-medium">Requested Amount:</span>
                                <span className="text-sm font-bold text-black">
                                    ₹ {userAllData?.withdraw_amount ?? ""}
                                </span>
                            </div>

                            {/* Row 2: Charges */}
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600 font-medium">Charges (TDS/ADM):</span>
                                <span className="text-sm font-semibold text-red-600">
                                    -₹{userAllData?.tds_charges ?? ""} / -₹{userAllData?.admin_charges ?? ""}
                                </span>
                            </div>

                            <Divider my={10} variant="dashed" />

                            {/* Row 3: Net Payable */}
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-sm font-bold text-dark">Net Payable:</span>
                                <span className="text-base font-bold text-green-600">
                                    ₹ {userAllData?.net_payable_amount ?? ""}
                                </span>
                            </div>
                        </div>
                    </div>



                    {/* </div> */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white ">
                        <div className="bg-gray-50 p-2 border-b border-gray-200">
                            <Text size="xs" weight={700} color="gray" transform="uppercase">
                                Bank Details
                            </Text>
                        </div>

                        <div className="p-3">
                            {/* Row 1: Requested Amount */}
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600 font-medium">A/C no.:</span>
                                <span className="text-sm font-semibold text-dark">
                                    {userAllData?.kyc_document ? userAllData?.kyc_document?.account_number ?? "" : ""}

                                </span>
                            </div>

                            {/* Row 2: Charges */}
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600 font-medium">IFSC:</span>
                                <span className="text-sm font-semibold text-dark">
                                    {userAllData?.kyc_document ? userAllData?.kyc_document?.ifsc_code ?? "" : ""}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600 font-medium">Bank:</span>
                                <span className="text-sm font-semibold text-dark">
                                    {userAllData?.kyc_document ? userAllData?.kyc_document?.bank_name ?? "" : ""}

                                </span>
                            </div>

                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600 font-medium">UPI Id:</span>
                                <span className="text-sm font-semibold text-dark">
                                    {userAllData?.kyc_document ? userAllData?.kyc_document?.upi_id ?? "" : ""}

                                </span>
                            </div>


                        </div>
                    </div>
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
                        label="Payout Decision"
                        description="Choose the new status for this user's identity documents"
                        placeholder="Select status"
                        withinPortal
                        value={statusValue}
                        onChange={(val) => setStatusValue(val || '')}
                        data={[
                            { value: 'REQUESTED', label: '⏳ Requested' },
                            { value: 'PAID', label: '✅ Paid' },
                            { value: 'REJECTED', label: '❌ Rejected' },
                        ]}
                        styles={(theme) => ({
                            input: { color: '#000000', fontWeight: 500 },
                            item: { color: '#000000' },
                            dropdown: { border: '1px solid #ced4da', boxShadow: theme.shadows.md }
                        })}
                    />

                    {/* NEW: Admin Comment Input */}
                    <Textarea
                        label="Admin Remarks"
                        placeholder={statusValue === 'REJECTED' ? "" : "Optional internal notes..."}
                        minRows={1}
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
                            size="sm"
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
        </div>
    );
};

export default WithdrawalApprovalList;