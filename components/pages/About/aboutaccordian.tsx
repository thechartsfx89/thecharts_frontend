'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionHeading } from '@/components/pages/Landing/sections';

export default function UniqueAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const items = [
        {
            title: 'Premium Community',
            content:
                "Trading is a lonely business where traders have to overcome day-to-day challenges like losses, downfall, etc . Our community helps to brush up your knowledge.",
        },
        {
            title: 'Psychology',
            content:
                "Technicals & fundamentals are just 10% – 20% . 80% – 90% is psychology & mindset . We at The Charts help you to build that profitable trader mindset through real-time market experience . Activities of personalized mind image perception and weekly journal analysis",
        },
        {
            title: 'Daily Doubt & Dual Learning',
            content:
                "We guide you through recorded videos and live doubt sessions (webinars).You watch the videos on your own will, make notes, and take down your doubts.During night doubt sessions, mentors resolve your doubts themselves.",
        },
        {
            title: 'Career Oriented Courses:',
            content:
                "We not just helps you to navigate financial market, but also helps you to make a standout career.We will guide you to have certification (NISM) & FRM, but so many other opportunities like mentorship program.",
        },
    ];

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-gradient-to-b from-white to-[#f3fbf6] pt-20 sm:pt-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    eyebrow="About"
                    title={
                        <>
                            What Makes <span className="text-[#16c75f]">The Charts</span> Unique?
                        </>
                    }
                />

                <div className="mt-12 grid items-end gap-10 lg:grid-cols-2">
                    <Image src="/assets/landing/about/2.png" alt="Thinking Woman" width={992} height={661} className="hidden lg:block" />

                    <div className="space-y-4 pb-16 lg:pb-20">
                        {items.map((item, index) => {
                            const open = openIndex === index;
                            return (
                                <div key={item.title} className={`overflow-hidden rounded-2xl border bg-white transition ${open ? 'border-[#16c75f]/50 shadow-xl shadow-slate-900/5' : 'border-slate-200 hover:border-slate-300'}`}>
                                    <button type="button" aria-expanded={open} onClick={() => toggle(index)} className="flex w-full items-center gap-4 px-6 py-5 text-left">
                                        <span className={`tc-serif flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${open ? 'bg-[#0b1b33] text-[#16c75f]' : 'bg-slate-100 text-slate-500'}`}>0{index + 1}</span>
                                        <span className="flex-1 text-lg font-bold text-[#0b1b33]">{item.title}</span>
                                        <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                                    </button>

                                    {open && <div className="px-6 pb-6 leading-relaxed text-slate-600 sm:pl-20">{item.content}</div>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
