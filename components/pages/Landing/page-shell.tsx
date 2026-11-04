import { Inter, Merriweather } from 'next/font/google';
import Header from './header';
import Footer from './footer';
import './landing.css';

const serif = Merriweather({ weight: ['700', '900'], subsets: ['latin'], variable: '--font-tc-serif' });
const sans = Inter({ subsets: ['latin'], variable: '--font-tc-sans' });

// Home page fonts, header and footer for every public page
export function TcPage({ children }: { children: React.ReactNode }) {
    return (
        <div className={`tc-root ${serif.variable} ${sans.variable} flex min-h-screen flex-col`}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}

// Pale rising candles behind the page hero, echoing the home hero chart
const CANDLES = [
    { x: 8, y: 150, h: 34, up: true },
    { x: 44, y: 128, h: 42, up: true },
    { x: 80, y: 140, h: 24, up: false },
    { x: 116, y: 104, h: 48, up: true },
    { x: 152, y: 82, h: 50, up: true },
    { x: 188, y: 92, h: 26, up: false },
    { x: 224, y: 52, h: 56, up: true },
    { x: 260, y: 26, h: 54, up: true },
];

function HeroCandles() {
    return (
        <svg viewBox="0 0 290 200" aria-hidden="true" className="pointer-events-none absolute -bottom-2 right-0 hidden w-[340px] opacity-50 lg:block xl:w-[420px]">
            {CANDLES.map((c) => (
                <g key={c.x} fill={c.up ? '#16c75f' : '#ef4444'} opacity={c.up ? 0.55 : 0.4}>
                    <rect x={c.x + 6} y={c.y - 10} width="2" height={c.h + 20} />
                    <rect x={c.x} y={c.y} width="14" height={c.h} rx="2" />
                </g>
            ))}
        </svg>
    );
}

export function HeroPill({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-slate-600 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#16c75f]" />
            {children}
        </span>
    );
}

export function PageHero({ eyebrow, title, sub, children }: { eyebrow?: React.ReactNode; title: React.ReactNode; sub?: React.ReactNode; children?: React.ReactNode }) {
    return (
        <section className="tc-page-hero relative overflow-hidden border-b border-slate-200/60">
            <div className="tc-page-hero-grid absolute inset-0" aria-hidden="true" />
            <HeroCandles />
            <div className="tc-rise relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-24">
                {eyebrow && <HeroPill>{eyebrow}</HeroPill>}
                <h1 className="tc-serif mt-6 text-4xl font-black leading-[1.15] text-[#0b1b33] sm:text-5xl lg:text-6xl">{title}</h1>
                {sub && <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">{sub}</p>}
                {children}
            </div>
        </section>
    );
}
