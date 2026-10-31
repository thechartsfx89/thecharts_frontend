const InvoiceSkeleton = () => {
  return (
    <div className="panel animate-pulse" id="invoice-root">
      {/* Header */}
      <div className="flex flex-wrap justify-between gap-4 px-4">
        <div className="h-7 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-14 w-14 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Seller Info */}
      <div className="px-4 mt-6 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />

      {/* Buyer + Meta */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Buyer */}
        <div className="flex-1 space-y-2">
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-5 w-48 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Invoice Meta */}
        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 space-y-3">
        <div className="h-8 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-8 w-full rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Totals */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 px-4">
        <div />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceSkeleton;
