"use client";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import sortBy from "lodash/sortBy";
import { formatDateTime } from "@/utils/dateFormatter";


const PayoutReportList = () => {
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
      const res = await fetch("/api/dash/affiliate/payout", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();
      setInitialRecords(data?.data?.data || []);
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
        <h5 className="text-sm lg:text-lg font-semibold dark:text-white-light">
          Payout Request List
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
            accessor: "userId",
            title: "User Id",
            sortable: true,
            render: ({ user }) => (
              <span className="badge bg-dark">
                {user?.username ?? ""}
              </span>
            ),

          },
          {
            accessor: "name",
            title: "Name",
            sortable: true,
            render: ({ user }) => user?.fullName,

          },
          {
            accessor: "accountNo",
            title: "Account No.",
            sortable: true,
            render: ({ kyc_document }) => kyc_document?.account_number,

          },
          {
            accessor: "withdraw_amount",
            title: "Withdraw Amount",
            sortable: true,
            render: ({ withdraw_amount }) => (
              <span className="">
                ₹{withdraw_amount ?? ""}
              </span>
            ),
          },
          {
            accessor: "tds_charges",
            title: "TDS Charges",
            sortable: true,
            render: ({ tds_charges }) => (
              <span className="">
                ₹{tds_charges ?? ""}
              </span>
            ),
          },
           
          
          {
            accessor: "admin_charges",
            title: "Admin Charges",
            sortable: true,
            render: ({ admin_charges }) => (
              <span className="">
                ₹{admin_charges ?? ""}
              </span>
            ),
          },
          {
            accessor: "net_payable_amount",
            title: "Net Payable Amount",
            sortable: true,
            render: ({ net_payable_amount }) => (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                ₹{net_payable_amount ?? ""}
              </span>
            ),
          },

          {
            accessor: "createdAt",
            title: "Request Date",
            sortable: true,
            render: ({ createdAt }) => `${formatDateTime(createdAt)}`,
          },
          {
            accessor: "createdAt",
            title: "Paid Date",
            sortable: true,
            render: ({ paid_date, payout_status }) => <span className={(payout_status == "PAID" && paid_date) ? `badge bg-secondary-light text-dark` : ""}>{payout_status == "PAID" ? formatDateTime(paid_date) : "-"}</span>
          },
          {
            accessor: "payout_status",
            title: "Status",
            sortable: true,
            render: (record) => {
              const status = record.payout_status;

              const statusMap = {
                REQUESTED: "bg-warning text-white",
                PAID: "bg-success text-white",
                REJECTED: "bg-danger text-white",
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
            accessor: "remark",
            title: "Remark",
            sortable: false,
          },
          // {
          //   accessor: "ref",
          //   title: "Ref",
          //   sortable: false,
          //    render: ({ user }) => (
          //     <span className="">
          //       {"-"}
          //     </span>
          //   ),
          // },
           {
            accessor: "admin_remarks",
            title: "Admin Comment",
            sortable: false,
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

export default PayoutReportList;
