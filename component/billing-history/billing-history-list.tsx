"use client";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import sortBy from "lodash/sortBy";
import { formatDateTime } from "@/utils/dateFormatter";
import IconEye from "@/components/icon/icon-eye";


const BillingHistoryList = () => {
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    const [initialRecords, setInitialRecords] = useState([]);
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const fetchPayoutReport = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/dash/student/billingHistory", {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await res.json();
            setInitialRecords(data?.data || []);
            setLoading(false);
            // console.log(data?.data?.members?.users , ">>>>>>")
        } catch (err) {
            console.error("Data fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayoutReport()
    }, [])

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: "userId",
        direction: "asc",
    });

    // Pagination
    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    // Search Filter
    // useEffect(() => {
    //   const searchText = search.toLowerCase();

    //   setInitialRecords(
    //     initialRecords.filter((item) => {
    //       return (
    //         item.userId.toLowerCase().includes(searchText) ||
    //         item.name.toLowerCase().includes(searchText) ||
    //         item.accountNo.toLowerCase().includes(searchText) ||
    //         item.amount.toLowerCase().includes(searchText) ||
    //         item.date.toLowerCase().includes(searchText) ||
    //         item.status.toLowerCase().includes(searchText) ||
    //         item.remark.toLowerCase().includes(searchText)
    //       );
    //     })
    //   );

    //   setPage(1);
    // }, [search]);

    // Sorting
    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(
            sortStatus.direction === "desc" ? data.reverse() : data
        );
        setPage(1);
    }, [sortStatus]);

    return (
        <div className="panel mt-6">
            <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                <h5 className="text-lg font-semibold dark:text-white-light">
                    Billing History List
                </h5>

                {/* <div className="ltr:ml-auto rtl:mr-auto">
          <input
            type="text"
            className="form-input w-auto"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div> */}
            </div>

            <DataTable
                striped
                className="table-striped whitespace-nowrap"
                records={recordsData}
                columns={[
                    {
                        accessor: "sno",
                        title: "#",
                        width: 60,
                        render: (_record, index) => (page - 1) * pageSize + index + 1,
                    },
                    {
                        accessor: "order_no",
                        title: "Order No.",
                        sortable: true,
                        render: ({ order_no, id }) => <span>{order_no ?? id}</span>,

                    },
                    {
                        accessor: "username",
                        title: "Username",
                        sortable: true,
                        render: ({ user }) => (
                            <span className="badge bg-dark">
                                {user?.username ?? ""}
                            </span>
                        ),

                    },
                    {
                        accessor: "enrolled_course",
                        title: "Enrolled Course",
                        sortable: true,
                        render: ({ purchased_course }) => purchased_course?.course?.course_title ?? "",

                    },

                    {
                        accessor: "total_amount",
                        title: "Price",
                        sortable: true,
                        render: ({ total_amount, purchased_course }) => (
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                ₹{total_amount ?? purchased_course?.course?.course_price}
                            </span>
                        ),
                    },

                    {
                        accessor: "payment_date",
                        title: "Payment Date",
                        sortable: true,
                        render: ({ createdAt }) => `${formatDateTime(createdAt)}`,
                    },
                    {
                        accessor: "payment_receipt",
                        title: "Payment Ref",
                        sortable: false,
                        render: ({ payment_receipt }) =>
                            payment_receipt ? (
                                <a
                                    href={`${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/payment/${payment_receipt}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center"
                                >
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/payment/${payment_receipt}`}
                                        alt="Payment receipt"
                                        className="h-8 w-8 object-cover rounded "
                                    />
                                    <IconEye className="text-primary pl-4" />
                                </a>
                            ) : (
                                <span className="text-gray-400">—</span>
                            ),
                    },


                    {
                        accessor: "payment_status",
                        title: "Status",
                        sortable: true,
                        render: (record) => {
                            const status = record.payment_status;

                            const statusMap = {
                                PENDING: "bg-warning text-white",
                                SUCCESS: "bg-success text-white",
                                VERIFIED: "bg-success text-white",
                                FAILED: "bg-danger text-white",
                                REJECTED: "bg-danger text-white",
                                UNDER_VERIFICATION: "bg-warning text-white"
                            };

                            return (
                                <span
                                    className={`px-3 py-1 rounded text-xs font-medium ${statusMap[status] || "bg-gray-400 text-white"
                                        }`}
                                >
                                    {status}
                                </span>
                            );
                        },
                    },

                    {
                        accessor: "print",
                        title: "Invoice",
                        sortable: false,
                        render: (record) => (
                            <a
                                href={`/dash/student/billing/invoice?id=${record.documentId}`}
                                rel="noopener noreferrer"
                                className="btn btn-sm bg-primary/10 text-primary shadow-md hover:bg-primary/20 hover:underline"
                            >
                                View/Download
                            </a>
                        ),
                    },
                    {
                        accessor: "admin_comment",
                        title: "Admin Remarks",
                        // sortable: true,
                        // render: ({ createdAt }) => `${formatDateTime(createdAt)}`,
                    },

                ]}
                totalRecords={initialRecords.length}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={setPage}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                minHeight={200}
                paginationText={({ from, to, totalRecords }) =>
                    `Showing ${from} to ${to} of ${totalRecords} entries`
                }
            />
        </div>
    );
};

export default BillingHistoryList;
