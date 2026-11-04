'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import BlogCard from '@/components/pages/Blog/blogcards';
import { SectionHeading } from '@/components/pages/Landing/sections';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

export default function RelatedBlogs({ category }: { category: string }) {
    const [blogData, setBlogData] = useState<any[]>([]);
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const apihandler = async () => {
            const res = await fetch(`/api/blogs/related-blogs?category=${encodeURIComponent(category)}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
            });
            const { data } = await res.json();
            setBlogData(Array.isArray(data) ? data : []);
        };
        apihandler();
    }, [category]);

    return (
        <section className="mt-16 bg-[#f3fbf6] py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Title */}
                <div className="mb-10">
                    <SectionHeading
                        eyebrow="Blogs"
                        center={false}
                        title={
                            <>
                                Related <span className="text-[#16c75f]">Blogs</span>
                            </>
                        }
                    />
                </div>

                {blogData.length === 0 ? (
                    <p className="text-slate-500">No related blogs found.</p>
                ) : (
                    <Swiper
                        modules={[Navigation, A11y, Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 1.3, spaceBetween: 16 },
                            768: { slidesPerView: 2, spaceBetween: 10 },
                            1024: { slidesPerView: 2, spaceBetween: 10 },
                            1440: { slidesPerView: 3, spaceBetween: 10 },
                        }}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        navigation={{
                            // placeholders; real refs are set in onBeforeInit
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            // hook custom buttons
                            // @ts-expect-error - extend swiper params
                            swiper.params.navigation.prevEl = prevRef.current;
                            // @ts-expect-error
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        className="carouselFour"
                    >
                        {blogData.map((blog: any, index: number) => (
                            <SwiperSlide key={blog?.id ?? index} className="!h-auto">
                                <Link href={`/blogs/blog-details/${blog?.documentId}`} className="block h-full p-2">
                                    <BlogCard
                                        category={blog?.blog_category?.categoryName || 'Uncategorized'}
                                        title={blog?.blog_title || 'Untitled'}
                                        desc={blog?.blog_description?.[0]?.children?.[0]?.text}
                                        img={blog?.blog_image?.[0]?.url}
                                    />
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </section>
    );
}
