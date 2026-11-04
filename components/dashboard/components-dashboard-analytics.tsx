'use client';
import React, { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ActivationCountdown from '@/component/widget/ActivationCountdown';
import Link from 'next/link';
import ActivationLevelWindow from '@/component/widget/ActivationLevelWindow';
import { useSession } from 'next-auth/react';
import { ArrowRight, BookCheck, BookOpen, ChevronRight, Clock, GraduationCap, History, MessageCircle, Play, Users, Video } from 'lucide-react';
import { TheChartsMark } from '@/components/pages/Landing/logo';
import { DashCard, DashEmpty, DashPageHeader } from '@/components/layouts/student/dash-ui';

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

    const stats = [
        { title: 'Total Students', value: dashboardStats?.total_students ?? 0, icon: Users },
        { title: 'Total Teachers', value: dashboardStats?.total_teachers ?? 0, icon: GraduationCap },
        { title: 'Total Courses', value: dashboardStats?.total_courses ?? 0, icon: BookOpen },
        { title: 'Enrolled Courses', value: dashboardStats?.enrolled_courses ?? 0, icon: BookCheck },
    ];

    return (
        <div className="space-y-6">
            <DashPageHeader title="Dashboard" crumbs={false} />

            {/* Activation Timer */}
            {!user?.confirm_affiliate_payment ? <ActivationCountdown user={user} /> : <ActivationLevelWindow user={user} />}

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.title} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md">
                        <div>
                            <p className="text-sm font-medium text-slate-500">{item.title}</p>
                            <p className="tc-serif mt-1 text-3xl font-black text-[#0b1b33]">{item.value}</p>
                        </div>
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b1b33] text-[#16c75f]">
                            <item.icon className="h-6 w-6" />
                        </span>
                    </div>
                ))}
            </div>

            {/* Mentor Card */}
            <div className="tc-grid-bg relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl bg-[#0b1b33] p-6 text-white sm:flex-row sm:p-8">
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#16c75f]/20 blur-3xl" />
                <div className="relative shrink-0">
                    <TheChartsMark className="h-16 w-16" dark />
                    <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0b1b33] bg-[#16c75f]" />
                </div>
                <div className="relative flex-1 text-center sm:text-left">
                    <h2 className="tc-serif text-xl font-black">Your Mentor</h2>
                    <p className="mt-1 flex items-center justify-center gap-2 text-sm font-medium text-[#16c75f] sm:justify-start">
                        <span className="h-2 w-2 rounded-full bg-[#16c75f]" />
                        Online • Ready to help
                    </p>
                    <p className="mt-2 text-sm text-white/70">Ask questions, get guidance, and improve faster.</p>
                </div>
                <Link
                    href="/dash/student/mentor"
                    className="relative inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#16c75f] px-6 py-3 font-semibold text-[#0b1b33] transition hover:-translate-y-0.5 hover:bg-[#2fe079]"
                >
                    <MessageCircle className="h-5 w-5" />
                    Start Chat
                </Link>
            </div>

            {/* Lectures & Webinars Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recently Watched Lectures */}
                <DashCard title="Recently Watched Lectures" icon={History}>
                    <PerfectScrollbar className="h-[360px]">
                        {recentLectures.length === 0 ? (
                            <DashEmpty icon={Play} title="No recently watched videos" sub="Start watching a course — your history will appear here" />
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {recentLectures.map((v: any) => (
                                    <Link key={v.videoId} href={`/dash/student/enroll-course/details/${v.courseDocId}`} className="group flex gap-4 p-4 transition hover:bg-slate-50">
                                        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                            <img src={v.poster || '/no-thumbnail.jpg'} alt={v.title} className="h-full w-full object-cover" />
                                            <span className="absolute inset-0 flex items-center justify-center bg-[#0b1b33]/30 opacity-0 transition group-hover:opacity-100">
                                                <Play className="h-5 w-5 fill-white text-white" />
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="line-clamp-2 text-sm font-semibold text-[#0b1b33]">{v.title}</h3>
                                            <p className="mt-0.5 truncate text-xs text-slate-500">{v.courseTitle}</p>
                                            <p className="mt-2 flex items-center gap-1 text-xs font-medium text-[#0e9f4a]">
                                                <Clock className="h-3.5 w-3.5" />
                                                {getTimeAgo(v.watchedAt)}
                                            </p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 shrink-0 self-center text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#0e9f4a]" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </PerfectScrollbar>
                </DashCard>

                {/* Upcoming Webinars */}
                <DashCard title="Upcoming Webinars" icon={Video}>
                    <PerfectScrollbar className="h-[360px]">
                        {loadingWebinar ? (
                            <div className="space-y-3 p-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
                                ))}
                            </div>
                        ) : webinarList.length === 0 ? (
                            <DashEmpty icon={Video} title="No upcoming webinars" />
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {webinarList.map((webinar, index) => (
                                    <div key={webinar.id} className="flex items-center gap-4 p-4">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-sm font-semibold text-[#0b1b33]">{webinar.title}</h3>
                                            <p className="mt-0.5 text-xs text-slate-500">By {webinar?.webinar_by?.name ?? 'Mentor'}</p>
                                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                <Clock className="h-3.5 w-3.5" />
                                                {typeof webinar.duration === 'number' ? `${webinar.duration} min` : webinar.duration ?? '30 min'}
                                            </p>
                                        </div>
                                        {(index === 0 || index === 6) && (
                                            <>
                                                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">Live</span>
                                                <Link href="/dash/student/live-webinar" className="inline-flex items-center gap-1 rounded-lg bg-[#0b1b33] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#13284a]">
                                                    Join <ArrowRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </PerfectScrollbar>
                </DashCard>
            </div>
        </div>
    );
};

export default ComponentsDashboardAnalytics;
