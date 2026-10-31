// The Charts brand mark: a "C" holding rising green bars, used inside the hero coin
export function TheChartsMark({ className = 'h-9 w-9', dark = false }: { className?: string; dark?: boolean }) {
    return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
            <rect width="48" height="48" rx="12" fill={dark ? '#ffffff' : '#0b1b33'} />
            <path d="M33 14.5A13 13 0 1 0 33 33.5" fill="none" stroke={dark ? '#0b1b33' : '#ffffff'} strokeWidth="5.5" strokeLinecap="round" />
            <rect x="17" y="27" width="4" height="6" rx="1" fill="#16c75f" />
            <rect x="23" y="22" width="4" height="11" rx="1" fill="#16c75f" />
            <rect x="29" y="17" width="4" height="16" rx="1" fill="#16c75f" />
            <path d="M31 10l7-1-1.5 7" fill="none" stroke="#16c75f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// Official logo with a transparent background; onDark swaps to the version with white lettering
export default function TheChartsLogo({ className = 'h-12', onDark = false }: { className?: string; onDark?: boolean }) {
    return <img src={onDark ? '/assets/thecharts/logo-white.png' : '/assets/thecharts/logo.png'} alt="The Charts" width={720} height={200} className={`${className} w-auto object-contain`} />;
}
