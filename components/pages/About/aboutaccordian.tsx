'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function UniqueAccordion() {
    const [openIndex, setOpenIndex] = useState(0);

    const items = [
        {
            title: 'Premium Community',
            content:
                "Trading is a lonely business where traders have to overcome day-to-day challenges like losses, downfall, etc . Our community helps to brush up your knowledge.",
            color: 'bg-[#FF985E]',
        },
        {
            title: 'Psychology',
            content:
                "Technicals & fundamentals are just 10% – 20% . 80% – 90% is psychology & mindset . We at The Charts help you to build that profitable trader mindset through real-time market experience . Activities of personalized mind image perception and weekly journal analysis",
            color: 'bg-[#FF985E]',
        },
        {
            title: 'Daily Doubt & Dual Learning',
            content:
                "We guide you through recorded videos and live doubt sessions (webinars).You watch the videos on your own will, make notes, and take down your doubts.During night doubt sessions, mentors resolve your doubts themselves.",
            color: 'bg-[#FF985E]',
        },
        {
            title: 'Career Oriented Courses:',
            content:
                "We not just helps you to navigate financial market, but also helps you to make a standout career.We will guide you to have certification (NISM) & FRM, but so many other opportunities like mentorship program.",
            color: 'bg-[#FF985E]',
        },
    ];

    const toggle = (index:any) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-[#B5D2F0] lg:pt-20 pt-5 xl:px-10 lg:px-2.5 px-2.5 md:px-5 lg:mb-28 mb-5 lg:mt-0 mt-5 ">
            <div className="container mx-auto lg:pb-0 pb-5">
                <h2 className="lg:text-5xl text-2xl md:text-3xl font-extrabold text-gray-900 lg:mb-6 mb-0">
                    What Makes <span className="italic font-light font-mrs-saint lg:text-[88px] text-4xl mr-6">The Charts</span>
                    <span className="font-extrabold">Unique?</span>
                </h2>

                <div className=" grid md:grid-cols-1 lg:grid-cols-2 lg:gap-1 items-end  ">
                    {/* Left Side */}
                    <div>
                        <Image src="/assets/landing/about/2.png" alt="Thinking Woman" width={992} height={661} className=" lg:block hidden" />
                    </div>

                    {/* Right Side (Accordion) */}
                    <div className="space-y-4 lg:pb-5">
                        {items.map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
                                <button onClick={() => toggle(index)} className="flex items-center w-full px-6 py-4 text-left">
                                    
                                    <span className={`w-2 h-20 rounded-full mr-4 ${item.color}`}></span>
                                    <div>
                                        <span className="flex-1 font-medium text-lg">{item.title}</span>
                                        <span className={`ml-2 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>▼</span>
                                    </div>
                                </button>

                                {openIndex === index && item.content && <div className="px-6 pb-4 text-gray-600">{item.content}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
