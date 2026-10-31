export const AccountDashboardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 animate-pulse">
      {/* ================= LEFT: MY ACCOUNT ================= */}
      <div className="panel">
        {/* Title */}
        <div className="mb-5">
          <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Donut Chart Skeleton */}
          <div className="panel flex-1">
            <div className="flex items-center justify-center min-h-[320px] rounded-lg bg-gray-100 dark:bg-gray-800">
              <div className="h-40 w-40 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>

          {/* Action Cards Skeleton */}
          <div className="flex flex-wrap gap-3 md:w-1/2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 min-w-[160px] h-[64px] rounded bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ================= RIGHT: TRANSACTION HISTORY ================= */}
      <div className="panel">
        {/* Title */}
        <div className="mb-5">
          <div className="h-5 w-48 rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        <ul className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i}>
              <div className="flex items-center gap-4 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1b2e4b] px-6 py-4">
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />

                {/* Text */}
                <div className="flex flex-1 flex-col gap-2">
                  <div className="h-4 w-56 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-40 rounded bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Amount */}
                <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
