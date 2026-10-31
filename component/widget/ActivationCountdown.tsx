// 'use client';
// import IconBell from '@/components/icon/icon-bell';
// import IconClock from '@/components/icon/icon-clock';
// import { useSession } from 'next-auth/react';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';

// interface ActivationCountdownProps {
//     user: any;
// }

// interface TimeLeft {
//     days: number;
//     hours: number;
//     minutes: number;
//     seconds: number;
// }

// const ActivationCountdown: React.FC<ActivationCountdownProps> = () => {
//     const { data: session } = useSession();
//     const COURSE_PRICE = 26550;
//     const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
//     const [isExpired, setIsExpired] = useState(false);

//     useEffect(() => {
//         // If user already confirmed payment, hide everything
//         if (session?.confirm_affiliate_payment) {
//             setTimeLeft(null);
//             setIsExpired(false);
//             return;
//         }

//         const expiredAt = session?.affiliate_expiredAt ?? null;
//         if (!expiredAt) return;

//         const deadline = new Date(expiredAt);

//         const timer = setInterval(() => {
//             const now = new Date().getTime();
//             const distance = deadline.getTime() - now;

//             if (isNaN(distance) || distance <= 0) {
//                 clearInterval(timer);
//                 setTimeLeft(null);
//                 setIsExpired(true); // Trigger expired UI
//                 return;
//             }

//             setIsExpired(false);
//             setTimeLeft({
//                 days: Math.floor(distance / (1000 * 60 * 60 * 24)),
//                 hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
//                 minutes: Math.floor((distance / (1000 * 60)) % 60),
//                 seconds: Math.floor((distance / 1000) % 60),
//             });
//         }, 1000);

//         return () => clearInterval(timer);
//     }, [session]);

//     // --- 1. EXPIRED STATE UI ---
//     if (session) {
//         return (
//             <div className="panel animate-pulse border-t-4 border-gray-200 bg-gray-50/50">
//                 <div className="py-6 flex flex-col items-center">
//                     {/* Circle Pulse */}
//                     <div className="bg-gray-200 w-16 h-16 rounded-full mb-4"></div>
//                     {/* Title Pulse */}
//                     <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
//                     {/* Subtitle Pulse */}
//                     <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
//                     {/* Button Pulse */}
//                     <div className="h-10 bg-gray-200 rounded-full w-40"></div>
//                 </div>
//             </div>
//         );
//     }
//     if (isExpired) {
//         return (
//             <div className="panel text-center border-t-4 border-danger animate__animated animate__fadeIn">
//                 <div className="mb-4">
//                     <h5 className="text-lg lg:text-2xl font-bold text-danger uppercase tracking-tight">
//                         🚫 Affiliate Activation Expired
//                     </h5>
//                     <p className="text-sm text-gray-600 mt-2 font-medium">
//                         Your 35-day priority window to unlock affiliate earnings has closed.
//                     </p>
//                 </div>

//                 <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 max-w-2xl mx-auto text-left">
//                     <ul className="text-xs lg:text-sm text-gray-700 space-y-3">
//                         <li className="flex items-start">
//                             <span className="mr-2">❌</span>
//                             <span>
//                                 <strong>Affiliate Not Activated:</strong> You have not activated your affiliate account yet.
//                             </span>
//                         </li>
//                         <li className="flex items-start">
//                             <span className="mr-2">❌</span>
//                             <span>
//                                 To become an affiliate and start earning commissions, please enroll in the affiliate course.
//                             </span>
//                         </li>
//                         {/* <li className="flex items-start">
//             <span className="mr-2">ℹ️</span>
//             <span>
//                 Once enrolled, you can begin referring members and unlock multi-level income opportunities.
//             </span>
//         </li> */}
//                     </ul>
//                 </div>
//                 <p className="text-xs lg:text-sm mb-4">
//                     Once enrolled, you can begin referring members and unlock multi-level income opportunities.

//                 </p>

//                 <div className="flex flex-col items-center gap-3">
//                     <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
//                         <button className="btn btn-outline-danger text-xs lg:text-sm font-semibold px-10 py-2.5 rounded-full shadow-sm flex items-center gap-2 hover:bg-danger hover:text-white transition-all">
//                             <span>Contact Our Support Team</span>
//                         </button>
//                     </a>
//                     <p className="text-xs text-gray-700 italic">
//                         *Manual extensions are subject to administrative approval.
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     // --- 2. ACTIVE COUNTDOWN UI ---
//     if (!timeLeft) return null;

//     return (
//         <div className="panel text-center animate__animated animate__fadeIn">
//             <div className="flex items-center justify-center mb-3">
//                 <IconClock className="h-8 w-8 text-green-700 mr-2" />
//                 <h5 className="text-base lg:text-xl font-bold text-dark">
//                     Affiliate Activation Countdown
//                 </h5>
//             </div>

//             <div className="mb-4 flex justify-center gap-4 flex-wrap">
//                 {(['days', 'hours', 'minutes', 'seconds'] as const).map((key, i) => (
//                     <div key={i} className="bg-success-light rounded-lg p-4 min-w-[80px] shadow-md">
//                         <div className="text-xl lg:text-3xl font-bold text-dark">
//                             {timeLeft[key]}
//                         </div>
//                         <span className="text-xs lg:text-sm text-green-700 font-medium">
//                             {key.charAt(0).toUpperCase() + key.slice(1)}
//                         </span>
//                     </div>
//                 ))}
//             </div>

//             <p className="text-xs lg:text-sm text-green-700 mb-2 font-medium">
//                 *NOTE: Please activate your affiliate account by purchasing the ₹{COURSE_PRICE.toLocaleString()} course.
//             </p>
//             <p className="text-xs lg:text-sm text-dark mb-4">
//                 Unlock up to 10 levels of income potential before the timer expires.
//             </p>

//             <div className='flex justify-center'>
//                 <Link href="/courses/course-details/yijrnm2mbfm4rxxm5mumf0gb">
//                     <button className="text-xs lg:text-sm btn bg-green-600 text-white hover:bg-green-700 font-bold px-10 py-2.5 rounded-full shadow-md transition-all">
//                         Become Affiliate
//                     </button>
//                 </Link>
//             </div>

//             <div className='flex justify-center items-center mt-4'>
//                 <div className="mr-3 rounded-full bg-danger p-1.5 text-white ring-2 ring-danger/30 animate-pulse">
//                     <IconBell />
//                 </div>
//                 <p className='text-danger font-bold text-xs md:text-base'>
//                     Secure Your Position Before Your Window Closes.
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default ActivationCountdown;

'use client';
import IconBell from '@/components/icon/icon-bell';
import IconClock from '@/components/icon/icon-clock';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface ActivationCountdownProps {
    user: any;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const ActivationCountdown: React.FC<ActivationCountdownProps> = () => {
    const { data: session } = useSession();
    const COURSE_PRICE = 26550;
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [isExpired, setIsExpired] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.confirm_affiliate_payment) {
            setLoading(false);
            return;
        }

        const expiredAt = session?.affiliate_expiredAt ?? null;
        if (!expiredAt) {
            setLoading(false);
            return;
        }

        const deadline = new Date(expiredAt).getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = deadline - now;

            if (isNaN(distance) || distance <= 0) {
                clearInterval(timer);
                setTimeLeft(null);
                setIsExpired(true);
                setLoading(false);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((distance / (1000 * 60)) % 60),
                seconds: Math.floor((distance / 1000) % 60),
            });
            setIsExpired(false);
            setLoading(false);
        }, 1000);

        return () => clearInterval(timer);
    }, [session]);

    if (loading) {
        return (
            <div className="panel animate-pulse border-t-4 border-gray-200 bg-gray-50/50">
                <div className="py-6 flex flex-col items-center">
                    <div className="bg-gray-200 w-16 h-16 rounded-full mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded-full w-40"></div>
                </div>
            </div>
        );
    }

    if (isExpired) {
        return (
            <div className="panel text-center border-t-4 border-danger animate__animated animate__fadeIn">
                <div className="mb-4">
                    <h5 className="text-lg lg:text-2xl font-bold text-danger uppercase tracking-tight">
                        🚫 Affiliate Activation Expired
                    </h5>
                    <p className="text-sm text-gray-600 mt-2 font-medium">
                        Your 35-day priority window to unlock affiliate earnings has closed.
                    </p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 max-w-2xl mx-auto text-left">
                    <ul className="text-xs lg:text-sm text-gray-700 space-y-3">
                        <li className="flex items-start">
                            <span className="mr-2">❌</span>
                            <span><strong>Affiliate Not Activated:</strong> You have not activated your affiliate account yet.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">❌</span>
                            <span>To become an affiliate and start earning commissions, please enroll in the affiliate course.</span>
                        </li>
                    </ul>
                </div>
                <p className="text-xs lg:text-sm mb-4">
                    Once enrolled, you can begin referring members and unlock multi-level income opportunities.
                </p>
                <div className="flex flex-col items-center gap-3">
                    <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                        <button className="btn btn-outline-danger text-xs lg:text-sm font-semibold px-10 py-2.5 rounded-full shadow-sm flex items-center gap-2 hover:bg-danger hover:text-white transition-all">
                            <span>Contact Our Support Team</span>
                        </button>
                    </a>
                    <p className="text-xs text-gray-700 italic">*Manual extensions are subject to administrative approval.</p>
                </div>
            </div>
        );
    }

    if (!timeLeft) return null;

    return (
        <div className="panel text-center animate__animated animate__fadeIn">
            <div className="flex items-center justify-center mb-3">
                <IconClock className="h-8 w-8 text-green-700 mr-2" />
                <h5 className="text-base lg:text-xl font-bold text-dark">Affiliate Activation Countdown</h5>
            </div>
            <div className="mb-4 flex justify-center gap-4 flex-wrap">
                {(['days', 'hours', 'minutes', 'seconds'] as const).map((key, i) => (
                    <div key={i} className="bg-success-light rounded-lg p-4 min-w-[80px] shadow-md">
                        <div className="text-xl lg:text-3xl font-bold text-dark">{timeLeft[key]}</div>
                        <span className="text-xs lg:text-sm text-green-700 font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    </div>
                ))}
            </div>
            <p className="text-xs lg:text-sm text-green-700 mb-2 font-medium">
                *NOTE: Please activate your affiliate account by purchasing the ₹{COURSE_PRICE.toLocaleString()} course.
            </p>
            <p className="text-xs lg:text-sm text-dark mb-4">Unlock up to 10 levels of income potential before the timer expires.</p>
            <div className='flex justify-center'>
                <Link href="/courses/course-details/yijrnm2mbfm4rxxm5mumf0gb">
                    <button className="text-xs lg:text-sm btn bg-green-600 text-white hover:bg-green-700 font-bold px-10 py-2.5 rounded-full shadow-md transition-all">Become Affiliate</button>
                </Link>
            </div>
            <div className='flex justify-center items-center mt-4'>
                <div className="mr-3 rounded-full bg-danger p-1.5 text-white ring-2 ring-danger/30 animate-pulse"><IconBell /></div>
                <p className='text-danger font-bold text-xs md:text-base'>Secure Your Position Before Your Window Closes.</p>
            </div>
        </div>
    );
};

export default ActivationCountdown;
