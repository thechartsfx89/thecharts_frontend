"use client"
import { getCourseUrl } from '@/utils/common/common'
import { BookOpen, PlayCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { DashEmpty, DashPageHeader } from '@/components/layouts/student/dash-ui'

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
                    setProgressVal(data?.data);
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

    return (
        <>
            <DashPageHeader title="Enroll Course" icon={BookOpen} />

            <div className="mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {isLoading ? (
                    [...Array(6)].map((_, i) => <div key={i} className="h-[340px] animate-pulse rounded-2xl bg-slate-200/60" />)
                ) : CourseData?.length > 0 ? (
                    CourseData?.map((moduleObj: any, index: number) => {
                        const { course: data, video_progresses = [], quiz_scores = [] } = moduleObj;

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

                        const isLastModule = index === CourseData.length - 1;

                        return (
                            <div key={data?.id} className="group relative">
                                <Link href={`/dash/student/enroll-course/module/${moduleObj?.course?.documentId}`} className="block h-full">
                                    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
                                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                                            <Image
                                                src={getCourseUrl(data?.course_thumbnail?.url) || "/images/placeholder/course-placeholder.jpg"}
                                                alt={data?.course_title || 'Enroll course image'}
                                                fill
                                                sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 90vw"
                                                className="object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="flex flex-1 flex-col p-5">
                                            <h2 className="font-bold text-[#0b1b33]">{data?.course_title ?? ""}</h2>
                                            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">{data?.course_desc ?? ""}</p>

                                            {progressPercent >= 96 && (
                                                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                                                    <div className="flex items-center justify-between font-medium text-[#0b1b33]">
                                                        Quiz Status:
                                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${quiz_scores[0]?.is_passed ? "bg-[#e9f8ef] text-[#0e9f4a]" : "bg-red-50 text-red-600"}`}>
                                                            {quiz_scores[0]?.is_passed ? "completed" : "Pending"}
                                                        </span>
                                                    </div>
                                                    {!quiz_scores[0]?.is_passed && (
                                                        <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 p-2.5 font-medium text-[#0b1b33]">
                                                            <span className="flex items-center gap-1.5">
                                                                <PlayCircle className="h-4 w-4 text-[#0e9f4a]" />
                                                                {!isLastModule ? 'Unlock Next Module' : 'Finish the Module'}
                                                            </span>
                                                            <Link href={`/dash/student/quiz?moduleId=${data?.documentId}`} className="shrink-0 rounded-lg bg-[#0b1b33] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#13284a]">
                                                                Start Quiz
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full rounded-2xl border border-slate-200 bg-white">
                        <DashEmpty icon={BookOpen} title="No courses found." />
                    </div>
                )}
            </div>
        </>
    )
}
