"use client"
import IconLockDots from '@/components/icon/icon-lock-dots'
import IconSquareCheck from '@/components/icon/icon-square-check'
import IconMenuComponents from '@/components/icon/menu/icon-menu-components'
import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard'
import { getImageUrl } from '@/utils/common/common'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function Page() {
    const [CourseData, setCourseData] = useState<any>(null);
    console.log(CourseData, '>>>>>>>> courses');
    useEffect(() => {
        const apihandler = async () => {
            const res: any = await fetch('/api/enroll-course', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const { data, meta } = await res.json();
            setCourseData(data);
        };

        apihandler();
    }, []);

    // console.log(CourseData, '>>>>>>>> courses');
    const { data: session, status } = useSession();

    return (
        <>
            <ol className="flex items-center flex-wrap text-gray-500 font-semibold dark:text-white-dark gap-y-4">
                <li>
                    <Link href={session?.user?.role == "mentor" ? `/dash/mentor` : session?.user?.role == "mentor" ? `/dash/student` : "#"}>
                        <button className="p-2.5 border border-gray-500/20 rounded-md shadow flex items-center justify-center dark:border-0 dark:bg-[#191e3a] hover:text-gray-500/70 dark:hover:text-white-dark/70 bg-white">
                            <IconMenuDashboard className="shrink-0 group-hover:!text-primary" />
                        </button>
                    </Link>
                </li>
                <li className="flex items-center before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4">
                    <button className="p-2.5 border border-gray-500/20 text-primary rounded-md shadow flex gap-2 items-center justify-center dark:border-0 dark:bg-[#191e3a] hover:text-gray-500/70 dark:hover:text-white-dark/70">
                        <IconMenuComponents className="shrink-0 group-hover:!text-primary" />
                        Enroll Course
                    </button>
                </li>
            </ol>
            <div className="text-black font-bold dark:text-[#506690] dark:group-hover:text-white-dark my-4 ">Enroll Course</div>
            <div className="mb-6 grid gap-6 sm:grid-cols-2 xxl:grid-cols-4 xl:grid-cols-3">
                {!CourseData ? (
                    // 🔄 Skeleton Loader (while loading)
                    <>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="panel h-full overflow-hidden border-0 p-0 bg-[#ffffff] animate-pulse rounded-lg">
                                <div className="min-h-[190px] w-full bg-gray-200 dark:bg-dark-light relative" />
                                <div className="p-5 space-y-4">
                                    <div className="h-5 bg-gray-200 dark:bg-dark-light rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 dark:bg-dark-light rounded w-full" />
                                    <div className="h-3 bg-gray-200 dark:bg-dark-light rounded w-5/6" />

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 bg-gray-200 dark:bg-dark-light rounded-full" />
                                            <div className="h-3 w-16 bg-gray-200 dark:bg-dark-light rounded" />
                                        </div>
                                        <div className="h-3 w-8 bg-gray-200 dark:bg-dark-light rounded" />
                                    </div>

                                    <div className="h-5 w-full bg-gray-200 dark:bg-dark-light rounded-full" />
                                </div>
                            </div>
                        ))}
                    </>
                ) : CourseData?.length > 0 ? (
                    // ✅ Loaded Course Data
                    CourseData.map((data: any, index: any) => {
                        const isLocked = data?.is_quiz === true;

                        return (
                            <div
                                key={data?.id}
                                className={`relative group ${isLocked ? "opacity-70 pointer-events-none" : ""
                                    }`}
                            >
                                {/* Lock overlay */}
                                {!isLocked && index > 0 && (
                                    <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center rounded-md">
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-red-100/70`}>
                                            <IconLockDots className="w-6 h-6 text-red-600 font-extrabold" />
                                        </div>
                                    </div>
                                )}

                                <Link
                                    href={`/dash/dashboard/enroll-course/details/${data?.vdo_id}`}
                                    className={`${isLocked ? "pointer-events-none" : ""}`}
                                >
                                    <div className="panel h-full overflow-hidden border-0 p-0 bg-[#ffffff] rounded-lg relative">
                                        <div className="min-h-[190px] w-full relative">
                                            <Image
                                                src={getImageUrl(data?.course_thumbnail?.url)}
                                                alt="Enroll course image"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="p-5">
                                            <div className="mb-5">
                                                <p className="font-semibold mb-1 text-[16px]">
                                                    {data?.course_title ?? ""}
                                                </p>
                                                <span className="rounded-full py-1.5 text-xs text-gray-600">
                                                    {data?.course_desc ?? ""}
                                                </span>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="mb-2 flex items-center justify-between font-semibold">
                                                    <div className="flex items-center">
                                                        <IconSquareCheck className="h-4 w-4 text-success" />
                                                        <div className="text-xs ml-2">Progress</div>
                                                    </div>
                                                    <p className="text-primary">65%</p>
                                                </div>

                                                <div className="h-5 w-full overflow-hidden rounded-full bg-dark-light p-1 shadow-3xl">
                                                    <div
                                                        className="relative h-full w-full rounded-full bg-gradient-to-r from-[#126337] to-[#009746] before:absolute before:inset-y-0 before:m-auto before:h-2 before:w-2 before:rounded-full before:bg-white right-0.5"
                                                        style={{ width: "65%" }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })

                ) : (
                    <p>No courses found.</p>
                )}
            </div>
        </>
    )
}
