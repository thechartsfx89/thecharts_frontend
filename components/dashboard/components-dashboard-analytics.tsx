'use client';
import IconChatDots from '@/components/icon/icon-chat-dots';
import IconChecks from '@/components/icon/icon-checks';
import IconClock from '@/components/icon/icon-clock';
import IconFile from '@/components/icon/icon-file';
import IconSquareCheck from '@/components/icon/icon-square-check';
import IconUsersGroup from '@/components/icon/icon-users-group';
import { IRootState } from '@/store';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ActivationCountdown from '@/component/widget/ActivationCountdown';
import Link from 'next/link';
import ActivationLevelWindow from '@/component/widget/ActivationLevelWindow';
import { useSession } from 'next-auth/react';

const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const then = new Date(dateString);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 604800)} weeks ago`;
};

const ComponentsDashboardAnalytics = () => {
    const isDark = useSelector(
        (state: IRootState) =>
            state.themeConfig.theme === 'dark' ||
            state.themeConfig.isDarkMode
    );

    const { data: session } = useSession();
    const userId = (session?.user as any)?.id || 'guest';

    const [user, setUser] = useState<any>(null);
    const [recentLectures, setRecentLectures] = useState<any[]>([]);
    const [webinarList, setWebinarList] = useState<any[]>([]);
    const [loadingWebinar, setLoadingWebinar] = useState(true);
    const [dashboardStats, setDashboardStats] = useState<{
        total_students: number;
        total_teachers: number;
        total_courses: number;
        enrolled_courses: number;
    } | null>(null);

    // ✅ Load recently watched per user
    useEffect(() => {
        if (!userId) return;
        try {
            const key = `recently_watched_${userId}`;
            const history = JSON.parse(localStorage.getItem(key) || '[]');
            setRecentLectures(history.slice(0, 5));
        } catch {
            setRecentLectures([]);
        }
    }, [userId]);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const res = await fetch('/api/student/dashboard/upperpart', {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                const json = await res.json();
                if (!res.ok || !json?.status) {
                    console.error('Dashboard API failed', json);
                    return;
                }
                setDashboardStats(json.data?.data?.data);
            } catch (error) {
                console.error('Dashboard stats error:', error);
            }
        };
        fetchDashboardStats();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/dash/student/affiliate-confirm');
                const data = await response.json();
                setUser(data?.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchWebinars = async () => {
            try {
                const res = await fetch('/api/webinar', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const { data } = await res.json();
                setWebinarList(data?.data || []);
            } catch (err) {
                console.error('Webinar fetch failed', err);
                setWebinarList([]);
            } finally {
                setLoadingWebinar(false);
            }
        };
        fetchWebinars();
    }, []);

    return (
        <div className="space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
            {/* Activation Timer */}
            {!user?.confirm_affiliate_payment ?
                <ActivationCountdown user={user} />
                : <ActivationLevelWindow user={user} />}

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: 'Total Students', value: dashboardStats?.total_students ?? 0, icon: <IconUsersGroup className="w-6 h-6" />, color: 'from-blue-500 to-blue-600' },
                    { title: 'Total Teachers', value: dashboardStats?.total_teachers ?? 0, icon: <IconUsersGroup className="w-6 h-6" />, color: 'from-emerald-500 to-emerald-600' },
                    { title: 'Total Courses', value: dashboardStats?.total_courses ?? 0, icon: <IconFile className="w-6 h-6" />, color: 'from-amber-500 to-amber-600' },
                    { title: 'Enrolled Courses', value: '', icon: <IconSquareCheck className="w-6 h-6" />, color: 'from-rose-500 to-rose-600' },
                ].map((item, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
                        <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                        <div className="relative flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-dark dark:text-slate-400 mb-1">{item.title}</p>
                                <h3 className="text-3xl font-bold text-dark dark:text-white">{item.value}</h3>
                            </div>
                            <div className={`bg-gradient-to-br ${item.color} p-3 rounded-xl text-white shadow-lg`}>{item.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mentor Card - full width now */}
            <div className="rounded-lg bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 shadow-lg border border-rose-200 dark:border-rose-700 p-8 flex flex-col sm:flex-row items-center gap-8">
                <div className="flex justify-center">
                    <div className="relative">
                        <img src="/assets/images/g-8.png" alt="Mentor" className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h6 className="font-bold text-xl text-rose-900 dark:text-rose-200 mb-1">Your Mentor</h6>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <p className="text-sm text-rose-700 dark:text-rose-300">Online • Ready to help</p>
                    </div>
                    <p className="text-sm text-rose-800 dark:text-rose-300">
                        Ask questions, get guidance, and improve faster.
                    </p>
                </div>
                <Link href={"/dash/student/mentor"}>
                    <button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                        Start Chat
                    </button>
                </Link>
            </div>

            {/* Lectures & Webinars Grid */}
            <div className="grid gap-6 lg:grid-cols-2">

                {/* Recently Watched Lectures */}
                <div className="rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="bg-teal-400 p-3">
                        <div className="flex items-center gap-3">
                            <IconChecks className="w-6 h-6 text-white" />
                            <h5 className="text-lg font-bold text-white">Recently Watched Lectures</h5>
                        </div>
                    </div>
                    <PerfectScrollbar className="h-[400px]">
                        <div className="p-4 space-y-3">
                            {recentLectures.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
                                    <svg className="w-14 h-14 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-medium">No recently watched videos</p>
                                    <p className="text-xs mt-1 text-center px-6">Start watching a course — your history will appear here</p>
                                </div>
                            ) : (
                                recentLectures.map((v: any) => (
                                    <Link key={v.videoId} href={`/dash/student/enroll-course/details/${v.courseDocId}`}>
                                        <div className="group flex gap-4 p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-md hover:shadow-xl border border-slate-100 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-700 transition-all duration-300 cursor-pointer">

                                            {/* Thumbnail with gradient accent */}
                                            <div className="relative flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden shadow-lg">
                                                <img
                                                    src={v.poster || '/placeholder.svg'}
                                                    alt={v.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                {/* Gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                {/* Play button */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                                                        <svg className="w-4 h-4 text-teal-600 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                                <div>
                                                    <h6 className="font-semibold text-slate-800 dark:text-white text-sm line-clamp-2 mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200">
                                                        {v.title}
                                                    </h6>
                                                    {/* Course name with accent dot */}
                                                    <div className="flex items-center gap-1.5 mb-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{v.courseTitle}</p>
                                                    </div>
                                                </div>
                                                {/* Bottom row */}
                                                <div className="flex items-center justify-between">
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {getTimeAgo(v.watchedAt)}
                                                    </span>
                                                    <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </PerfectScrollbar>
                </div>

                {/* Upcoming Webinars */}
                <div className="rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="bg-amber-400 p-3">
                        <div className="flex items-center gap-3">
                            <IconClock className="w-6 h-6 text-white" />
                            <h5 className="text-lg font-bold text-white">Upcoming Webinars</h5>
                        </div>
                    </div>
                    <PerfectScrollbar className="h-[400px]">
                        <div className="space-y-3 p-4">
                            {loadingWebinar ? (
                                <p className="text-center text-sm text-slate-500">Loading webinars...</p>
                            ) : webinarList.length === 0 ? (
                                <p className="text-center text-sm text-slate-500">No upcoming webinars</p>
                            ) : (
                                webinarList.map((webinar, index) => (
                                    <div key={webinar.id} className="group flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 transition hover:bg-amber-100 dark:border-amber-700/50 dark:bg-amber-900/20">
                                        <div className="flex-1">
                                            <h6 className="font-semibold text-sm">{webinar.title}</h6>
                                            <p className="text-xs text-slate-500 mt-1">By {webinar?.webinar_by?.name ?? 'Mentor'}</p>
                                            <p className="text-xs mt-1">⏱ {webinar.duration ?? '30 min'}</p>
                                        </div>
                                        {(index === 0 || index === 6) && <span className="badge bg-danger px-4 py-1">Live</span>}
                                        {(index === 0 || index === 6) && (
                                            <Link href="/dash/student/live-webinar" className="badge badge-outline-success font-bold px-4 py-1">Join</Link>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </PerfectScrollbar>
                </div>
            </div>
        </div>
    );
};

export default ComponentsDashboardAnalytics;