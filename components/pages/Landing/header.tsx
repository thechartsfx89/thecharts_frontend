'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { ArrowRight, Menu, X } from 'lucide-react';
import AuthModals from '@/component/auth/authModal';
import TheChartsLogo from './logo';

type AuthKind = 'login' | 'signup';

const NAV = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Courses', href: '/courses' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Live Charts', href: '/live-charts' },
    { label: 'Calendar', href: 'https://www.forexfactory.com/calendar', external: true },
    { label: 'Contact', href: '/contact' },
];

const dashboardHref = (role?: string) => (role === 'mentor' ? '/dash/mentor' : role === 'student' ? '/dash/affiliate' : role === 'admin' ? '/dash/admin' : '#');

export default function Header() {
    const { data: session } = useSession<any>();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [authModal, setAuthModal] = useState<AuthKind | null>(null);

    // AuthModals only reacts to changes of openModal, so reset before re-opening
    const openAuth = (kind: AuthKind) => {
        setMobileOpen(false);
        setAuthModal(null);
        setTimeout(() => setAuthModal(kind), 10);
    };

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/75 backdrop-blur-xl">
            <AuthModals openModal={authModal} onClose={() => setAuthModal(null)} isMobile={true} />

            <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" aria-label="The Charts home">
                    <TheChartsLogo />
                </Link>

                <nav className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-white/70 p-1 xl:flex">
                    {NAV.map((item, i) =>
                        item.external ? (
                            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="rounded-full px-3.5 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-[#0b1b33]">
                                {item.label}
                            </a>
                        ) : (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`rounded-full px-3.5 py-1.5 text-sm transition ${i === 0 ? 'bg-slate-100 font-semibold text-[#0b1b33]' : 'text-slate-600 hover:bg-slate-100 hover:text-[#0b1b33]'}`}
                            >
                                {item.label}
                            </Link>
                        ),
                    )}
                </nav>

                <div className="hidden items-center gap-3 xl:flex">
                    {!session ? (
                        <>
                            <button type="button" onClick={() => openAuth('login')} className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#0b1b33]">
                                Log In
                            </button>
                            <button
                                type="button"
                                onClick={() => openAuth('signup')}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#0b1b33] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-[#13284a]"
                            >
                                Get Started <ArrowRight className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href={dashboardHref(session?.user?.role)}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#0b1b33] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5"
                            >
                                Dashboard <ArrowRight className="h-4 w-4" />
                            </Link>
                            <button type="button" onClick={() => signOut({ callbackUrl: '/' })} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600">
                                Sign Out
                            </button>
                        </>
                    )}
                </div>

                <button type="button" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} onClick={() => setMobileOpen((v) => !v)} className="rounded-lg p-2 text-[#0b1b33] hover:bg-slate-100 xl:hidden">
                    {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {mobileOpen && (
                <div className="border-t border-slate-200 bg-white px-4 pb-6 pt-2 shadow-xl xl:hidden">
                    <nav className="flex flex-col">
                        {NAV.map((item) =>
                            item.external ? (
                                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="border-b border-slate-100 py-3 text-base text-slate-700">
                                    {item.label}
                                </a>
                            ) : (
                                <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="border-b border-slate-100 py-3 text-base text-slate-700">
                                    {item.label}
                                </Link>
                            ),
                        )}
                    </nav>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                        {!session ? (
                            <>
                                <button type="button" onClick={() => openAuth('login')} className="rounded-xl border border-slate-300 py-3 font-semibold text-[#0b1b33]">
                                    Log In
                                </button>
                                <button type="button" onClick={() => openAuth('signup')} className="rounded-xl bg-[#0b1b33] py-3 font-semibold text-white">
                                    Get Started
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href={dashboardHref(session?.user?.role)} className="rounded-xl bg-[#0b1b33] py-3 text-center font-semibold text-white">
                                    Dashboard
                                </Link>
                                <button type="button" onClick={() => signOut({ callbackUrl: '/' })} className="rounded-xl border border-slate-300 py-3 font-semibold text-red-600">
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
