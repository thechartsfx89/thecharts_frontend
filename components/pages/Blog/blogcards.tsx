// components/CourseCard.jsx
'use client';

import { getCourseUrl } from '@/utils/common/common';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

export default function BlogCard({ category, title, desc, img }: any) {
    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <Image src={getCourseUrl(img)} alt={title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 90vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-[#0b1b33] backdrop-blur">{category}</span>
            </div>
            <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold leading-snug text-[#0b1b33]">{title}</h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-[#0e9f4a] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{desc}</p>
            </div>
        </div>
    );
}
