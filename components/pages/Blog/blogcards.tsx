// components/CourseCard.jsx
'use client';

import { getCourseUrl, getImageUrl } from '@/utils/common/common';
import Image from 'next/image';

export default function BlogCard({ category, title, desc, img, bg }: any) {
    return (
        <div className={` rounded-3xl p-6 relative custom-shadow panel`}>
            <button className="absolute top-4 left-4">
                <img src="/assets/landing/featured-courses/2.png" alt="icon" className="w-16 h-16" />
            </button>
            <div className="flex justify-end ">
                <div className=''>
                    <Image src={getCourseUrl(img)} alt={title} width={192} height={80} className="rounded-xl object-cover" />
                </div>
            </div>
            <span className="inline-block border border-black px-6 py-2 text-sm rounded-2xl xl:mb-8 lg:mb-2 mb-1">{category}</span>
            <h3 className="xl:text-2xl lg:text-xl text-lg lg:mb-4 mb-1">{title}</h3>
            <p className="text-sm line-clamp-2">{desc}</p>
        </div>
    );
}
