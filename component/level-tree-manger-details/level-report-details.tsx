'use client';
import { formatDateAndTime } from '@/utils/dateFormatter';
import { DataTable } from 'mantine-datatable';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const LevelMangerDetailsList = () => {
    const [recordsData, setRecordsData] = useState([]);
    const [totalIncome, setTotalIncome] = useState(null);
    const [earnerData, setEarnerData] = useState(null);

    const [loading, setLoading] = useState(true);
    const params = useParams();
    console.log({ params })
    //  console.log({userId})
    const getUserLevelCommission = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/dash/admin/level-manager/${params?.id}`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await res.json();
            setRecordsData(data?.data?.levels || []);
            setTotalIncome(data?.data?.totalCommission ?? "");
            setEarnerData(data?.data?.earner ?? null)
        } catch (err) {
            console.error("Data fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserLevelCommission()
    }, [])

    const skeletonRecords = Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        level: "",
        perLevelAmount: "",
        totalEarned: "",
    }));
    const Skeleton = ({ width = "w-full" }) => (
        <div
            className={`h-4 ${width} rounded bg-gray-300 animate-pulse`}
        />
    );


    const recordsWithTotal = loading
        ? skeletonRecords
        : [
            ...recordsData,
            ...[recordsData?.length > 0 && {
                level: "",
                perLevelAmount: "",
                totalEarned: totalIncome ?? "",
                isSummary: true,
            }],
        ];


    return (
        <>
            <div className="panel mt-4 border-none shadow-md overflow-hidden">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-5 pb-2 bg-primary/5 dark:bg-white-dark/5 gap-4 border-b border-white-light dark:border-[#1b2e4b]">
                    <div>
                        <h5 className="text-lg font-bold text-dark dark:text-white-light">Level Manager Details</h5>
                        <p className="text-white-dark text-xs font-medium mt-1">
                            View level commission across network levels.
                        </p>
                    </div>
                    {!loading && (
                        earnerData?.confirm_affiliate_payment ? (
                            <div className="badge bg-success text-white border-success/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                                Active Member
                            </div>
                        ) : (
                            <div className="badge bg-danger text-white border-danger/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                                InActive Member
                            </div>
                        )
                    )}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 lg:gap-12 divide-y md:divide-y-0 md:divide-x divide-white-light dark:divide-[#1b2e4b]">

                    {/* User Section */}
                    <div className="py-4 px-1 lg:px-10 lg:py-5 mx-0 lg:mx-12">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-info/10 text-info rounded-lg">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </div>
                            <h3 className="text-base font-bold text-dark dark:text-white-light">User Details</h3>
                        </div>
                        <div className="space-y-3  ">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white-dark">Full Name</span>
                                <span className="font-semibold text-dark dark:text-white">{earnerData?.fullName ?? ""}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white-dark">Username</span>
                                <span className="badge bg-secondary-light text-secondary dark:bg-secondary/20 font-mono">{earnerData?.username ?? ""}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white-dark">Joining Date</span>
                                <span className="font-medium text-xs lg:text-sm italic">{earnerData?.createdAt ? formatDateAndTime(earnerData?.createdAt) : "_"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Referral Details Section */}
                    <div className="py-4 px-1 lg:px-10 lg:py-5 bg-gray-50/50 dark:bg-transparent  mx-0 lg:mx-12 ">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-success/10 text-success rounded-lg">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                            </div>
                            <h3 className="text-base font-bold text-dark dark:text-white-light">Referral Details</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white-dark">Sponsor Name</span>
                                <span className="font-semibold text-dark dark:text-white">{earnerData?.referredBy?.fullName ?? ""}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white-dark">Sponsor ID</span>
                                <span className="text-primary font-bold">{earnerData?.referredBy?.username}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white-dark">Join Date</span>
                                <span className="font-medium text-xs lg:text-sm italic">{earnerData?.referredBy?.createdAt ? formatDateAndTime(earnerData?.referredBy?.createdAt) : '-'}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="panel mt-6">
                <DataTable
                    striped
                    className="table-striped whitespace-nowrap"
                    records={recordsWithTotal}
                    columns={[
                        {
                            accessor: 'level',
                            title: 'Levels',
                            render: ({ level }) =>
                                loading ? (
                                    <Skeleton width="w-12" />   // matches "Level 10"
                                ) : (
                                    <span>{level}</span>
                                ),
                        },
                        {
                            accessor: 'perLevelAmount',
                            title: 'Income Per Id',
                            render: ({ perLevelAmount }) =>
                                loading ? (
                                    <Skeleton width="w-20" />   // ₹3500
                                ) : (
                                    <span>{perLevelAmount}</span>
                                ),
                        },
                        {
                            accessor: 'totalEarned',
                            title: 'Income',
                            render: (record) =>
                                loading ? (
                                    <Skeleton width="w-24" />   // ₹10500
                                ) : (
                                    <span
                                        className={`block px-2 ${record.isSummary
                                            ? "font-bold "
                                            : ""
                                            }`}
                                    >
                                        {record.totalEarned}
                                    </span>
                                ),
                        },
                    ]}
                // totalRecords={recordsData.length}
                // minHeight={200}
                />

            </div>
        </>
    );
};

export default LevelMangerDetailsList;
