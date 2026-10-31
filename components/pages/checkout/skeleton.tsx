const PaymentSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* LEFT : PAYMENT DETAILS */}
                <div className="md:col-span-2 panel space-y-6">
                    {/* Title */}
                    <div className="h-7 w-48 bg-gray-300 rounded mx-auto"></div>

                    {/* Select */}
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-300 rounded"></div>
                        <div className="h-12 w-full bg-gray-200 rounded"></div>
                    </div>

                    {/* Section box */}
                    <div className="p-4 rounded-lg border bg-gray-100 space-y-4">
                        <div className="h-5 w-40 bg-gray-300 rounded"></div>

                        <div className="space-y-2">
                            <div className="h-4 w-28 bg-gray-300 rounded"></div>
                            <div className="h-10 w-full bg-gray-200 rounded"></div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-4 w-40 bg-gray-300 rounded"></div>
                            <div className="h-10 w-full bg-gray-200 rounded"></div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-300 rounded"></div>
                            <div className="h-10 w-full bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-6">
                        <div className="h-12 w-full bg-gray-300 rounded-lg"></div>
                        <div className="h-12 w-full bg-gray-300 rounded-lg"></div>
                    </div>
                </div>

                {/* RIGHT : ORDER SUMMARY */}
                <div className="panel space-y-4">
                    <div className="h-6 w-40 bg-gray-300 rounded"></div>

                    <div className="bg-gray-100 p-4 rounded-lg border space-y-4">
                        <div className="h-5 w-32 bg-gray-300 rounded"></div>

                        <div className="flex justify-between">
                            <div className="h-4 w-24 bg-gray-300 rounded"></div>
                            <div className="h-4 w-40 bg-gray-200 rounded"></div>
                        </div>

                        <div className="flex justify-between">
                            <div className="h-4 w-16 bg-gray-300 rounded"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        </div>

                        <div className="flex justify-between">
                            <div className="h-4 w-20 bg-gray-300 rounded"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        </div>

                        <div className="flex justify-between">
                            <div className="h-5 w-28 bg-gray-300 rounded"></div>
                            <div className="h-5 w-24 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};


export default PaymentSkeleton;