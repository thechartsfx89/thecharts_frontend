'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import Image from 'next/image';
import { Scrollbar } from 'swiper/modules';

export default function TestFeatures() {
    const courses = [
        {
            level: 'Beginner',
            title: 'Currency Pairs & Pips',
            desc: 'Learn the basics of forex markets, key terms, and how trading works.',
            img: '/assets/landing/featured-courses/1.png', // put your images in /public/courses/
            bg: 'bg-green-200',
        },
        {
            level: 'Intermediate',
            title: 'Technical Analysis Mastery',
            desc: 'Master chart patterns, indicators, and price action strategies.',
            img: '/assets/landing/featured-courses/1.png',
            bg: 'bg-blue-200',
        },
        {
            level: 'Advanced',
            title: 'Forex Strategy Blueprint',
            desc: 'Build and test complete trading systems with defined rules.',
            img: '/assets/landing/featured-courses/1.png',
            bg: 'bg-orange-300',
        },
        {
            level: 'Beginner',
            title: 'Currency Pairs & Pips',
            desc: 'Learn the basics of forex markets, key terms, and how trading works.',
            img: '/assets/landing/featured-courses/1.png', // put your images in /public/courses/
            bg: 'bg-green-200',
        },
        {
            level: 'Intermediate',
            title: 'Technical Analysis Mastery',
            desc: 'Master chart patterns, indicators, and price action strategies.',
            img: '/assets/landing/featured-courses/1.png',
            bg: 'bg-blue-200',
        },
        {
            level: 'Advanced',
            title: 'Forex Strategy Blueprint',
            desc: 'Build and test complete trading systems with defined rules.',
            img: '/assets/landing/featured-courses/1.png',
            bg: 'bg-orange-300',
        },
    ];

    return (
        <>
            <h3>Slider5 is visible when you slide to 2,3, or 4, and slider5 has "swiper-slide-visible" className</h3>
            <br />
            <Swiper
                watchSlidesProgress={true}
                slidesPerView={3}
                breakpoints={{
            375: { slidesPerView: 2 },
            425: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 3 },
          }}
                scrollbar={{
                    hide: true,
                }}
                modules={[Scrollbar]}
                className="mySwiper"
            >
                <div className=" flex gap-6 ">
                    {courses.map((course, index) => (
                        <div key={index} className={`${course.bg} rounded-[30px] p-6 min-w-[320px] relative shadow-md`}>
                            {/* Arrow button */}
                            <button className="absolute top-4 left-4  ">
                                <img src="/assets/landing/featured-courses/2.png" />
                            </button>

                            {/* Image */}
                            <div className="flex justify-end mb-4">
                                <Image src={course.img} alt={course.title} width={192} height={80} className="rounded-xl object-cover" />
                            </div>

                            {/* Level */}
                            <span className="inline-block border border-black px-3 py-1 text-sm rounded-full mb-3">{course.level}</span>

                            {/* Title */}
                            <h3 className="text-2xl  mb-2">{course.title}</h3>

                            {/* Description */}
                            <p className="text-gray-700 text-sm">{course.desc}</p>
                        </div>
                    ))}
                </div>
            </Swiper>
        </>
    );
}
