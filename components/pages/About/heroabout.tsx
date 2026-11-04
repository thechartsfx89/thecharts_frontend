import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const HeroAbout = () => {
    return (
        <section className="tc-page-hero relative overflow-hidden border-b border-slate-200/60">
            <div className="tc-page-hero-grid absolute inset-0" aria-hidden="true" />
            <div className="relative mx-auto flex max-w-7xl items-center justify-center px-4 py-16 sm:px-6 sm:py-20 lg:h-[680px] lg:px-8 lg:py-0">
                {/* Photo collage, leaves the centre open for the text */}
                <Image src="/assets/landing/about/1.png" alt="" fill sizes="(min-width: 1280px) 1280px, 100vw" className="hidden object-contain lg:block" priority />

                <div className="tc-rise relative max-w-xl text-center lg:mt-24">
                    <h1 className="tc-serif text-4xl font-black leading-[1.15] text-[#0b1b33] sm:text-5xl lg:text-6xl">
                        Welcome To <br />
                        <span className="text-[#16c75f]">The Charts</span>
                    </h1>
                    <p className="mx-auto mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
                        Stay updated with the latest trends, expert analysis, and market-moving news. Your daily dose of clarity and confidence in the ever-changing world of trading.
                    </p>
                    <Link
                        href="/contact"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0b1b33] px-7 py-3.5 font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-[#13284a]"
                    >
                        Contact Us <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HeroAbout;
