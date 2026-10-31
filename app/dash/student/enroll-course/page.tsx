"use client"
import IconLockDots from '@/components/icon/icon-lock-dots'
import IconPlayCircle from '@/components/icon/icon-play-circle'
import IconSquareCheck from '@/components/icon/icon-square-check'
import IconMenuComponents from '@/components/icon/menu/icon-menu-components'
import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard'
import { getCourseUrl, getImageUrl } from '@/utils/common/common'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function Page() {
    const [CourseData, setCourseData] = useState<any>(null);
const [isLoading, setIsLoading] = useState(false);

    const [progressVal, setProgressVal] = useState<any>(null);
 console.log({progressVal})
 useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await fetch(`/api/dash/student/video-progress`,
                    {
                        cache: "no-store",
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });
                const data = await res.json();
                
                // if (data?.success && data?.data?.length > 0) {
                //     const actualProgess = await data?.data?.reduce(
                //         (total: number, item: any) => total + Number(item?.current_time || 0),
                //         0
                //     ) || 0;
                    setProgressVal(data?.data);
                //     console.log("Progress:", data?.data);
                    

                   
                    
                // }
            } catch (err) {
                console.error("⚠️ Failed to save progress:", err);
            }
        }
      fetchProgress()
    }, []);


useEffect(() => {
  const apihandler = async () => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const { data, meta } = await res.json();
      setCourseData(data);
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
    } finally {
      setIsLoading(false);
    }
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
            <div className="text-black font-bold dark:text-[#506690] dark:group-hover:text-white-dark my-4 ">
                {/* enroll Course */}
            </div>
            <div className="mb-6 grid gap-6 sm:grid-cols-2 xxl:grid-cols-4 xl:grid-cols-3">
                {isLoading ? (
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
                    CourseData?.map((moduleObj: any, index: number) => {
                        const { course: data, video_progresses = [], quiz_scores = [] } = moduleObj;

                        const currentQuizPassed = quiz_scores?.[0]?.is_passed;

                        // Compute video progress
                        const moduleTotalVdoLength =
                            data?.playlist?.rows.reduce(
                                (total: number, item: any) => total + Number(item.length || 0),
                                0
                            ) || 0;

                        const progressVal = video_progresses.reduce(
                            (total: number, item: any) => total + Number(item.current_time || 0),
                            0
                        );

                        const progressPercent = moduleTotalVdoLength
                            ? Math.round((progressVal / moduleTotalVdoLength) * 100)
                            : 0;

                        // 🔥 Lock/Unlock Logic
                        const isLastModule = index === CourseData.length - 1;
                        const lastModulePassed = CourseData[CourseData.length - 1]?.quiz_scores?.[0]?.is_passed;

                        const isModuleLocked = (() => {
                            // If last module is passed → unlock all
                            if (lastModulePassed) return false;

                            // First module always unlocked
                            if (index === 0) return false;

                            // Otherwise check previous module quiz
                            const prevQuizPassed =
                                CourseData[index - 1]?.quiz_scores?.[0]?.is_passed;

                            return !prevQuizPassed;
                        })();

                        // console.log("Lock status:", { index, isModuleLocked, currentQuizPassed, progressPercent });



                        return (
                            <div 
                                key={data?.id}
                                className={`relative group `}
                            >
                                {/* {isModuleLocked && (
                                    <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center rounded-md">
                                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100/70">
                                            <IconLockDots className="w-6 h-6 text-red-600 font-extrabold" />
                                        </div>
                                    </div>
                                )} */}
                                <Link
                                    href={`/dash/student/enroll-course/module/${moduleObj?.course?.documentId}`}
                                    // className={`${isModuleLocked ? "pointer-events-none" : ""}`}
                                >
                                    <div className="panel h-full overflow-hidden border-0 p-0 bg-[#ffffff] rounded-lg relative">
                                        <div className="min-h-[190px] w-full relative">
                                            <Image
                                                src={getCourseUrl(data?.course_thumbnail?.url) || "/images/placeholder/course-placeholder.jpg"}
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
                                                <p className="text-xs text-gray-600 line-clamp-2 leading-snug max-w-full">
                                                    {data?.course_desc ?? ""}
                                                </p>

                                            </div>
                                            {/* {video_progresses?.length >= 0 && <div className="space-y-1">
                                                <div className="mb-2 flex items-center justify-between font-semibold">
                                                    <div className="flex items-center">
                                                        <IconSquareCheck className="h-4 w-4 text-success" />
                                                        <div className="text-xs ml-2">Progress</div>
                                                    </div>
                                                    <p className="text-primary">{progressPercent}%</p>
                                                </div>

                                                <div className="h-5 w-full overflow-hidden rounded-full bg-dark-light p-1 shadow-3xl">
                                                    <div
                                                        className="
                                                           relative h-full rounded-full 
                                                           bg-gradient-to-r from-[#009746] to-[#126337] 
                                                           before:absolute before:top-1/2 before:-translate-y-1/2
                                                           before:right-0 before:h-2 before:w-2
                                                           before:rounded-full before:bg-white
                                                           "
                                                        style={{ width: `${progressPercent}%` }}
                                                    ></div>
                                                </div>

                                            </div>} */}
                                            {progressPercent >= 96 && <div className="space-y-1 mt-4 ">
                                                <div className='mb-2'>
                                                    Quiz Status: <span className={`badge ${quiz_scores[0]?.is_passed ? "bg-success" : "bg-danger"}`}>{quiz_scores[0]?.is_passed ? "completed" : "Pending"}</span>
                                                </div>
                                                {!quiz_scores[0]?.is_passed &&
                                                    <div className="flex items-center justify-between font-semibold border p-2 rounded-md">
                                                        {!isLastModule ? (
                                                            <div className="flex gap-1 items-center">
                                                                <IconPlayCircle /> Unlock Next Module
                                                            </div>
                                                        ) : <div className="flex gap-1 items-center">
                                                            <IconPlayCircle /> Finish the Module
                                                        </div>}
                                                        <Link href={`/dash/student/quiz?moduleId=${data?.documentId}`}> <button type="button" className="btn btn-dark text-xs">Start Quiz</button></Link>

                                                    </div>}
                                            </div>}

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
