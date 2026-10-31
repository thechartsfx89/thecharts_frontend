export const TransactionHistorySkeleton = () => {
  return (
    <div>
     
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              {[ '#', 'Payout No.', 'Date', 'Type','Level/Club', 'Source User', 'Credit (Rs.)' ].map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {/* S.No */}
                <td className="px-4 py-3">
                  <div className="h-4 w-6 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>

                {/* Payout No */}
                <td className="px-4 py-3">
                  <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>

                {/* Date */}
                <td className="px-4 py-3">
                  <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>

                 <td className="px-4 py-3">
                  <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>

                {/* Date */}
                <td className="px-4 py-3">
                  <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>

                {/* Particulars */}
                <td className="px-4 py-3">
                  <div className="h-4 w-30 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>

                {/* Credit */}
                <td className="px-4 py-3 text-right">
                  <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700 ml-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="mt-4 flex items-center justify-between">
        <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex gap-2">
          <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
};
