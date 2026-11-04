import Link from 'next/link';
import { ChevronRight, LucideIcon } from 'lucide-react';

type Crumb = { label: string; href: string };

// Page title row shared by the student and affiliate panels
export function DashPageHeader({
    title,
    sub,
    icon: Icon,
    parents = [],
    crumbs = true,
    home = '/dash/student',
    action,
}: {
    title: React.ReactNode;
    sub?: React.ReactNode;
    icon?: LucideIcon;
    parents?: Crumb[];
    crumbs?: boolean;
    home?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
                {Icon && (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0b1b33] text-[#16c75f]">
                        <Icon className="h-6 w-6" />
                    </span>
                )}
                <div className="min-w-0">
                    {crumbs && (
                        <nav aria-label="Breadcrumb" className="mb-1 flex flex-wrap items-center gap-1 text-xs font-medium text-slate-500">
                            <Link href={home} className="transition hover:text-[#0e9f4a]">
                                Dashboard
                            </Link>
                            {parents.map((p) => (
                                <span key={p.href} className="flex items-center gap-1">
                                    <ChevronRight className="h-3 w-3" />
                                    <Link href={p.href} className="transition hover:text-[#0e9f4a]">
                                        {p.label}
                                    </Link>
                                </span>
                            ))}
                        </nav>
                    )}
                    <h1 className="tc-serif text-2xl font-black leading-tight text-[#0b1b33]">{title}</h1>
                    {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
                </div>
            </div>
            {action}
        </div>
    );
}

export function DashCard({ title, icon: Icon, action, children, className = '' }: { title?: React.ReactNode; icon?: LucideIcon; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
    return (
        <section className={`overflow-hidden rounded-2xl border border-slate-200 bg-white ${className}`}>
            {title && (
                <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                    {Icon && (
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e9f8ef] text-[#0e9f4a]">
                            <Icon className="h-5 w-5" />
                        </span>
                    )}
                    <h2 className="font-bold text-[#0b1b33]">{title}</h2>
                    {action}
                </header>
            )}
            {children}
        </section>
    );
}

export function DashEmpty({ icon: Icon, title, sub }: { icon: LucideIcon; title: string; sub?: string }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Icon className="h-7 w-7" />
            </span>
            <p className="mt-4 font-semibold text-[#0b1b33]">{title}</p>
            {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
        </div>
    );
}
