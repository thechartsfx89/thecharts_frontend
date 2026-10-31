'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';
import { ArrowUpRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { getCourseUrl } from '@/utils/common/common';
import { SectionHeading } from './sections';

export default function FeaturedCourses() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/courses', { headers: { 'Content-Type': 'application/json' } });
                const json = await res.json();
                if (res.ok) setCourses(json?.data || []);
            } catch (error) {
                console.error('Failed to load featured courses', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (!loading && courses.length === 0) return null;

    return (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <SectionHeading eyebrow="Featured courses" center={false} title="Start with the essentials" sub="Kickstart your journey with currency markets, pips and trading platforms." />
                <Link href="/courses" className="inline-flex shrink-0 items-center gap-2 font-semibold text-[#0b1b33] hover:text-[#0e9f4a]">
                    View all courses <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>

            <Swiper modules={[Scrollbar]} spaceBetween={24} scrollbar={{ draggable: true }} breakpoints={{ 0: { slidesPerView: 1.1 }, 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} className="!mt-12 !pb-10">
                {loading
                    ? [...Array(3)].map((_, i) => (
                          <SwiperSlide key={i}>
                              <div className="h-[380px] animate-pulse rounded-3xl bg-slate-100" />
                          </SwiperSlide>
                      ))
                    : courses.map((course) => (
                          <SwiperSlide key={course.documentId} className="!h-auto">
                              <Link href={`/courses/course-details/${course?.documentId}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
                                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                      <Image src={getCourseUrl(course?.course_thumbnail?.url)} alt={course?.course_title || 'Course'} fill sizes="(min-width: 1024px) 33vw, 90vw" className="object-cover transition duration-500 group-hover:scale-105" />
                                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0b1b33] backdrop-blur">{course?.course_category?.category_name || 'Beginner'}</span>
                                  </div>
                                  <div className="flex flex-1 flex-col p-6">
                                      <h3 className="text-lg font-bold text-[#0b1b33]">{course?.course_title}</h3>
                                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{course?.course_desc}</p>
                                      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[#0e9f4a]">
                                          View course <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                      </span>
                                  </div>
                              </Link>
                          </SwiperSlide>
                      ))}
            </Swiper>
        </section>
    );
}
