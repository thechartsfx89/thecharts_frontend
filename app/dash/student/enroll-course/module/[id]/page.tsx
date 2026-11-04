

"use client"
import { BookOpen } from 'lucide-react'
import { DashPageHeader } from '@/components/layouts/dash-ui'
import IconLockDots from '@/components/icon/icon-lock-dots'
import IconPlayCircle from '@/components/icon/icon-play-circle'
import IconSquareCheck from '@/components/icon/icon-square-check'
import { getCourseUrl } from '@/utils/common/common'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState, useCallback } from 'react'

type PageProps = {
    params: { id: string; };
};

export default function Page({ params }: PageProps) {
    const { id } = params;
    const { data: session } = useSession();
    
    const [CourseData, setCourseData] = useState<any[]>([]);
    const [moduleData, setModuleData] = useState<any>(null);
    const [progressByModule, setProgressByModule] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);

    // 1. Fetch Main Course/Module Data
    useEffect(() => {
        if (!id) return;

        const fetchMainData = async () => {
            setIsLoading(true);
            try {
                // Force no-cache with timestamp for production reliability
                const res = await fetch(`/api/dash/student/enroll-course/module?id=${id}&t=${Date.now()}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store' 
                });

                const result = await res.json();
                
                if (result?.data?.course_modules) {
                    // IMPORTANT: Sort by an order/rank property so "previous" logic works
                    const sortedModules = result.data.course_modules.sort((a: any, b: any) => 
                        (a.order || 0) - (b.order || 0)
                    );
                    setCourseData(sortedModules);
                    setModuleData(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch course module:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMainData();
    }, [id]);

    // 2. Fetch Progress for each module (Optimized)
    const getProgressData = useCallback(async (moduleId: string) => {
        if (!moduleId) return;
        try {
            const res = await fetch(`/api/video/video-progress?moduleId=${moduleId}&t=${Date.now()}`, {
                cache: "no-store",
                headers: { "Content-Type": "application/json" },
            });
            const result = await res.json();
            setProgressByModule((prev: any) => ({
                ...prev,
                [moduleId]: result?.data || [],
            }));
        } catch (error) {
            console.error("Progress fetch failed:", error);
        }
    }, []);

    useEffect(() => {
        if (CourseData?.length > 0) {
            CourseData.forEach((mod) => getProgressData(mod.documentId));
        }
    }, [CourseData, getProgressData]);

    return (
        <>
            <DashPageHeader title={moduleData?.course_title ?? "Loading..."} sub="Modules" icon={BookOpen} parents={[{ label: "Enroll Course", href: "/dash/student/enroll-course" }]} />

            <div className="mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {isLoading ? (
                    <p className="col-span-full rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">Verifying Course Access...</p>
                ) : CourseData.length > 0 ? (
                    CourseData.map((moduleObj: any, index: number) => {
                        const video_progresses = progressByModule[moduleObj?.documentId] || [];
                        
                        // Calculate Progress
                        const moduleTotalVdoLength = moduleObj?.playlist?.rows?.reduce((t: number, i: any) => t + Number(i.length || 0), 0) || 0;
                        const progressVal = video_progresses.reduce((t: number, i: any) => t + Number(i.current_time || 0), 0);
                        const progressPercent = moduleTotalVdoLength ? Math.min(Math.round((progressVal / moduleTotalVdoLength) * 100), 100) : 0;

                        // LOCK LOGIC
                        const isFirstModule = index === 0;
                        const prevModulePassed = index > 0 ? CourseData[index - 1]?.quiz_score[0]?.is_passed : false;
                        
                        // A module is LOCKED if it's NOT the first one AND the previous one isn't passed
                        const isModuleLocked = !isFirstModule && !prevModulePassed;

                        return (
                            <div key={moduleObj?.id} className={`relative ${isModuleLocked ? "cursor-not-allowed" : ""}`}>
                                
                                {isModuleLocked && (
                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/70 px-6 text-center backdrop-blur-[2px]">
                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#0b1b33]">
                                            <IconLockDots className="h-6 w-6 text-[#16c75f]" />
                                        </div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-[#0b1b33]">Complete Previous Quiz to Unlock</p>
                                    </div>
                                )}

                                <Link 
                                    href={isModuleLocked ? "#" : `/dash/student/enroll-course/details/${moduleObj?.documentId}`}
                                    className={isModuleLocked ? "pointer-events-none" : ""}
                                >
                                    <div className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
                                        <div className="relative aspect-[16/10] w-full bg-slate-100">
                                            <Image
                                                src={getCourseUrl(moduleObj?.thumbnail?.url) || "/images/placeholder/course-placeholder.jpg"}
                                                alt={moduleObj?.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="p-5">
                                            <p className="mb-1 font-bold text-[#0b1b33]">{moduleObj?.title}</p>
                                            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600">{moduleObj?.description}</p>

                                            {/* Progress Bar */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="flex items-center gap-1 text-slate-500"><IconSquareCheck className="h-3 w-3 text-[#0e9f4a]"/> Progress</span>
                                                    <span className="text-[#0b1b33]">{progressPercent}%</span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                                    <div className="h-full rounded-full bg-[#16c75f] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                                                </div>
                                            </div>

                                            {/* Quiz Section */}
                                            {progressPercent >= 90 && (
                                                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                                                    <p className="text-xs font-bold mb-2">
                                                        Quiz Status: <span className={moduleObj?.quiz_score[0]?.is_passed ? "text-success" : "text-danger"}>
                                                            {moduleObj?.quiz_score[0]?.is_passed ? "COMPLETED" : "QUIZ PENDING"}
                                                        </span>
                                                    </p>
                                                    {!moduleObj?.quiz_score[0]?.is_passed && (
                                                        <Link href={`/dash/student/quiz?courseDocId=${id}&moduleId=${moduleObj?.documentId}`}>
                                                            <button className="w-full rounded-lg bg-[#0b1b33] py-2 text-xs font-semibold text-white transition hover:bg-[#13284a]">Start Quiz</button>
                                                        </Link>
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
                    <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-10 text-center">
                        <p className="text-gray-500">No modules assigned to this course yet.</p>
                    </div>
                )}
            </div>
        </>
    );
}