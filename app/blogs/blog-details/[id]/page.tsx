// app/blogs/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/app/dashboard/landing/headerLanding';
import Footer from '@/components/pages/Footer/footer';
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
        return <div className="text-center py-10">Loading blog...</div>;
    }

    if (!blog) {
        return <div className="text-center py-10">Blog not found.</div>;
    }

    const blogUrl = `https://educandle.com/blogs/${id}`;
    const blogTitle = blog?.title || 'Blog Article';

    return (
        <>
            <Header />
            <div className="bg-[#f5f9e5] lg:p-5 p-0 ">
                <div className="container mx-auto lg:p-10 md:p-5 p-2.5 bg-white shadow-sm rounded-2xl ">
                    {/* Featured Image */}
                    {blog?.blog_image && (
                        <div className="w-full lg:h-[600px] md:h-[400px] h-[200px]  relative rounded-xl overflow-hidden">
                            <Image src={getImageUrl(blog.blog_image?.[0]?.url)} alt={blog.title} fill className="object-cover" />
                        </div>
                    )}
                    {/* Title + Meta */}
                    <div className="mt-6">
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">{blog?.blog_title}</h1>
                        <div className="mt-3 flex flex-wrap justify-between items-center text-sm text-gray-500">
                            <span>
                                By <b>{blog?.author || 'Admin'}</b> · {new Date(blog.publishedAt).toLocaleDateString()}
                            </span>
                            <div className="flex gap-3">
                                <SocialShare url={blogUrl} title={blogTitle} />
                            </div>
                        </div>
                    </div>
                    {/* Blog Content */}
                    <div className="text-sm md:text-base max-w-none mt-3 text-gray-700">
                        {blog.blog_description?.map((block:any, index:any) => <p key={index}>{block.children?.map((child:any, childIndex:any): any => <span key={childIndex}>{child.text}</span>)}</p>)}
                    </div>
                    {/* Related Blogs */}
                    <div className="mt-12">
                        <RelatedBlogs category={blog?.blog_category?.categoryName}/>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
