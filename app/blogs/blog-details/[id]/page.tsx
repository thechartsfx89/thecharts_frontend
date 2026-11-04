// app/blogs/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { HeroPill, TcPage } from '@/components/pages/Landing/page-shell';
import RelatedBlogs from '../related-blogs';
import SocialShare from '@/app/socialshare';
import { getImageUrl } from '@/utils/common/common';

export default function SingleBlogPost() {
    const { id, blogId } = useParams(); // get blog ID from URL
    const [blog, setBlog] = useState<any>(null);
    console.log({ blog });
    const [loading, setLoading] = useState(true);
    console.log({ id, blogId });
    useEffect(() => {
        if (!id) return;
        data: {
        }
        const fetchBlog = async () => {
            try {
                const res = await fetch(`/api/blogs/${id}`);
                const data = await res.json();
                setBlog(data?.data || null);
            } catch (err) {
                console.error('Failed to fetch blog:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <TcPage>
                <div className="mx-auto max-w-3xl animate-pulse space-y-5 px-4 py-16 sm:px-6">
                    <div className="h-10 w-3/4 rounded-xl bg-slate-100" />
                    <div className="aspect-video rounded-3xl bg-slate-100" />
                    <div className="h-4 rounded bg-slate-100" />
                    <div className="h-4 w-5/6 rounded bg-slate-100" />
                </div>
            </TcPage>
        );
    }

    if (!blog) {
        return (
            <TcPage>
                <div className="px-4 py-24 text-center text-lg font-semibold text-[#0b1b33]">Blog not found.</div>
            </TcPage>
        );
    }

    const blogUrl = `https://educandle.com/blogs/${id}`;
    const blogTitle = blog?.title || 'Blog Article';

    return (
        <TcPage>
            <article>
                {/* Title + Meta */}
                <header className="tc-page-hero relative overflow-hidden">
                    <div className="tc-page-hero-grid absolute inset-0" aria-hidden="true" />
                    <div className="relative mx-auto max-w-3xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
                        {blog?.blog_category?.categoryName && (
                            <span className="capitalize">
                                <HeroPill>{blog.blog_category.categoryName}</HeroPill>
                            </span>
                        )}
                        <h1 className="tc-serif mt-6 text-3xl font-black leading-tight text-[#0b1b33] sm:text-4xl lg:text-5xl">{blog?.blog_title}</h1>
                        <p className="mt-5 text-sm text-slate-500">
                            By <b className="font-semibold text-[#0b1b33]">{blog?.author || 'Admin'}</b> · {new Date(blog.publishedAt).toLocaleDateString()}
                        </p>
                    </div>
                </header>

                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    {/* Featured Image */}
                    {blog?.blog_image && (
                        <div className="relative mt-4 aspect-video overflow-hidden rounded-3xl shadow-2xl shadow-slate-900/15">
                            <Image src={getImageUrl(blog.blog_image?.[0]?.url)} alt={blog?.blog_title || 'Blog'} fill sizes="(min-width: 896px) 896px, 100vw" className="object-cover" />
                        </div>
                    )}

                    {/* Blog Content */}
                    <div className="tc-prose mx-auto mt-10 max-w-3xl text-lg">
                        {blog.blog_description?.map((block:any, index:any) => <p key={index}>{block.children?.map((child:any, childIndex:any): any => <span key={childIndex}>{child.text}</span>)}</p>)}
                    </div>

                    <div className="mx-auto mt-10 flex max-w-3xl justify-center border-t border-slate-200 pt-8">
                        <SocialShare url={blogUrl} title={blogTitle} />
                    </div>
                </div>
            </article>

            {/* Related Blogs */}
            <RelatedBlogs category={blog?.blog_category?.categoryName}/>
        </TcPage>
    );
}
