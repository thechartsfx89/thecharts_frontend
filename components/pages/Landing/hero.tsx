import Link from 'next/link';
import { ArrowRight, Bitcoin, CandlestickChart, Euro, IndianRupee } from 'lucide-react';
import { GiBull } from 'react-icons/gi';
import { TheChartsMark } from './logo';

// Rising candle series drawn behind the coins (x, open, close, high, low in a 1000x440 box)
const CANDLES: [number, number, number, number, number][] = [
    [80, 380, 360, 350, 392],
    [130, 362, 340, 328, 372],
    [180, 342, 352, 334, 364],
    [230, 350, 318, 306, 358],
    [280, 320, 300, 288, 330],
    [330, 302, 314, 294, 324],
    [680, 210, 186, 174, 220],
    [730, 188, 196, 178, 206],
    [780, 196, 160, 148, 204],
    [830, 162, 140, 128, 170],
    [880, 142, 112, 98, 150],
    [930, 114, 90, 76, 122],
];

type Coin = { left: string; top: string; width: string; delay: string; variant?: 'ink' | 'gold'; icon: React.ReactNode; label: string };

const COINS: Coin[] = [
    { left: '9%', top: '44%', width: '15%', delay: '0s', icon: <CandlestickChart className="h-[46%] w-[46%] text-[#0e9f4a]" strokeWidth={2.2} />, label: 'Charts' },
    { left: '25%', top: '74%', width: '8%', delay: '1.2s', icon: <GiBull className="h-[52%] w-[52%] text-[#0b1b33]" />, label: 'Bull market' },
    { left: '59%', top: '12%', width: '9%', delay: '0.6s', icon: <Euro className="h-[46%] w-[46%] text-[#0e9f4a]" strokeWidth={2.4} />, label: 'Forex' },
    { left: '72%', top: '-6%', width: '15%', delay: '1.8s', variant: 'gold', icon: <Bitcoin className="h-[50%] w-[50%] text-white" strokeWidth={2.4} />, label: 'Crypto' },
    { left: '79%', top: '58%', width: '12%', delay: '0.9s', icon: <IndianRupee className="h-[44%] w-[44%] text-[#0e9f4a]" strokeWidth={2.4} />, label: 'Equity' },
];

export default function Hero() {
    return (
        <section className="tc-hero-bg relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 pt-14 text-center sm:px-6 sm:pt-20 lg:px-8">
                <span className="tc-rise inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16c75f]" />
                    Forex, Stock &amp; Crypto Trading Education
                </span>

                <h1 className="tc-serif tc-rise mx-auto mt-6 max-w-4xl text-4xl font-black leading-[1.1] tracking-tight text-[#0b1b33] sm:text-5xl lg:text-[64px]" style={{ animationDelay: '0.1s' }}>
                    Learn the Markets.
                    <br />
                    Read <span className="text-[#16c75f]">The Charts.</span>
                </h1>

                <p className="tc-rise mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg" style={{ animationDelay: '0.2s' }}>
                    Step-by-step lessons, live chart analysis and mentor guidance that take you from complete beginner to confident trader. No prior experience needed.
                </p>

                <div className="tc-rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: '0.3s' }}>
                    <Link
                        href="/courses"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b1b33] px-7 py-3.5 font-semibold text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-[#13284a] sm:w-auto"
                    >
                        Explore Courses <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a href="#demo" className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white/80 px-7 py-3.5 font-semibold text-[#0b1b33] transition hover:border-[#0b1b33] sm:w-auto">
                        Book a Free Demo
                    </a>
                    <a href="#how-it-works" className="px-4 py-3 font-medium text-slate-600 underline-offset-4 hover:text-[#0b1b33] hover:underline">
                        How It Works
                    </a>
                </div>
            </div>

            {/* Illustration: positions are percentages so the scene scales down on phones */}
            <div className="relative mx-auto mt-10 aspect-[16/9] w-full max-w-6xl sm:mt-4 sm:aspect-[16/7]" aria-hidden="true">
                <svg viewBox="0 0 1000 440" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                    <defs>
                        <linearGradient id="tc-wave" x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0%" stopColor="#16c75f" stopOpacity="0" />
                            <stop offset="45%" stopColor="#16c75f" stopOpacity="0.55" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                        </linearGradient>
                        <linearGradient id="tc-arrow" x1="0" x2="1" y1="1" y2="0">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#16c75f" />
                        </linearGradient>
                    </defs>

                    {CANDLES.map(([x, open, close, high, low]) => {
                        const up = close < open;
                        return (
                            <g key={x} opacity="0.35">
                                <line x1={x} x2={x} y1={high} y2={low} stroke={up ? '#16c75f' : '#ef4444'} strokeWidth="2" />
                                <rect x={x - 8} y={Math.min(open, close)} width="16" height={Math.max(Math.abs(open - close), 3)} rx="2" fill={up ? '#16c75f' : '#ef4444'} />
                            </g>
                        );
                    })}

                    {[0, 18, 36, 54, 72].map((o) => (
                        <path key={o} d={`M-20 ${440 - o / 2} C 250 ${420 - o}, 520 ${330 - o}, 1020 ${80 + o}`} fill="none" stroke="url(#tc-wave)" strokeWidth="1.5" />
                    ))}

                    <path className="tc-draw" d="M40 420 C 320 400, 640 300, 940 70" fill="none" stroke="url(#tc-arrow)" strokeWidth="6" strokeLinecap="round" />
                    <path d="M905 62 L952 58 L938 104" fill="none" stroke="#16c75f" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

                    <g stroke="#0b1b33" strokeOpacity="0.15" strokeWidth="1.5" fill="none">
                        <path d="M240 290 L420 250" />
                        <path d="M580 210 L640 120" />
                        <path d="M600 260 L820 330" />
                    </g>
                    {[
                        [240, 290],
                        [420, 250],
                        [640, 120],
                        [820, 330],
                    ].map(([cx, cy]) => (
                        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="#16c75f" />
                    ))}
                </svg>

                {/* Centre coin with the brand mark */}
                <div className="absolute left-1/2 top-[30%] aspect-square w-[24%] -translate-x-1/2">
                    <span className="tc-halo inset-[-14%]" />
                    <span className="tc-halo inset-[-14%]" style={{ animationDelay: '2s' }} />
                    <div className="tc-float relative h-full w-full">
                        <div className="tc-coin tc-coin--ink inset-0">
                            <TheChartsMark className="h-[48%] w-[48%] drop-shadow-xl" dark />
                        </div>
                    </div>
                </div>

                {COINS.map((coin) => (
                    <div key={coin.label} className="absolute aspect-square" style={{ left: coin.left, top: coin.top, width: coin.width }}>
                        <div className="tc-float relative h-full w-full" style={{ animationDelay: coin.delay }}>
                            <div className={`tc-coin inset-0 ${coin.variant ? `tc-coin--${coin.variant}` : ''}`}>{coin.icon}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
