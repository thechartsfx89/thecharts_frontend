'use client';
import TheChartsLogo from '@/components/pages/Landing/logo';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '@/store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '@/store';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { useSession } from 'next-auth/react';
import { BookOpen, ChevronDown, ChevronsLeft, GraduationCap, LayoutDashboard, LucideIcon, MessagesSquare, ReceiptText, Share2, UserRoundCheck, Users, Video } from 'lucide-react';

const itemClass = (active: boolean) =>
    `group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-white/10 text-white' : 'text-white/65 hover:bg-white/5 hover:text-white'}`;

const iconClass = (active: boolean) => `h-5 w-5 shrink-0 transition ${active ? 'text-[#16c75f]' : 'text-white/50 group-hover:text-white/80'}`;

function NavLink({ href, label, icon: Icon, active }: { href: string; label: string; icon: LucideIcon; active: boolean }) {
    return (
        <li>
            <Link href={href} aria-current={active ? 'page' : undefined} className={itemClass(active)}>
                {active && <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-[#16c75f]" />}
                <Icon className={iconClass(active)} />
                <span>{label}</span>
            </Link>
        </li>
    );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
    return <h2 className="px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">{children}</h2>;
}

const StudentSidebar = () => {
    const dispatch = useDispatch();
    const { t } = getTranslation();
    const pathname = usePathname();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const { data: session } = useSession<any>();
    const role = session?.user?.role;

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
    const coursesActive = isActive('/dash/student/enroll-course');
    const [coursesOpen, setCoursesOpen] = useState(coursesActive);

    useEffect(() => {
        if (coursesActive) setCoursesOpen(true);
    }, [coursesActive]);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [pathname]);

    const dashboardHref = role == 'mentor' ? `/dash/mentor` : role == 'student' ? `/dash/student` : '#';

    return (
        <nav aria-label="Student panel" className="sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] bg-[#0b1b33] transition-all duration-300">
            <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-4">
                <Link href="/" className="main-logo flex shrink-0 items-center" aria-label="The Charts home">
                    <TheChartsLogo className="h-10" onDark />
                </Link>

                <button
                    type="button"
                    aria-label="Collapse menu"
                    className="collapse-icon flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white rtl:rotate-180"
                    onClick={() => dispatch(toggleSidebar())}
                >
                    <ChevronsLeft className="h-5 w-5" />
                </button>
            </div>

            <PerfectScrollbar className="relative h-[calc(100vh-72px)]">
                <div className="px-3 pb-6 pt-4">
                    <ul className="space-y-1">
                        <NavLink href={dashboardHref} label={t('Dashboard')} icon={LayoutDashboard} active={pathname === dashboardHref} />
                    </ul>

                    <GroupLabel>{t('Explore')}</GroupLabel>
                    <ul className="space-y-1">
                        <li>
                            <button type="button" aria-expanded={coursesOpen} className={itemClass(coursesActive)} onClick={() => setCoursesOpen((open) => !open)}>
                                {coursesActive && <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-[#16c75f]" />}
                                <BookOpen className={iconClass(coursesActive)} />
                                <span className="flex-1 text-left">{t('Courses')}</span>
                                <ChevronDown className={`h-4 w-4 text-white/50 transition-transform ${coursesOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimateHeight duration={300} height={coursesOpen ? 'auto' : 0}>
                                <ul className="ml-[22px] mt-1 space-y-1 border-l border-white/10 pl-3">
                                    <li>
                                        <Link href="/dash/student/enroll-course" className={`block rounded-lg px-3 py-2 text-sm transition ${coursesActive ? 'font-medium text-[#16c75f]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                                            {t('Enroll course')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/courses" className="block rounded-lg px-3 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white">
                                            {t('All Courses')}
                                        </Link>
                                    </li>
                                </ul>
                            </AnimateHeight>
                        </li>
                        <NavLink href="/dash/student/live-webinar/list" label={t('Live Webinar')} icon={Video} active={isActive('/dash/student/live-webinar')} />
                        <NavLink href="/dash/student/oneToOneTeaching" label={t('One to One Teaching')} icon={GraduationCap} active={isActive('/dash/student/oneToOneTeaching')} />
                        {role == 'student' && <NavLink href="/dash/student/mentor" label={t('Mentor Panel')} icon={UserRoundCheck} active={isActive('/dash/student/mentor')} />}
                        {role == 'mentor' && <NavLink href="/dash/student/student" label={t('Mentor Panel')} icon={UserRoundCheck} active={isActive('/dash/student/student')} />}
                        <NavLink href="/dash/student/billing" label={t('Billing History')} icon={ReceiptText} active={isActive('/dash/student/billing')} />
                        <NavLink href="/dash/student/share-earn" label={t('Share / Earn')} icon={Share2} active={isActive('/dash/student/share-earn')} />
                    </ul>

                    <GroupLabel>{t('supports')}</GroupLabel>
                    <ul className="space-y-1">
                        <NavLink href="/dash/student/community" label={t('Community Support')} icon={MessagesSquare} active={isActive('/dash/student/community')} />
                    </ul>
                </div>
            </PerfectScrollbar>
        </nav>
    );
};

export default StudentSidebar;
