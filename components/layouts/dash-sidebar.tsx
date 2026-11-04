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
import { ChevronDown, ChevronsLeft, LucideIcon } from 'lucide-react';

export type DashNavItem = {
    label: string;
    icon: LucideIcon;
    href?: string;
    // Marks the item active on this route and everything below it, when that differs from href
    activeHref?: string;
    exact?: boolean;
    children?: { label: string; href: string }[];
};

export type DashNavSection = { title?: string; items: DashNavItem[] };

const itemClass = (active: boolean) =>
    `group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-white/10 text-white' : 'text-white/65 hover:bg-white/5 hover:text-white'}`;

const iconClass = (active: boolean) => `h-5 w-5 shrink-0 transition ${active ? 'text-[#16c75f]' : 'text-white/50 group-hover:text-white/80'}`;

const ActiveMarker = () => <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-[#16c75f]" />;

export default function DashSidebar({ label, sections }: { label: string; sections: DashNavSection[] }) {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
    const activeGroup = sections.flatMap((s) => s.items).find((item) => item.children?.some((child) => isActive(child.href)))?.label ?? '';
    const [openMenu, setOpenMenu] = useState(activeGroup);

    useEffect(() => {
        if (activeGroup) setOpenMenu(activeGroup);
    }, [activeGroup]);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [pathname]);

    return (
        <nav aria-label={label} className="sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] bg-[#0b1b33] transition-all duration-300">
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
                    {sections.map((section, sectionIndex) => (
                        <div key={section.title ?? sectionIndex}>
                            {section.title && <h2 className="px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">{section.title}</h2>}
                            <ul className="space-y-1">
                                {section.items.map((item) => {
                                    if (item.children) {
                                        const groupActive = item.label === activeGroup;
                                        const open = openMenu === item.label;
                                        return (
                                            <li key={item.label}>
                                                <button type="button" aria-expanded={open} className={itemClass(groupActive)} onClick={() => setOpenMenu(open ? '' : item.label)}>
                                                    {groupActive && <ActiveMarker />}
                                                    <item.icon className={iconClass(groupActive)} />
                                                    <span className="flex-1 text-left">{item.label}</span>
                                                    <ChevronDown className={`h-4 w-4 text-white/50 transition-transform ${open ? 'rotate-180' : ''}`} />
                                                </button>

                                                <AnimateHeight duration={300} height={open ? 'auto' : 0}>
                                                    <ul className="ml-[22px] mt-1 space-y-1 border-l border-white/10 pl-3">
                                                        {item.children.map((child) => (
                                                            <li key={child.href}>
                                                                <Link
                                                                    href={child.href}
                                                                    aria-current={isActive(child.href) ? 'page' : undefined}
                                                                    className={`block rounded-lg px-3 py-2 text-sm transition ${isActive(child.href) ? 'font-medium text-[#16c75f]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                                                                >
                                                                    {child.label}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </AnimateHeight>
                                            </li>
                                        );
                                    }

                                    const href = item.href ?? '#';
                                    const active = item.exact ? pathname === href : isActive(item.activeHref ?? href);
                                    return (
                                        <li key={item.label}>
                                            <Link href={href} aria-current={active ? 'page' : undefined} className={itemClass(active)}>
                                                {active && <ActiveMarker />}
                                                <item.icon className={iconClass(active)} />
                                                <span>{item.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </PerfectScrollbar>
        </nav>
    );
}
