'use client';

import { useEffect, useState } from 'react';
import BlogCard from './blogcards';
import Link from 'next/link';
import NoDataComponent from '@/utils/common/noDataComponent';

export default function BlogsGrid() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch('/api/blogs', { headers: { 'Content-Type': 'application/json' } });
                const { data } = await res.json();
                console.log({res});
                if(res?.ok && res.status === 200){
                setBlogs(data || [])
                } else {
                //   console.error('Failed to fetch blogs, status:', res.status);
                }
            } catch (err) {
                // console.error('Error fetching blogs:', err);
                setBlogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const renderSkeleton = () =>
        [...Array(6)].map((_, i) =>
            <div key={`${i}_blog_skeleton`} className="rounded-3xl p-6 relative bg-white dark:bg-dark-light border border-gray-100 dark:border-gray-700 animate-pulse custom-shadow panel overflow-hidden">
                <div className="absolute top-4 left-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="flex justify-end mb-4">
                    <div className="w-48 h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                </div>
                <div className="inline-block px-6 py-2 mb-4 rounded-2xl bg-gray-200 dark:bg-gray-700 w-28" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            </div>
        )

    return (
        <section className="lg:py-16 py-2.5 xl:px-10 lg:px-2.5 px-2.5">
            <div className="container mx-auto">
                <h2 className="lg:text-5xl md:text-4xl text-3xl font-extrabold mb-2">
                    Latest{' '}
                    <span className="text-green-600 italic font-normal font-mrs-saint lg:text-[88px] text-4xl">
                        Blogs
                    </span>
                </h2>
                <p className="text-gray-600 mb-10 max-w-2xl">
                    Explore curated news, trading tips, and deep dives into currency markets. Empower your trading
                    journey with knowledge that keeps you ahead.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading
                        ? renderSkeleton()
                        : blogs.length > 0
                            ? blogs.map((blog: any) => (
                                <Link
                                    href={`/blogs/blog-details/${blog?.documentId}`}
                                    key={blog?.documentId || blog?.id}
                                    className="h-full"
                                >
                                    <BlogCard
                                        category={blog?.blog_category?.categoryName || 'Uncategorized'}
                                        title={blog?.blog_title || 'Untitled'}
                                        desc={blog?.blog_description?.[0]?.children?.[0]?.text || ''}
                                        img={blog?.blog_image?.[0]?.url || ''}
                                    />
                                </Link>
                            ))
                            : null}
                </div>
                {!loading && blogs.length === 0 && <NoDataComponent/>}
                {/* Optional Load More */}
                {/* <div className="flex justify-center lg:py-24 py-5 gap-2.5">
          <button className="flex items-center bg-red-500 text-white justify-between px-4 py-2 border-1 rounded-lg ">
            Load more
          </button>
        </div> */}
            </div>
        </section>
    );
}
