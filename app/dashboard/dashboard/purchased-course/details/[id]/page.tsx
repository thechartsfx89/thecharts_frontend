
"use client";
import QuizStatusCard from '@/component/quiz/quizStatusCard';
import VdoPlayer from '@/component/video/vdoPlayer';
import IconAirplay from '@/components/icon/icon-airplay';
import IconChecks from '@/components/icon/icon-checks';
// import VdoPlayer from '@/component/video/vdoplayer';
import IconDownload from '@/components/icon/icon-download'
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconPlayCircle from '@/components/icon/icon-play-circle';
import IconSquareCheck from '@/components/icon/icon-square-check';
import IconMenuComponents from '@/components/icon/menu/icon-menu-components'
import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard'
import { getImageUrl } from '@/utils/common/common';
import { formatCourseLength, formatPlaylistCourseLength } from '@/utils/dateFormatter';
import { showToast } from '@/utils/toast';
import { co } from '@fullcalendar/core/internal-common';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { use, useEffect, useRef, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Swal from 'sweetalert2';
import { Check } from "lucide-react";

// Define the structure of the player.video proxy (which acts like HTMLVideoElement)
interface VdoPlayerVideoProxy {
    currentTime: number; // The played time in seconds
    // You can add other standard HTMLMediaElement properties/methods if needed
    addEventListener: (event: string, handler: (e: any) => void) => void;
    removeEventListener: (event: string, handler: (e: any) => void) => void;
    // ... other properties/methods
}

// Define the structure of the player.api object (custom VdoCipher methods)
interface VdoPlayerApi {
    getTotalPlayed: () => Promise<number>;
    getMetaData: () => Promise<any>;
    // ... other custom API methods
}

// Define the structure of the main player instance returned by getInstance
interface VdoPlayerInstance {
    video: VdoPlayerVideoProxy;
    api: VdoPlayerApi;
    // ... other properties
}

// Define the structure of the global VdoPlayer object available after script load

interface VdoPlayerProps {
    otp: string;
    playbackInfo: string;
}
interface VdoPlayerInstance {
    video: VdoPlayerVideoProxy;
    api: VdoPlayerApi;
}

// 🎯 The correct definition for the global VdoPlayer object
interface Window {
    VdoPlayer: {
        // This is the static method you need
        getInstance: (iframe: HTMLIFrameElement) => VdoPlayerInstance | undefined;

        // You can optionally add the constructor if you plan to use it as well
        new(container: HTMLElement | HTMLIFrameElement, options?: any): VdoPlayerInstance;
    };
}
const formatTime = (seconds: number): string => {
    // Convert seconds to HH:MM:SS format
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substring(11, 19);
};
type CourseAPI = {
    id: number;
    course_resources_desc: string
    course_resources_download: { url?: string } | null | any
    course_resources_title: string
    vdo_id?: string | undefined;
    documentId?: string;
    course_title?: string;
    course_desc?: string;
    course_price?: number;
    video_url?: string;
    course_thumbnail?: { url?: string } | null | any;
    course_category?: { category_name?: string } | any;
    teacher?: { teacher_name?: string } | any;
    playlist?: [] | any;
    module_id?: string;
    doc_id?: string;
};

export default function page({ _, searchParams }: any) {
    const message3 = '22991';
    const showMessage = (message: string = '') => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
        });

        toast.fire({
            icon: 'success',
            title: message || 'Download successfully.',
            padding: '10px 10px',
            didOpen: (toast) => {
                const titleEl = toast.querySelector(".swal2-title") as HTMLElement;
                if (titleEl) {
                    titleEl.style.fontSize = "16px"; // smaller font
                }
            },
        });
    };
    const params = useParams();
    // const router = useRouter();
    const videoId = (params as any)?.id as any;
    const doc_id = (searchParams as any)?.doc_id as any // /courses/[id]
    const [course, setCourse] = useState<CourseAPI[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    console.log("course", course, videoId, doc_id);
    // const documentId = props.documentId || routeId;

    useEffect(() => {
        let ignore = false;
        const fetchCourse = async () => {
            try {
                // const q = `${encodeURIComponent(routeId)}`;
                const res = await fetch(`/api/courses/video-auth/${videoId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store',
                });
                const { data } = await res.json();

                setCourse(data as CourseAPI[] || []);
                // if (!ignore) setCourse(item ?? null);
            } catch (e) {
                console.error('Failed to load course:', e);
                if (!ignore) setCourse([]);
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchCourse();
        // return () => {
        //     ignore = true;
        // };
    }, [videoId]);
    const [otp, setOtp] = useState<string>('');
    const [playbackInfo, setPlaybackInfo] = useState<string>('');
    const [vdoLoader, setVdoLoader] = useState(true);
    const [playlistActive, setPlaylistActive] = useState<string>('');
    const [playlistSerialNo, setPlaylistSerialNo] = useState<any>(null);

    console.log("otp", otp, playbackInfo, playlistActive);
    const apiVdoHandler = async (vdo_id: string, index: any) => {
        setIframeLoading(true);
        setPlaylistSerialNo(index);
        setPlaylistActive(vdo_id);
        try {
            setVdoLoader(true)
            const res: any = await fetch(`/api/courses/video-auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vdo_id: vdo_id }),
            });
            const { data } = await res.json();
            setOtp(data.otp);
            setPlaybackInfo(data.playbackInfo);
            console.log("data", data);
            // console.log("res", res, data);
            if (!res.ok) {
                throw new Error('Failed to record enroll course');
                setVdoLoader(false)
            }
            setVdoLoader(false)
        } catch (error) {
            setVdoLoader(false)

            console.error('Error recording enroll course:', error);
        }
    }
    useEffect(() => {


        if (course?.length > 0) {
            apiVdoHandler(course[0].vdo_id, 1)

        }

    }, [course?.length]);

    const [showIframe, setShowIframe] = useState(false);
    const [iframeLoading, setIframeLoading] = useState(false);
    console.log("showIframe", showIframe);
    useEffect(() => {
        setIframeLoading(true);
        if (otp && playbackInfo) {

            const timer = setTimeout(() => setShowIframe(true), 400);
            // setIframeLoading(false)
            return () => clearTimeout(timer);
        }
    }, [otp, playbackInfo, playlistActive]);
    const pdfUrl = course[0]?.course_resources_download?.[0].url ? getImageUrl(course[0]?.course_resources_download[0]?.url) : "";
    const { data: session, status } = useSession<any>();
    const [progressVal, setProgressVal] = useState<any>(null);
    const [progressList, setProgressList] = useState<any[]>([]);
      const [completedVideos, setCompletedVideos] = useState(0);
    const moduleTotalVdoLength =
        course[0]?.playlist?.rows.reduce(
            (total: number, item: any) => total + Number(item.length || 0),
            0
        ) || 0;
    console.log("moduleTotalVdoLength", moduleTotalVdoLength, progressVal);
    const percentage = moduleTotalVdoLength
        ? Math.round((progressVal / moduleTotalVdoLength) * 100)
        : 0;
    console.log("percentage", { progressVal, moduleTotalVdoLength, percentage });
    useEffect(() => {
        const fetchProgress = async (id: any) => {
            try {
                const res = await fetch(`/api/video/video-progress?moduleId=${id}`,
                    {
                        cache: "no-store",
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });
                const data = await res.json();
                if (data?.success && data?.data?.length > 0) {
                    const actualProgess = await data?.data?.reduce(
                        (total: number, item: any) => total + Number(item?.current_time || 0),
                        0
                    ) || 0;
                    setProgressVal(actualProgess);
                    console.log("Progress:", data?.data);
                    setProgressList(data.data);

                    const completed = getCompletedCount(
                        course[0]?.playlist?.rows || [],
                        data.data
                    );

                    setCompletedVideos(completed);
                }
            } catch (err) {
                console.error("⚠️ Failed to save progress:", err);
            }
        }
        if (course[0]?.module_id) {
            fetchProgress(course[0]?.module_id);
        }
    }, [moduleTotalVdoLength, iframeLoading, completedVideos]);

    console.log("moduleTotalVdoLength", moduleTotalVdoLength);
    let moduleId: any = null;
    if (percentage > 95) {
        moduleId = course[0]?.documentId;
    }
  
    // Check how many videos are completed based on video progress
    function getCompletedCount(playlist: any[], progress: any[]) {
        if (!playlist || !progress) return 0;

        return playlist.filter(video => {
            const progressItem = progress.find((p: any) => p.video_id === video.id);
            if (!progressItem) return false;

            const watched = Number(progressItem.current_time || 0);
            const total = Number(video.length || 0);

            // 95% watched = completed
            return total > 0 && watched >= total * 0.95;
        }).length;
    }
    // Check if a single playlist video is completed (≥ 95%)
    function isVideoCompleted(video: any, progressList: any[]) {
        if (!video || !progressList) return false;

        const progressItem = progressList.find((p: any) => p.video_id === video.id);
        if (!progressItem) return false;

        const watched = Number(progressItem.current_time || 0);
        const total = Number(video.length || 0);

        return total > 0 && watched >= total * 0.95;
    }

    return (
        <div>
            <ol className="flex items-center flex-wrap text-gray-500 font-semibold dark:text-white-dark gap-y-4 mb-3">
                <li>
                    <Link href={session?.user?.role == "mentor" ? `/dash/mentor` : session?.user?.role == "mentor" ? `/dash/student` : "#"}>
                        <button className="p-2.5 border border-gray-500/20 rounded-md shadow flex items-center justify-center dark:border-0 dark:bg-[#191e3a] hover:text-gray-500/70 dark:hover:text-white-dark/70 bg-white">
                            <IconMenuDashboard className="shrink-0 group-hover:!text-primary" />
                        </button>
                    </Link>
                </li>
                <li className="flex items-center before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4">
                    <Link href="/dash/dashboard/enroll-course">
                        <button className="p-2.5 border border-gray-500/20 rounded-md shadow flex gap-2 items-center justify-center dark:border-0 dark:bg-[#191e3a] hover:text-gray-500/70 dark:hover:text-white-dark/70">
                            <IconMenuComponents className="shrink-0 group-hover:!text-primary" />
                            Enroll Course
                        </button>
                    </Link>
                </li>
                <li className="flex items-center before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4">
                    <button className="p-2.5 border text-primary border-gray-500/20 rounded-md shadow flex items-center justify-center dark:border-0 dark:bg-[#191e3a] hover:text-gray-500/70 dark:hover:text-white-dark/70">
                        Details
                    </button>
                </li>
            </ol>

            <div className="panel grid grid-cols-1 lg:grid-cols-6 gap-6 p-6  ">
                <div className="lg:col-span-4">
                    <div className="relative aspect-video">
                        <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">

                            {iframeLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                    <svg
                                        className="animate-spin h-8 w-8 text-gray-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                </div>
                            )}
                            {showIframe && (
                                <div className="absolute inset-0 transition-opacity duration-700 opacity-100">
                                    <VdoPlayer
                                        otp={otp}
                                        playbackInfo={playbackInfo}
                                        videoId={playlistActive}
                                        module_id={course[0]?.module_id}
                                        courseId={doc_id}
                                        onLoad={() => setIframeLoading(false)}
                                    />

                                    {/* <iframe
                                        src={`https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}`}
                                        className="w-full h-full border-0 rounded-lg "
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen
                                        onLoad={() => setIframeLoading(false)}
                                        //   ref={iframeRef} // Attach the ref to the iframe
                                        id="vdoPlayerIframe" 
                                    ></iframe> */}

                                </div>
                            )}
                        </div>
                    </div>
                    {!course?.length ? <div aria-busy="true" aria-label="Loading course" className='my-3'>
                        {/* Header */}
                        <div className="mb-4">
                            <div className="h-6 w-3/5 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse" />
                            <div className="mt-2 h-3 w-4/5 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse" />
                            <div className="mt-2 h-3 w-2/3 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse" />
                        </div>

                        {/* Grid: teacher card + pdf card */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
                            {/* Teacher Card */}
                            <div className="col-span-1">
                                <div className="max-w-[30rem] w-full bg-white dark:bg-[#191e3a] rounded border border-white-light dark:border-[#1b2e4b]  dark:shadow-none p-5">
                                    <div className="flex items-center flex-col sm:flex-row">
                                        {/* Avatar */}
                                        <div className="mb-5 w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-700 animate-pulse" />

                                        {/* Teacher text */}
                                        <div className="flex-1 ltr:sm:pl-5 rtl:sm:pr-5 text-center sm:text-left">
                                            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
                                            <div className="mt-3 h-3 w-1/3 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
                                            <div className="mt-3 inline-block h-6 px-3 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
                                            <div className="mt-4 h-3 w-full sm:w-4/5 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
                                            <div className="mt-2 h-3 w-3/5 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
                                            <div className="mt-2 h-3 w-3/5 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PDF Card */}
                            <div className="col-span-1">
                                <div className="bg-white dark:bg-[#0b1020] border rounded p-4">
                                    <div className="rounded bg-[#f1f2f3] dark:bg-[#060818] p-5">
                                        <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
                                        <div className="mt-3 h-3 w-4/5 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
                                        <div className="mt-4 h-3 w-3/5 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />

                                        {/* buttons */}
                                        <div className="sm:flex items-center space-y-2 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse mt-4">
                                            <div className="h-10 w-28 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse" />
                                            <div className="h-10 w-20 rounded-md bg-gray-200 dark:bg-slate-700 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        : <>
                            <div>
                                <h1 className='font-semibold text-lg my-3'>{course[0]?.course_title}</h1>
                                <p className="text-xs text-gray-500">{course[0]?.course_desc}
                                    {/* the major participants including central banks and retail traders, and the benefits of trading Forex. */}
                                </p>
                            </div>
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 py-4'>
                                {course[0]?.teacher?.teacher_name && <div className="col-span-1">
                                    <div className="max-w-[30rem] w-full bg-white  rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none panel">
                                        <div className="flex items-center flex-col sm:flex-row">
                                            <div className="mb-5 w-20 h-20 rounded-full overflow-hidden">
                                                <img src={getImageUrl(course[0]?.teacher?.teacher_image?.url)} alt="profile" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 ltr:sm:pl-5 rtl:sm:pr-5 text-center sm:text-left">
                                                <h5 className="text-[#3b3f5c] text-[15px] font-semibold mb-2 dark:text-white-light">{course[0]?.teacher?.teacher_name}</h5>
                                                <p className="mb-2 text-white-dark">Mentor</p>
                                                <span className="badge bg-primary rounded-full">
                                                    {course[0]?.teacher?.teacher_rating}
                                                </span>
                                                <p className="font-medium text-[12px] text-white-dark mt-2 sm:mt-4">
                                                    {course[0]?.teacher?.teacher_desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                                {pdfUrl && <div className='bg-white border border-rounded p-4  dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none panel'>
                                    <div className="rounded bg-[#f1f2f3] p-5 dark:bg-[#060818]">
                                        <p className="mb-3 font-semibold">
                                            {course[0]?.course_resources_title}
                                            <span className="text-2xl" id="copyOTP" defaultValue={"message3"}>
                                            </span>
                                            .
                                        </p>
                                        <p className="font-medium text-[12px]">{course[0]?.course_resources_desc}</p>
                                        <div className="sm:flex space-y-2 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse mt-3">
                                            <CopyToClipboard
                                                text={pdfUrl}
                                                onCopy={(text, result) => {
                                                    if (result) {
                                                        if (!pdfUrl) {
                                                            showToast("info", 'File not available for download');
                                                        } else {
                                                            showMessage();
                                                            window.open(text, "_blank");
                                                        }

                                                    };
                                                }}
                                            >
                                                <button type="button"

                                                    className="btn btn-primary flex items-center">
                                                    <IconDownload />
                                                    <span className="ml-2">Download</span>
                                                </button>
                                            </CopyToClipboard>

                                        </div>
                                    </div>
                                </div>}

                            </div>
                        </>}
                </div>
                {course?.length > 0 ?
                    <div className='lg:col-span-2 '>
                        <div className="space-y-4 panel w-auto lg:h-fit h-auto p-4 rounded-lg border border-white-dark  dark:bg-[#191e3a]">

                            <div>
                                <h3 className="text-lg font-semibold mb-1">
                                    {course[0]?.course_title} Lessons
                                </h3>
                                <div className="mb-4">
                                    {course[0]?.teacher?.teacher_name} - {playlistSerialNo}{"/"}{course[0]?.playlist?.count}
                                </div>
                                <div className="mb-2 flex items-center justify-between font-semibold">
                                    <div className="flex items-center">
                                        <IconSquareCheck className="h-4 w-4 text-success" />
                                        <div className="text-xs ltr:ml-2 rtl:mr-2">Completed ({completedVideos}/{course[0]?.playlist?.count})</div>
                                    </div>
                                    <p className="text-primary">{`${percentage ?? 0}%`}</p>
                                </div>
                                <div className="mb-5 h-2.5 rounded-full bg-dark-light p-0.5 dark:bg-dark-light/10">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#1e9afe] to-[#60dfcd]" style={{ width: `${percentage ?? 0}%` }}></div>
                                </div>
                            </div>

                            {/* Scrollable Area */}
                            <div className="max-h-96 overflow-y-auto pr-2 space-y-2">
                                {course[0]?.playlist?.rows?.map((data: any, index: any) => {
                                    const isActive = data?.id == playlistActive; // ⬅️ Set this from props/state
                                    const completed = isVideoCompleted(data, progressList);
                                    return (
                                        <Link href="#" key={data?.id} onClick={() => apiVdoHandler(data?.id, index + 1)}>
                                            <div
                                                className={`grid grid-cols-8 gap-3 p-2 rounded-lg cursor-pointer transition-all
                                           ${isActive
                                                        ? "bg-blue-100 dark:bg-blue-900"
                                                        : "hover:bg-gray-100 dark:hover:bg-[#2a3555]"
                                                    }
                                            `}>
                                                <div className="col-span-3 flex items-center gap-2">
                                                    {/* <span className="text-sm font-semibold w-6 text-center">{index + 1}</span> */}
                                                    {completed ? (
                                                        <span className="text-sm font-extrabold w-6 text-center">
                                                        <IconSquareCheck className="h-4 w-4 text-dark font-extrabold" />
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm font-semibold w-6 text-center">
                                                            {index + 1}
                                                        </span>
                                                    )}

                                                    {/* Wrap image + overlay inside a relative div */}
                                                    <div className="relative">
                                                        <Image
                                                            src={data?.poster ?? ""}
                                                            alt="img"
                                                            width={300}
                                                            height={320}
                                                            className={`rounded transition-all duration-300 
                                                          ${isActive ? "opacity-50" : "opacity-100"}
                                                        `}
                                                        />

                                                        {/* Video length overlay */}
                                                        <div className="absolute font-extrabold right-1 bottom-1 bg-black/60 text-white text-[10px] px-1 py-[1px] rounded">
                                                            {formatPlaylistCourseLength(data?.length)}
                                                        </div>
                                                        {isActive && (
                                                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold ">
                                                                <IconPlayCircle />
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>



                                                <div className="col-span-5 ">
                                                    <h3 className="text-sm font-semibold mb-1">
                                                        {data?.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                                        {data?.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}

                            </div>


                        </div>
                        <QuizStatusCard isUnlocked={percentage > 96} moduleId={moduleId} />
                    </div>

                    :
                    <div className="lg:col-span-2 space-y-4 panel w-auto lg:h-fit h-auto p-4 rounded-lg border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] animate-pulse">

                        {/* Header Skeleton */}
                        <div>
                            <div className="h-5 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>

                        {/* Scroll Area */}
                        <div className="max-h-96 overflow-y-auto pr-2 space-y-3">

                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    key={item}
                                    className="grid grid-cols-8 gap-3 p-2 rounded-lg bg-gray-100 dark:bg-[#2a3555]"
                                >

                                    {/* Left section: Number + Image */}
                                    <div className="col-span-3 flex items-center gap-2">

                                        {/* Number Circle */}
                                        <div className="w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded-full"></div>

                                        {/* Image Skeleton */}
                                        <div className="relative">
                                            <div className="w-20 h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>

                                            {/* Duration small bar */}
                                            <div className="absolute right-1 bottom-1 w-8 h-3 bg-gray-400 dark:bg-gray-600 rounded"></div>
                                        </div>
                                    </div>

                                    {/* Right section: Title + desc */}
                                    <div className="col-span-5 space-y-2">
                                        <div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        <div className="h-2 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        <div className="h-2 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    </div>

                                </div>
                            ))}

                        </div>
                    </div>

                }





            </div>


        </div>
    )
}
