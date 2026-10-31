

'use client';

import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { TransactionHistorySkeleton } from './transactionSkeleton';
import { formatDateTime } from '@/utils/dateFormatter';

const PAGE_SIZES = [10, 20, 50, 100];

const TransactionHistory = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'createdAt',
    direction: 'desc',
  });

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/dash/affiliate/transaction-history?page=${page}&pageSize=${pageSize}&sort=${sortStatus.columnAccessor}:${sortStatus.direction}`,
        {
          credentials: 'include',
        }
      );

      if (!res.ok) throw new Error('Failed to fetch');

      const json = await res.json();

      setRecords(json.data || []);
      setTotalRecords(json.meta?.pagination?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, [page, pageSize, sortStatus]);

  return (
    <div className="panel mt-6">
      <h5 className="mb-5 text-lg font-semibold">Transaction History</h5>

      {loading ? (
        <TransactionHistorySkeleton />
      ) : (
        <DataTable
          striped
          className="table-striped whitespace-nowrap"
          records={records}
          columns={[
            {
              accessor: 'id',
              title: '#',
              render: (_row, index) =>
                (page - 1) * pageSize + index + 1,
            },
            {
              accessor: 'id',
              title: 'Payout No.',
            },
            {
              accessor: 'createdAt',
              title: 'Date',
              sortable: true,
              render: ({ createdAt }) => `${formatDateTime(createdAt)}`,
            },
            // {
            //   accessor: 'type',
            //   title: 'Type',
            //   sortable: true,
            //   render: ({ type }) => {
            //         return (  
            //             <span className="badge bg-info">
            //                 {type ?? ''}
            //             </span>
            //         )
            //   }
                
            // },
            {
              accessor: 'remark',
              title: 'Particulars',
              sortable: true,
              render: (item) => {
                 return (
                                <span
                                    // className="badge text-white"
                                    // style={{
                                    //     backgroundColor:
                                    //         {
                                    //             1: '#2563EB',
                                    //             2: '#4F46E5',
                                    //             3: '#7C3AED',
                                    //             4: '#DB2777',
                                    //             5: '#E11D48',
                                    //             6: '#334155',
                                    //             7: '#D97706',
                                    //             8: '#4338CA',
                                    //             9: '#6D28D9',
                                    //             10: '#0F766E',
                                    //         }[level] ?? '#6B7280',
                                    // }}
                                >
                                    {/* {level ? <span>Level {level}</span> : ''} */}
                                    {/* {remark ?? ''}  */}
                                     {item?.remark ?
                                                    <div className="text-md text-dark dark:text-[#bfc9d4]">{item?.remark ? item?.remark?.replace("<b>", "").replace("</b>", "") : ""}</div>
                                                    :
                                                    <div className="text-md text-dark dark:text-[#bfc9d4]">{item?.transaction_for == "LEVEL_INCOME" ? "" : item?.type} Commission by {item?.sourceUser?.username} at {item?.level ? `(Level${item?.level})` : ""}</div>
                                                }
                                </span>
                            );
              }
            },
            // {
            //   accessor: 'particulars',
            //   title: 'Source User',
            //   render: ({ sourceUser, level, type }) => (
            //     <span className="badge bg-dark">
            //       {`${sourceUser?.username ?? ''} 
                  
            //       `
            //       }
            //     </span>
            //   ),
            // },
            {
              accessor: 'Credit',
              title: 'Credit (Rs.)',
              render: ({ credit }) => (
                 <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                 ₹{credit}
                </span>
              ),
            },
            {
              accessor: 'Debit',
              title: 'Debit (Rs.)',
              render: ({ debit }) => (
                 <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                { debit ? `₹${debit}` : '-'}
                </span>
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
  );
};

export default TransactionHistory;

