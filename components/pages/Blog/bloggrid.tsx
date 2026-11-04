'use client';

import { useEffect, useState } from 'react';
import BlogCard from './blogcards';
import Link from 'next/link';
import NoDataComponent from '@/utils/common/noDataComponent';
import { SectionHeading } from '@/components/pages/Landing/sections';

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

    const renderSkeleton = () => [...Array(6)].map((_, i) => <div key={`${i}_blog_skeleton`} className="h-[360px] animate-pulse rounded-3xl bg-slate-100" />);

    return (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <SectionHeading
                eyebrow="Blogs"
                center={false}
                title={
                    <>
                        Latest <span className="text-[#16c75f]">Blogs</span>
                    </>
                }
                sub="Explore curated news, trading tips, and deep dives into currency markets. Empower your trading journey with knowledge that keeps you ahead."
            />

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading
                    ? renderSkeleton()
                    : blogs.map((blog: any) => (
                          <Link href={`/blogs/blog-details/${blog?.documentId}`} key={blog?.documentId || blog?.id} className="h-full">
                              <BlogCard
                                  category={blog?.blog_category?.categoryName || 'Uncategorized'}
                                  title={blog?.blog_title || 'Untitled'}
                                  desc={blog?.blog_description?.[0]?.children?.[0]?.text || ''}
                                  img={blog?.blog_image?.[0]?.url || ''}
                              />
                          </Link>
                      ))}
            </div>
            {!loading && blogs.length === 0 && <NoDataComponent />}
        </section>
    );
}
