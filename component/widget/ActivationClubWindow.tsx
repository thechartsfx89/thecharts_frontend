'use client';
import IconBell from '@/components/icon/icon-bell';
import IconClock from '@/components/icon/icon-clock';
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

const ActivationClubWindow: React.FC<ActivationCountdownProps> = ({ user }) => {
    // const COURSE_PRICE = 26550;
    // const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    // useEffect(() => {
    //     if (!user || user.hasPurchasedCourse) return;

    //     const createdAt = user?.createdAt || user?.user?.createdAt;
    //     if (!createdAt) return;

    //     const accountCreated = new Date(createdAt);
    //     const deadline = new Date(accountCreated);
    //     deadline.setDate(deadline.getDate() + 35);

    //     const timer = setInterval(() => {
    //         const now = new Date().getTime();
    //         const distance = deadline.getTime() - now;

    //         if (isNaN(distance) || distance <= 0) {
    //             clearInterval(timer);
    //             setTimeLeft(null);
    //             return;
    //         }

    //         setTimeLeft({
    //             days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    //             hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    //             minutes: Math.floor((distance / (1000 * 60)) % 60),
    //             seconds: Math.floor((distance / 1000) % 60),
    //         });
    //     }, 1000);

    //     return () => clearInterval(timer);
    // }, [user]);

    // if (!user || user.hasPurchasedCourse || !timeLeft) return null;
const COURSE_PRICE = 26550;
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    useEffect(() => {
        // Condition: If user is missing or already an affiliate/purchased, don't show
        if (!user || user.confirm_affiliate_payment) {
            setTimeLeft(null);
            return;
        }

        // Get creation date safely
        const createdAt = user?.createdAt || user?.user?.createdAt;
        if (!createdAt) return;

        const accountCreated = new Date(createdAt);
        const deadline = new Date(accountCreated);
        deadline.setDate(deadline.getDate() + 35); // 35-day window

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = deadline.getTime() - now;

            if (isNaN(distance) || distance <= 0) {
                clearInterval(timer);
                setTimeLeft(null);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((distance / (1000 * 60)) % 60),
                seconds: Math.floor((distance / 1000) % 60),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [user]);

    // Don't render anything if the conditions aren't met or time is up
    if (!timeLeft) return null;
    return (
        <div className="panel text-center">
            <div className="flex items-center justify-center mb-3">
                <IconClock className="h-8 w-8 text-green-700 mr-2" />
                <h5 className="text-base lg:text-xl font-bold text-dark">
                    Affiliate Activation Countdown
                </h5>
            </div>
            
            
            <div className="mb-4 flex justify-center gap-4">
                {(['days', 'hours', 'minutes', 'seconds'] as const).map((key, i) => (
                    <div key={i} className="bg-success-light rounded-lg p-4 min-w-[80px] shadow-md">
                        <div className="text-xl lg:text-3xl font-bold text-dark">
                            {timeLeft[key]}
                        </div>
                        <span className="text-xs lg:text-sm text-green-700 font-medium">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                    </div>
                ))}
            </div>

            <p className="text-xs lg:text-sm text-green-700 mb-4">
                {/* *NOTE: Please ensure you activate your account by purchasing the ₹{COURSE_PRICE} course
                before the timer expires, otherwise your account will be disabled. */}

                *NOTE: Please activate your affiliate account by purchasing the ₹{COURSE_PRICE} course before the timer expires. Failure to do so will result in account deactivation.
            </p>
            <div className='flex justify-center'>
                <Link href="/courses/course-details/yijrnm2mbfm4rxxm5mumf0gb">
                <button className="text-xs lg:text-sm btn bg-green-600 text-white hover:bg-green-700 font-semibold px-8 py-2 rounded-full shadow-md transition-all duration-300">
                    {/* Purchase Course ₹{COURSE_PRICE} */}
                    Become Affiliate
                </button>
                </Link>
            </div>
            <div className='flex justify-center items-center'>
               <div className="mr-3 rounded-full bg-danger p-1.5 text-white ring-2 ring-danger/30">
          <IconBell />
        </div>
                <p className='my-4 text-danger font-semibold text-xs md:text-base lg:text-base'>Secure Your Affiliate Position Before Time Runs Out.</p>

            </div>
        </div>
    );
};

export default ActivationClubWindow;
