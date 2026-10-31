'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/scrollbar';
import { getCourseUrl } from '@/utils/common/common';
import Link from 'next/link';

export default function FeaturedCourses() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const cardColors = ['#C3F499', '#B5D2F0', '#FF985E'];


    // 🔵 Fetch courses from API
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/courses', {
                    headers: { 'Content-Type': 'application/json' },
                });

                const json = await res.json();

                if (res.ok) {
                    setCourses(json?.data || []);
                }
            } catch (error) {
                console.error('Failed to load featured courses', error);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <section className="lg:py-16 py-5 xl:px-10 lg:px-2.5 px-2.5 2xl:mt-28">
            <div className="container mx-auto">

                {/* Title */}
                <h2 className="lg:text-5xl md:text-4xl text-3xl font-extrabold mb-2">
                    Featured{' '}
                    <span className="text-green-600 italic font-normal font-mrs-saint lg:text-[88px] text-4xl">
                        Courses
                    </span>
                </h2>

                <p className="text-gray-600 lg:mb-20 mb-5 text-sm lg:text-[1.1rem]">
                    Kickstart your trading journey with essential knowledge of currency markets, pips, and trading platforms.
                </p>

                {/* Slider */}
                <Swiper
                    modules={[Scrollbar]}
                    spaceBetween={24}
                    scrollbar={{ draggable: true }}
                    slidesPerView={3}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        375: { slidesPerView: 1 },
                        425: { slidesPerView: 1 },
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {loading
                        ? [...Array(3)].map((_, i) => (
                            <SwiperSlide key={i}>
                                <div className="bg-gray-200 animate-pulse rounded-[30px] p-8 h-[280px]" />
                            </SwiperSlide>
                        ))
                        : courses.map((course, index) => (


                            <SwiperSlide key={course.documentId}>

                                <Link
                                    href={`/courses/course-details/${course?.documentId}`}
                                    className="block h-full"
                                >
                                    <div className=" rounded-[30px] p-8 relative shadow-md h-full" style={{ backgroundColor: cardColors[index % cardColors.length] }}
>

                                        {/* Arrow */}
                                        <button className="absolute top-8 left-8">
                                            <img
                                                src="/assets/landing/featured-courses/2.png"
                                                alt="arrow"
                                            />
                                        </button>

                                        {/* Image */}
                                        <div className="flex justify-end">
                                            <Image
                                                src={getCourseUrl(course?.course_thumbnail?.url)}
                                                alt={course?.course_title}
                                                width={160}
                                                height={60}
                                                className="rounded-xl object-cover"
                                            />
                                        </div>

                                        {/* Level */}
                                        <span className="inline-block border border-black px-3 py-1 text-sm rounded-full mb-3">
                                            {course?.course_category?.category_name || 'Beginner'}
                                        </span>

                                        {/* Title */}
                                        <h3 className="xl:text-xl lg:text-lg text-xl mb-2">
                                            {course?.course_title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-700 text-sm line-clamp-2">
                                            {course?.course_desc}
                                        </p>
                                    </div></Link>
                            </SwiperSlide>

                        ))}
                </Swiper>
            </div>
        </section>

    );
}
