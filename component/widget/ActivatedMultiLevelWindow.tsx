// 'use client';
// import IconBell from '@/components/icon/icon-bell';
// import IconClock from '@/components/icon/icon-clock';
// import { useSession } from 'next-auth/react';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';

import IconClock from "@/components/icon/icon-clock";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// interface ActivatedMultiLevelProps {
//     data: any;
// }

// interface TimeLeft {
//     days: number;
//     hours: number;
//     minutes: number;
//     seconds: number;
// }

// const ActivatedMultiLevelWindow: React.FC<ActivatedMultiLevelProps> = ({ data }) => {
//     const [loading, setLoading] = useState(true);
//     const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
//     const [isExpired, setIsExpired] = useState(false);
//     const { data: session } = useSession();

//     const hasAchievedLevel10 = data?.some(
//         (item: any) => item?.isActive === true && item.bonusRule?.directRequired === 5
//     );

//     const APP_URL = process.env.NEXT_PUBLIC_SHARE_URL;

//     const registerUrl = `${APP_URL}/auth/register?refId=${encodeURIComponent(session?.user?.username)}`;


//     useEffect(() => {
//         const createdAt = session?.level_10_commission_window_expiredAt ?? null;
//         if (!createdAt) {
//             setLoading(false);
//             return;
//         }

//         const deadline = new Date(createdAt);


//         const timer = setInterval(() => {
//             const now = new Date().getTime();
//             const distance = deadline.getTime() - now;

//             if (isNaN(distance) || distance <= 0) {
//                 clearInterval(timer);
//                 setTimeLeft(null);
//                 setIsExpired(true);
//                 setLoading(false);
//                 return;
//             }

//             setTimeLeft({
//                 days: Math.floor(distance / (1000 * 60 * 60 * 24)),
//                 hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
//                 minutes: Math.floor((distance / (1000 * 60)) % 60),
//                 seconds: Math.floor((distance / 1000) % 60),
//             });
//             setLoading(false);
//         }, 1000);

//         return () => clearInterval(timer);
//     }, [data, session]);

//     if (loading) {
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

//     if (hasAchievedLevel10) {
//         return (
//             <div className="panel text-center border-t-4 border-success bg-green-50/50">
//                 <div className="py-6">
//                     <div className="bg-success text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
//                         <span className="text-3xl">🏆</span>
//                     </div>
//                     <h5 className="text-2xl font-bold text-green-800">Milestone Accomplished!</h5>
//                     <p className="text-lg text-green-700 mt-2">
//                         Thank you! You have successfully registered 5+ direct members.
//                     </p>
//                     <div className="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-full font-bold">
//                         ✓ Level 10 Unlocked
//                     </div>
//                 </div>
//             </div>
//         );
//     }
   

//     // --- RENDER EXPIRED STATE ---
//     if (isExpired) {
//         return (
//             <div className="panel text-center border-t-4 border-danger">
//                 <div className="mb-4">
//                     <h5 className="text-lg lg:text-2xl font-bold text-danger uppercase tracking-tight">
//                         🚫 Level 6th to 10th Commission Window Closed
//                     </h5>
//                     <p className="text-sm text-gray-600 mt-2 font-medium">
//                         The 35-day window to maximize your multi-level: 6th to 10th earnings has ended.
//                     </p>
//                 </div>



//                 <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4 max-w-2xl mx-auto text-left">
//                     <h6 className="font-bold text-danger mb-3 flex items-center">
//                         🚫 Level 6th to 10th Income Eligibility Expired
//                     </h6>

//                     <ul className="text-xs lg:text-sm text-gray-700 space-y-3 ">
//                         <li className="flex items-start">
//                             <span className="mr-2">❌</span>
//                             <span><strong>Target Missed:</strong> You did not register 5 active direct members within the 35-day window.</span>
//                         </li>
//                         <li className="flex items-start">
//                             <span className="mr-2">❌</span>
//                             <span><strong>Access Blocked:</strong> Your eligibility for Indirect from 6th to 10th Level commission has now expired.</span>
//                         </li>

//                     </ul>


//                 </div>

//                 <div className="flex flex-col items-center gap-4">
//                     <p className="text-gray-700 text-xs lg:text-sm  mt-3">
//                         If you missed this deadline due to some issues,
//                         you may request a one-time manual review.
//                     </p>
//                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                         Need Assistance?
//                     </p>
//                     <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
//                         <button className="btn btn-outline-danger font-semibold px-10 py-2.5 rounded-full shadow-sm flex items-center gap-2 hover:bg-danger hover:text-white transition-all">
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

//     // --- RENDER ACTIVE COUNTDOWN STATE ---
//     if (!timeLeft) return null;

//     return (
//         <div className="panel text-center">
//             <div className="mb-4">
//                 <h5 className="text-lg lg:text-2xl font-bold text-green-700">
//                     🎉 Congratulations! You’re Eligible to Earn till 5th Level
//                 </h5>
//                 <p className="text-sm text-green-600 mt-1">
//                     You Successfully Registered 3 Direct Affiliates — Your Multi-level earning starts now.
//                 </p>
//             </div>

//             <div className="flex items-center justify-center mb-3">
//                 <IconClock className="h-8 w-8 text-green-700 mr-2" />
//                 <h5 className="text-sm lg:text-lg font-bold text-dark">
//                     ⏳ Hurry! Register 5 Direct Affiliates Before Time Runs Out
//                 </h5>
//             </div>

//             <div className="mb-4 flex justify-center gap-4 flex-wrap">
//                 {(['days', 'hours', 'minutes', 'seconds'] as const).map((key, i) => (
//                     <div key={i} className="bg-success-light rounded-lg p-4 min-w-[80px] shadow-md">
//                         <div className="text-base lg:text-3xl font-bold text-dark">
//                             {timeLeft[key]}
//                         </div>
//                         <span className="text-[10px] lg:text-sm text-green-700 font-medium">
//                             {key.charAt(0).toUpperCase() + key.slice(1)}
//                         </span>
//                     </div>
//                 ))}
//             </div>

//             <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-left max-w-2xl mx-auto text-center">
//                 <h6 className="font-bold text-green-800 mb-2">🚀 Unlock Till 10th Level Income Potential</h6>
//                 <ul className="text-xs lg:text-sm text-green-700 space-y-1">
//                     {/* <li>🔹 Register <strong>3 Direct Active Users</strong> → Earn up to <strong>5 Levels</strong></li> */}
//                     <li>🔹 Register <strong>5 Direct Active Users</strong> → Earn up to <strong>10 Levels</strong></li>
//                 </ul>
//             </div>

//             <p className="text-xs lg:text-sm mb-4">
//                 Limited Time of Activation Window — Secure 5 Direct Users Today
//             </p>

//             <div className="flex justify-center">
//                 {/* <Link href={registerUrl}> */}
//                 <button
//                     onClick={async () => {
//                         if (navigator.share) {
//                             try {
//                                 await navigator.share({
//                                     title: "Join using my referral link",
//                                     text: "Register using my referral link:",
//                                     url: registerUrl,
//                                 });
//                             } catch (err) {
//                                 console.log("Share cancelled");
//                             }
//                         } else {
//                             navigator.clipboard.writeText(registerUrl);
//                             alert("Referral link copied to clipboard!");
//                         }
//                     }}
//                     className="text-xs lg:text-sm btn bg-green-600 text-white hover:bg-green-700 font-semibold px-8 py-2 rounded-full shadow-md transition-all duration-300">
//                     Share Referral Link
//                 </button>
//                 {/* </Link> */}
//             </div>
//         </div>
//     );
// };

// export default ActivatedMultiLevelWindow;


// // 'use client';
// // import IconClock from '@/components/icon/icon-clock';
// // import { useSession } from 'next-auth/react';
// // import React, { useEffect, useState } from 'react';

// // interface ActivatedMultiLevelProps {
// //     data: any[]; // Array of bonus rules from your JSON
// // }

// // const ActivatedMultiLevelWindow: React.FC<ActivatedMultiLevelProps> = ({ data }) => {
// //     const { data: session } = useSession();
// //     const [timeLeft, setTimeLeft] = useState<any>(null);
// //     const [isExpired, setIsExpired] = useState(false);
// //     const [loading, setLoading] = useState(true);

// //     // 1. Validation: Check if the user already achieved the 5-direct goal
// //     const hasAchievedLevel10 = data?.some(
// //         (item) => item.isActive === true && item.bonusRule?.directRequired === 5
// //     );

// //     const registerUrl = `${process.env.NEXT_PUBLIC_SHARE_URL}/auth/register?refId=${encodeURIComponent(session?.user?.username || '')}`;

// //     useEffect(() => {
// //         // If already achieved Level 10, no need for a timer
// //         if (hasAchievedLevel10) {
// //             setLoading(false);
// //             return;
// //         }

// //         const expiryDate = session?.level_10_commission_window_expiredAt;
// //         if (!expiryDate) {
// //             setLoading(false);
// //             return;
// //         }

// //         const deadline = new Date(expiryDate).getTime();

// //         const timer = setInterval(() => {
// //             const now = new Date().getTime();
// //             const distance = deadline - now;

// //             if (distance <= 0) {
// //                 clearInterval(timer);
// //                 setIsExpired(true);
// //                 setTimeLeft(null);
// //             } else {
// //                 setTimeLeft({
// //                     days: Math.floor(distance / (1000 * 60 * 60 * 24)),
// //                     hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
// //                     minutes: Math.floor((distance / (1000 * 60)) % 60),
// //                     seconds: Math.floor((distance / 1000) % 60),
// //                 });
// //             }
// //             setLoading(false);
// //         }, 1000);

// //         return () => clearInterval(timer);
// //     }, [hasAchievedLevel10, session]);

// //     if (loading) return null;

// //     // --- CASE A: SUCCESS (5 Directs Achieved) ---
// //     if (hasAchievedLevel10) {
// //         return (
// //             <div className="panel text-center border-t-4 border-success bg-green-50/50">
// //                 <div className="py-6">
// //                     <div className="bg-success text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
// //                         <span className="text-3xl">🏆</span>
// //                     </div>
// //                     <h5 className="text-2xl font-bold text-green-800">Mission Accomplished!</h5>
// //                     <p className="text-lg text-green-700 mt-2">
// //                         Thank you! You have successfully registered 5+ direct members.
// //                     </p>
// //                     <div className="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-full font-bold">
// //                         10 Levels of Commission Unlocked
// //                     </div>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     // --- CASE B: EXPIRED ---
// //     if (isExpired) {
// //         return (
// //             <div className="panel text-center border-t-4 border-danger">
// //                 <h5 className="text-xl font-bold text-danger">🚫 Level 10 Window Closed</h5>
// //                 <p className="text-gray-600 mt-2">The 35-day window for 5 directs has ended.</p>
// //                 <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`} className="btn btn-outline-danger mt-4 rounded-full">
// //                     Contact Support
// //                 </a>
// //             </div>
// //         );
// //     }

// //     // --- CASE C: COUNTDOWN (3 achieved, chasing 5) ---
// //     return (
// //         <div className="panel text-center">
// //             <div className="mb-4">
// //                 <h5 className="text-lg lg:text-2xl font-bold text-green-700">🎉 Level 5 Unlocked!</h5>
// //                 <p className="text-sm text-green-600">Great job on 3 directs. Now, let's hit 5!</p>
// //             </div>

// //             {timeLeft && (
// //                 <div className="flex justify-center gap-2 mb-6">
// //                     {Object.entries(timeLeft).map(([unit, value]: any) => (
// //                         <div key={unit} className="bg-success-light p-3 rounded-lg min-w-[70px]">
// //                             <div className="text-xl font-bold">{value}</div>
// //                             <div className="text-[10px] uppercase">{unit}</div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             )}

// //             <button
// //                 onClick={() => {
// //                     navigator.clipboard.writeText(registerUrl);
// //                     alert("Referral link copied!");
// //                 }}
// //                 className="btn bg-green-600 text-white rounded-full px-10"
// //             >
// //                 Share Link to Reach 5 Directs
// //             </button>
// //         </div>
// //     );
// // };

// // export default ActivatedMultiLevelWindow;
interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

export const ActivatedMultiLevelWindow: React.FC<{ data: any }> = ({ data }) => {
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [isExpired, setIsExpired] = useState(false);
    const { data: session } = useSession();

    const hasAchievedLevel10 = data?.some((item: any) => item?.isActive === true && item.bonusRule?.directRequired === 5);
    const registerUrl = `${process.env.NEXT_PUBLIC_SHARE_URL}/auth/register?refId=${encodeURIComponent(session?.user?.username || '')}`;

    useEffect(() => {
        if (hasAchievedLevel10) { setLoading(false); return; }
        const expiry = session?.level_10_commission_window_expiredAt;
        if (!expiry) { setLoading(false); return; }
        const deadline = new Date(expiry).getTime();
        const timer = setInterval(() => {
            const distance = deadline - new Date().getTime();
            if (distance <= 0) {
                clearInterval(timer);
                setIsExpired(true);
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((distance / (1000 * 60)) % 60),
                    seconds: Math.floor((distance / 1000) % 60),
                });
            }
            setLoading(false);
        }, 1000);
        return () => clearInterval(timer);
    }, [data, session, hasAchievedLevel10]);

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

    if (hasAchievedLevel10) {
        return (
            <div className="panel text-center border-t-4 border-success bg-green-50/50">
                <div className="py-6">
                    <div className="bg-success text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-3xl">🏆</span>
                    </div>
                    <h5 className="text-xl lg:text-2xl font-bold text-green-800">Milestone Accomplished!</h5>
                    <p className="text-base lg:text-lg text-green-700 mt-2">Thank you! You have successfully registered 5+ direct members.</p>
                    <div className="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-full font-bold">✓ Level 10 Unlocked</div>
                </div>
            </div>
        );
    }

    if (isExpired) {
        return (
            <div className="panel text-center border-t-4 border-danger">
                <h5 className="text-lg lg:text-2xl font-bold text-danger uppercase tracking-tight">🚫 Level 6th to 10th Window Closed</h5>
                <p className="text-sm text-gray-600 mt-2 font-medium">The window to maximize your 6th to 10th earnings has ended.</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4 text-left max-w-2xl mx-auto">
                    <h6 className="font-bold text-danger mb-3 flex items-center">🚫 Income Eligibility Expired</h6>
                    <ul className="text-xs lg:text-sm text-gray-700 space-y-3 ">
                        <li>❌ <strong>Target Missed:</strong> You did not register 5 active members.</li>
                        <li>❌ <strong>Access Blocked:</strong> Eligibility for 6th-10th Level has expired.</li>
                    </ul>
                </div>
                <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                    <button className="btn btn-outline-danger font-semibold px-10 py-2.5 rounded-full">Contact Support</button>
                </a>
            </div>
        );
    }

    return timeLeft ? (
        <div className="panel text-center">
            <h5 className="text-lg lg:text-2xl font-bold text-green-700">🎉 Eligible to Earn till 5th Level</h5>
            <div className="flex items-center justify-center my-3">
                <IconClock className="h-8 w-8 text-green-700 mr-2" />
                <h5 className="text-sm lg:text-lg font-bold">⏳ Register 5 Direct Affiliates Before Time Runs Out</h5>
            </div>
            <div className="mb-4 flex justify-center gap-4 flex-wrap">
                {Object.entries(timeLeft).map(([key, val]) => (
                    <div key={key} className="bg-success-light rounded-lg p-4 min-w-[80px] shadow-md">
                        <div className="text-base lg:text-3xl font-bold text-dark">{val}</div>
                        <span className="text-[10px] lg:text-sm text-green-700 font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    </div>
                ))}
            </div>
            <button onClick={() => navigator.share ? navigator.share({url: registerUrl}) : navigator.clipboard.writeText(registerUrl)} 
                className="btn bg-green-600 text-white font-semibold px-8 py-2 rounded-full shadow-md transition-all">
                Share Referral Link
            </button>
        </div>
    ) : null;
};