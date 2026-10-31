

"use client"
import IconBell from '@/components/icon/icon-bell'
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
            <div className="panel flex items-center overflow-x-auto p-3 text-primary mb-3">
                <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 mr-3">
                    <IconBell />
                </div>
                <span className="font-bold">Modules: <span className='text-dark'>{moduleData?.course_title ?? "Loading..."}</span></span>
            </div>

            <div className="mb-6 grid gap-6 sm:grid-cols-2 xxl:grid-cols-4 xl:grid-cols-3">
                {isLoading ? (
                    <p className="p-5 text-center col-span-full">Verifying Course Access...</p>
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
                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 mb-2">
                                            <IconLockDots className="w-6 h-6 text-red-600" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-500 uppercase">Complete Previous Quiz to Unlock</p>
                                    </div>
                                )}

                                <Link 
                                    href={isModuleLocked ? "#" : `/dash/student/enroll-course/details/${moduleObj?.documentId}`}
                                    className={isModuleLocked ? "pointer-events-none" : ""}
                                >
                                    <div className="panel h-full overflow-hidden border-0 p-0 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <div className="h-[190px] w-full relative bg-gray-100">
                                            <Image
                                                src={getCourseUrl(moduleObj?.thumbnail?.url) || "/images/placeholder/course-placeholder.jpg"}
                                                alt={moduleObj?.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="p-5">
                                            <p className="font-bold mb-1 text-lg">{moduleObj?.title}</p>
                                            <p className="text-xs text-gray-500 line-clamp-2 mb-4">{moduleObj?.description}</p>

                                            {/* Progress Bar */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="flex items-center gap-1"><IconSquareCheck className="text-success w-3 h-3"/> Progress</span>
                                                    <span className="text-primary">{progressPercent}%</span>
                                                </div>
                                                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-success transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                                                </div>
                                            </div>

                                            {/* Quiz Section */}
                                            {progressPercent >= 90 && (
                                                <div className="mt-4 p-3 border rounded-lg bg-gray-50">
                                                    <p className="text-xs font-bold mb-2">
                                                        Quiz Status: <span className={moduleObj?.quiz_score[0]?.is_passed ? "text-success" : "text-danger"}>
                                                            {moduleObj?.quiz_score[0]?.is_passed ? "COMPLETED" : "QUIZ PENDING"}
                                                        </span>
                                                    </p>
                                                    {!moduleObj?.quiz_score[0]?.is_passed && (
                                                        <Link href={`/dash/student/quiz?courseDocId=${id}&moduleId=${moduleObj?.documentId}`}>
                                                            <button className="w-full btn btn-primary text-xs">Start Quiz</button>
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
                    <div className="col-span-full panel p-10 text-center">
                        <p className="text-gray-500">No modules assigned to this course yet.</p>
                    </div>
                )}
            </div>
        </>
    );
}