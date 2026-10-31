'use client';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';

const LevelTreeList = () => {
    const [recordsData, setRecordsData] = useState([]);
    const [totalIncome, setTotalIncome] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUserLevelCommission = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/dash/affiliate/level-report", {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await res.json();
            setRecordsData(data?.data?.levels || []);
            setTotalIncome(data?.data?.totalCommission ?? "");
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
    );
};

export default LevelTreeList;
