'use client';

import { useEffect, useState, useRef } from 'react';
import BlogCard from '@/components/pages/Blog/blogcards';
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
        <section className="lg:py-16 py-8 ">
            <div className="container mx-auto">
                {/* Title */}
                <h2 className="lg:text-4xl md:text-3xl text-2xl font-extrabold mb-6">
                    Related <span className="text-green-600 italic font-normal font-mrs-saint lg:text-[72px] text-3xl">Blogs</span>
                </h2>

                {/* Blogs Grid */}
                {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(blogData) && blogData.length > 0 &&
                    blogData.map((blog: any, index: any) => (
                        <BlogCard
                            key={index}
                            category={blog?.blog_category?.categoryName || 'Uncategorized'}
                            title={blog?.blog_title || 'Untitled'}
                            desc={blog?.blog_description?.[0]?.children?.[0]?.text}
                            img={blog?.blog_image?.[0]?.url}
                        />
                    ))}
                </div> */}

                {blogData.length === 0 ? (
                    <p className="text-gray-500">No related blogs found.</p>
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
                            <SwiperSlide key={blog?.id ?? index}>
                                <div className="h-full p-2">
                                    <BlogCard
                                        category={blog?.blog_category?.categoryName || 'Uncategorized'}
                                        title={blog?.blog_title || 'Untitled'}
                                        desc={blog?.blog_description?.[0]?.children?.[0]?.text}
                                        img={blog?.blog_image?.[0]?.url}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </section>
    );
}
