'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import TheChartsLogo from './logo';
import './diwali-offer.css';

// The offer runs to the end of 9 November 2026, India time. After that the popup no longer appears.
const OFFER_ENDS_AT = new Date('2026-11-09T23:59:59+05:30').getTime();

// Sparkle positions are fixed rather than random so they stay put between renders
const scatter = (seed: number) => {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
};

const STAR_COLORS = ['#ffe9a8', '#ffc531', '#ffffff', '#ffb46b'];
const STARS = Array.from({ length: 34 }, (_, i) => ({
    left: `${scatter(i + 1) * 100}%`,
    top: `${scatter(i + 101) * 100}%`,
    size: 7 + ((i * 7) % 14),
    delay: `${(i * 0.37) % 3}s`,
    color: STAR_COLORS[i % STAR_COLORS.length],
}));

const FALLING_SPARKS = Array.from({ length: 40 }, (_, i) => ({
    left: `${(i * 23.6 + 3) % 100}%`,
    size: 2 + (i % 4),
    delay: `${(i * 0.53) % 7}s`,
    duration: `${5 + (i % 5)}s`,
    color: STAR_COLORS[i % STAR_COLORS.length],
}));

const FIREWORKS = [
    { left: '11%', top: '24%', color: '#ffc531', delay: '0s', scale: 1.5 },
    { left: '88%', top: '18%', color: '#ff6fa8', delay: '1.1s', scale: 1.7 },
    { left: '17%', top: '62%', color: '#4ade80', delay: '2.2s', scale: 1.25 },
    { left: '84%', top: '58%', color: '#ffb46b', delay: '0.6s', scale: 1.4 },
    { left: '50%', top: '8%', color: '#ffe9a8', delay: '1.7s', scale: 1.2 },
];

const BULB_COLORS = ['#ffc531', '#ff6b6b', '#4ade80', '#ffe9a8', '#ff9f43'];
const BULBS = Array.from({ length: 45 }, (_, i) => {
    const t = (i + 0.5) / 45;
    return {
        left: `${t * 100}%`,
        top: `${4 + 62 * Math.abs(Math.sin(Math.PI * 3 * t))}px`,
        color: BULB_COLORS[i % BULB_COLORS.length],
        delay: `${(i * 0.23) % 1.8}s`,
        phoneHidden: i % 2 === 1,
    };
});
const WIRE_PATH = `M${Array.from({ length: 121 }, (_, i) => `${(i / 120) * 100} ${2 + 62 * Math.abs(Math.sin((Math.PI * 3 * i) / 120))}`).join(' L')}`;

// Marigold garland along the top of the card: four swags in a 560 wide box
const GARLAND_FLOWERS = Array.from({ length: 4 }).flatMap((_, swag) =>
    Array.from({ length: 11 }, (_, i) => {
        const t = i / 10;
        return { x: swag * 140 + t * 140, y: 5 + 27 * Math.sin(Math.PI * t), color: i % 2 ? '#ffc531' : '#f97316' };
    }),
);
const GARLAND_DROPS = [140, 280, 420];

const ArtDefs = () => (
    <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
            <linearGradient id="tc-dw-flame" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffe36e" />
                <stop offset="55%" stopColor="#ff9f1c" />
                <stop offset="100%" stopColor="#f0480f" />
            </linearGradient>
            <linearGradient id="tc-dw-clay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e8843c" />
                <stop offset="100%" stopColor="#8e2f12" />
            </linearGradient>
            <radialGradient id="tc-dw-halo">
                <stop offset="0%" stopColor="#ffc531" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#ffc531" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="tc-dw-lantern" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffb02e" />
                <stop offset="50%" stopColor="#f0462f" />
                <stop offset="100%" stopColor="#a5123f" />
            </linearGradient>
        </defs>
    </svg>
);

const Diya = ({ className = 'h-14 w-14', delay = '0s' }: { className?: string; delay?: string }) => (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <circle className="tc-dw-halo" cx="32" cy="24" r="24" fill="url(#tc-dw-halo)" style={{ animationDelay: delay }} />
        <g className="tc-dw-flame" style={{ animationDelay: delay }}>
            <path d="M32 7c4 8 9 13 9 20 0 5-4 9-9 9s-9-4-9-9c0-7 5-12 9-20z" fill="url(#tc-dw-flame)" />
            <path d="M32 19c2 4 4 6 4 9.5a4 4 0 0 1-8 0C28 25 30 23 32 19z" fill="#fff6c9" />
        </g>
        <path d="M5 37h54c0 12-12 22-27 22S5 49 5 37z" fill="url(#tc-dw-clay)" />
        <ellipse cx="32" cy="37" rx="27" ry="4" fill="#5e1c08" stroke="#ffc531" strokeWidth="1.2" />
        <path d="M11 45c6 5 13 7 21 7s15-2 21-7" fill="none" stroke="#ffc531" strokeWidth="1.3" strokeDasharray="1.5 3.5" strokeLinecap="round" />
    </svg>
);

const Lantern = ({ className, delay = '0s' }: { className: string; delay?: string }) => (
    <div className={`tc-dw-lantern ${className}`} style={{ animationDelay: delay }} aria-hidden="true">
        <svg viewBox="0 0 60 120" className="h-auto w-full overflow-visible">
            <circle className="tc-dw-halo" cx="30" cy="48" r="36" fill="url(#tc-dw-halo)" style={{ animationDelay: delay }} />
            <line x1="30" y1="0" x2="30" y2="18" stroke="#ffc531" strokeWidth="1.5" />
            <rect x="19" y="16" width="22" height="6" rx="2" fill="#ffc531" />
            <path d="M14 22h32l9 24-9 26H14L5 46z" fill="url(#tc-dw-lantern)" stroke="#ffc531" strokeWidth="1.5" />
            <path d="M23 22 18 46l5 26M37 22l5 24-5 26M5 46h50" fill="none" stroke="#ffe08a" strokeWidth="1" opacity="0.8" />
            <path d="M30 34l9 12-9 13-9-13z" fill="#fff0b8" stroke="#ffc531" strokeWidth="1.2" />
            <rect x="19" y="72" width="22" height="5" rx="2" fill="#ffc531" />
            <path d="M24 77v28M30 77v36M36 77v28" stroke="#ffc531" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="30" cy="114" r="3" fill="#f97316" />
        </svg>
    </div>
);

const Garland = () => (
    <svg viewBox="0 0 560 62" className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-auto w-full" aria-hidden="true">
        {GARLAND_DROPS.map((x) => (
            <g key={x}>
                <path d={`M${x} 6l-13 9 13 3 13-3z`} fill="#22a35a" />
                <circle cx={x} cy="22" r="6" fill="#f97316" />
                <circle cx={x} cy="33" r="5" fill="#ffc531" />
                <circle cx={x} cy="43" r="4" fill="#f97316" />
                <path d={`M${x - 2} 47h4l1.5 8h-7z`} fill="#ffc531" />
            </g>
        ))}
        {GARLAND_FLOWERS.map((f, i) => (
            <g key={i}>
                <circle cx={f.x} cy={f.y} r="8" fill={f.color} />
                <circle cx={f.x} cy={f.y} r="3.5" fill="#c2410c" opacity="0.65" />
            </g>
        ))}
    </svg>
);

const Rangoli = () => (
    <svg viewBox="0 0 300 300" className="tc-dw-rangoli pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px]" aria-hidden="true">
        {Array.from({ length: 16 }, (_, i) => (
            <ellipse key={i} cx="150" cy="44" rx="14" ry="36" fill="none" stroke="#ffc531" strokeWidth="1.5" transform={`rotate(${i * 22.5} 150 150)`} />
        ))}
        {Array.from({ length: 32 }, (_, i) => (
            <circle key={i} cx="150" cy="6" r="2.4" fill="#ffb46b" transform={`rotate(${i * 11.25} 150 150)`} />
        ))}
        <circle cx="150" cy="150" r="72" fill="none" stroke="#ffc531" strokeWidth="1" strokeDasharray="3 6" />
    </svg>
);

const Firework = ({ left, top, color, delay, scale }: (typeof FIREWORKS)[number]) => (
    <span className="tc-dw-firework" style={{ left, top, color, transform: `scale(${scale})` }} aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
            <span key={i} style={{ transform: `rotate(${(360 / 14) * i}deg)` }}>
                <i style={{ animationDelay: delay }} />
            </span>
        ))}
    </span>
);

// Ticks on its own so the artwork around it does not re-render every second
const Countdown = ({ onEnd }: { onEnd: () => void }) => {
    const [left, setLeft] = useState(() => OFFER_ENDS_AT - Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = OFFER_ENDS_AT - Date.now();
            setLeft(remaining);
            if (remaining <= 0) onEnd();
        }, 1000);
        return () => clearInterval(timer);
    }, [onEnd]);

    const seconds = Math.max(0, Math.floor(left / 1000));
    const parts = [
        { label: 'Days', value: Math.floor(seconds / 86400) },
        { label: 'Hours', value: Math.floor(seconds / 3600) % 24 },
        { label: 'Mins', value: Math.floor(seconds / 60) % 60 },
        { label: 'Secs', value: seconds % 60 },
    ];

    return (
        <div className="mx-auto mt-4 grid max-w-[300px] grid-cols-4 gap-2" role="timer" aria-label="Time left in the offer">
            {parts.map((part) => (
                <div key={part.label} className="rounded-xl border border-[#ffc531]/30 bg-white/[0.07] py-1.5">
                    <p className="tc-serif text-xl font-bold leading-tight tabular-nums text-white">{String(part.value).padStart(2, '0')}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#ffe08a]">{part.label}</p>
                </div>
            ))}
        </div>
    );
};

// Diwali sale popup: opens every time the home page loads, until the offer ends
const DiwaliOffer = () => {
    const [open, setOpen] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if (Date.now() >= OFFER_ENDS_AT) return;
        const timer = setTimeout(() => setOpen(true), 900);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!open) return;
        const { overflow, paddingRight } = document.body.style;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        dialogRef.current?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
            if (event.key !== 'Tab' || !dialogRef.current) return;
            const items = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button');
            const first = items[0];
            const last = items[items.length - 1];
            if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = overflow;
            document.body.style.paddingRight = paddingRight;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    if (!open) return null;

    return (
        // Floats with a margin on all sides, below the 72px header and under its z-40, so the header and its menus remain usable
        <div className="tc-dw-overlay fixed bottom-3 left-3 right-3 top-[85px] z-[39] flex items-center justify-center overflow-hidden rounded-3xl px-2 pb-12 pt-2 sm:bottom-8 sm:left-6 sm:right-6 sm:px-4 sm:pb-16 [@media(min-height:860px)]:sm:pb-24" onClick={close}>
            <ArtDefs />

            {/* Festive lights across the whole screen */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <svg viewBox="0 0 100 70" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[70px] w-full">
                    <path d={WIRE_PATH} fill="none" stroke="#ffe08a" strokeOpacity="0.45" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                </svg>
                {BULBS.map((bulb, i) => (
                    <span key={i} className={`tc-dw-bulb ${bulb.phoneHidden ? 'hidden sm:block' : ''}`} style={{ left: bulb.left, top: bulb.top, color: bulb.color, background: bulb.color, animationDelay: bulb.delay }} />
                ))}
                {FALLING_SPARKS.map((spark, i) => (
                    <span key={i} className="tc-dw-spark" style={{ left: spark.left, width: spark.size, height: spark.size, background: spark.color, color: spark.color, animationDelay: spark.delay, animationDuration: spark.duration }} />
                ))}
                {STARS.map((star, i) => (
                    <span key={i} className="tc-dw-star" style={{ left: star.left, top: star.top, width: star.size, height: star.size, background: star.color, animationDelay: star.delay }} />
                ))}
                {FIREWORKS.map((firework, i) => (
                    <Firework key={i} {...firework} />
                ))}
                <Lantern className="absolute left-[7%] top-0 hidden w-20 lg:block" />
                <Lantern className="absolute left-[19%] top-0 hidden w-14 xl:block" delay="0.8s" />
                <Lantern className="absolute right-[7%] top-0 hidden w-20 lg:block" delay="0.4s" />
                <Lantern className="absolute right-[19%] top-0 hidden w-14 xl:block" delay="1.2s" />
                <div className="absolute bottom-6 left-[6%] hidden items-end gap-2 lg:flex">
                    <Diya className="h-14 w-14" />
                    <Diya className="h-20 w-20" delay="0.4s" />
                    <Diya className="h-14 w-14" delay="0.8s" />
                </div>
                <div className="absolute bottom-6 right-[6%] hidden items-end gap-2 lg:flex">
                    <Diya className="h-14 w-14" delay="0.2s" />
                    <Diya className="h-20 w-20" delay="0.6s" />
                    <Diya className="h-14 w-14" delay="1s" />
                </div>
            </div>

            {/* The offer card */}
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tc-dw-title"
                tabIndex={-1}
                className="tc-dw-frame relative w-full max-w-[500px] outline-none"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={close}
                    aria-label="Close Diwali offer"
                    className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full border border-[#ffc531]/60 bg-[#0b1b33]/90 text-[#ffe08a] transition hover:bg-[#ffc531] hover:text-[#0b1b33]"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="tc-dw-card relative px-5 pb-0 pt-14 text-center sm:px-8 sm:pt-16">
                    <Garland />
                    <Lantern className="absolute left-3 top-4 z-[1] w-9 sm:left-5 sm:w-11" delay="0.3s" />
                    <Lantern className="absolute right-3 top-14 z-[1] w-9 sm:right-5 sm:w-11" delay="0.9s" />

                    <div className="relative z-[2]">
                        <div className="flex justify-center">
                            <TheChartsLogo className="h-9" onDark />
                        </div>
                        <p className="tc-serif mt-2 text-lg font-bold text-[#ffe08a] sm:text-xl">Happy Diwali</p>

                        <div className="relative mt-1">
                            <Rangoli />
                            <Firework left="14%" top="30%" color="#ffc531" delay="0.5s" scale={0.8} />
                            <Firework left="86%" top="62%" color="#ff6fa8" delay="1.5s" scale={0.8} />
                            <div className="relative">
                                <p id="tc-dw-title" className="text-xs font-bold uppercase tracking-[0.3em] text-white sm:text-sm">
                                    Diwali Offer
                                </p>
                                <p className="mt-1 text-sm font-semibold text-white/90">Discount up to</p>
                                <p className="tc-dw-gold tc-dw-number tc-serif tc-dw-pop text-[5.5rem] font-black leading-[1.05] sm:text-[7rem]">
                                    50<span className="text-[0.62em]">%</span>
                                    <span className="ml-2 text-[0.34em] tracking-wide">OFF</span>
                                </p>
                                <p className="text-base font-semibold text-white sm:text-lg">on The Charts courses</p>
                            </div>
                        </div>

                        <Countdown onEnd={close} />

                        <Link href="/courses" onClick={close} className="tc-dw-cta mt-5 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold text-[#3a1500]">
                            Grab It Now <ArrowRight className="h-5 w-5" />
                        </Link>
                        <p className="mt-3 text-xs font-medium text-white/80 sm:text-sm">Limited time offer. Ends 9 November.</p>

                        <div className="tc-dw-diyas mt-2 flex items-end justify-center gap-1 sm:gap-3">
                            <Diya className="h-9 w-9 sm:h-11 sm:w-11" />
                            <Diya className="h-11 w-11 sm:h-14 sm:w-14" delay="0.3s" />
                            <Diya className="h-14 w-14 sm:h-[4.5rem] sm:w-[4.5rem]" delay="0.6s" />
                            <Diya className="h-11 w-11 sm:h-14 sm:w-14" delay="0.9s" />
                            <Diya className="h-9 w-9 sm:h-11 sm:w-11" delay="1.2s" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiwaliOffer;
