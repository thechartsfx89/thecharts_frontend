'use client';

import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/scrollbar';

export default function FeaturedCourses() {
    const courses = [
        {
            level: 'Beginner',
            title: 'Currency Pairs & Pips',
            desc: 'Learn the basics of forex markets, key terms,',
            img: '/assets/landing/featured-courses/1.png',
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
            desc: 'Learn the basics of forex markets, key terms.',
            img: '/assets/landing/featured-courses/1.png',
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
            desc: 'Learn the basics of forex markets, key terms.',
            img: '/assets/landing/featured-courses/1.png',
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
        <section className="lg:py-16 py-5 xl:px-10 lg:px-2.5 px-2.5 2xl:mt-28">
            <div className="container mx-auto">
                {/* Title */}
                <h2 className="lg:text-5xl md:text-4xl text-3xl font-extrabold mb-2">
                    Featured <span className="text-green-600 italic font-normal font-mrs-saint lg:text-[88px] text-4xl">Courses</span>
                </h2>
                <p className="text-gray-600 lg:mb-20 mb-5 text-[1.1rem]">Kickstart your trading journey with essential knowledge of currency markets, pips, and trading platforms.</p>

                {/* Swiper Slider */}
                <Swiper
                    modules={[Scrollbar]}
                    spaceBetween={24}
                    scrollbar={{ draggable: true }}
                    slidesPerView={3}
                      className="w-full "
                    // className="[&_.swiper-scrollbar]:w-full [&_.swiper-scrollbar]:left-0 [&_.swiper-scrollbar]:right-0"
                    breakpoints={{
                        375: { slidesPerView: 1 },
                        425: { slidesPerView: 1 },
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {courses.map((course, index) => (
                        <SwiperSlide key={index}>
                            <div className={`${course.bg}  rounded-[30px] p-8 relative shadow-md   h-full`}>
                                {/* Arrow button (example, can be replaced with lucide icon) */}
                                <button className="absolute top-8 left-8">
                                    <img src="/assets/landing/featured-courses/2.png" alt="arrow" />
                                </button>

                                {/* Image */}
                                <div className="flex justify-end ">
                                    <Image src={course.img} alt={course.title} width={160} height={60} className="rounded-xl object-cover" />
                                </div>

                                {/* Level */}
                                <span className="inline-block border border-black px-3 py-1 text-sm rounded-full mb-3">{course.level}</span>

                                {/* Title */}
                                <h3 className="xl:text-2xl lg:text-lg text-xl mb-2">{course.title}</h3>

                                {/* Description */}
                                <p className="text-gray-700 text-sm">{course.desc}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            
        </section>
    );
}
