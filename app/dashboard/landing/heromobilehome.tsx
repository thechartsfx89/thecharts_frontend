// components/ForexDemoCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HeroMobileHome() {
    return (
        <section className="lg:hidden block">
            <div className="flex justify-center items-center lg:py-12 py-5 lg:px-0 px-2.5">
                <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-lg  md:h-[450px] flex items-center">
                    {/* Background image */}
                    <Image
                        src="/assets/landing/home/mobile-hero.jpg"
                        alt="Forex Learning"
                        fill
                        className="object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50" />

                    {/* Content */}
                    <div className="relative p-10  text-white flex flex-col gap-6 md:pr-28">
                        {/* Title */}
                        <h2 className="text-xl md:text-4xl font-michroma leading-snug">Learn Trading From The Ground Up</h2>

                        {/* Description */}
                        <p className="text-sm text-gray-200 leading-relaxed">
                            Step-By-Step Lessons, Real Market Examples, And Expert Guidance To Turn You From Beginner To Confident Trader — No Prior Experience Needed.
                        </p>

                        {/* Button */}
                        <Link href="/contact">
                        <button className="self-start bg-white text-dark text-sm lg:text-base f px-6 lg:px-8 py-2 lg:py-3 rounded-full shadow-md hover:bg-gray-100 transition">Book a Demo</button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
