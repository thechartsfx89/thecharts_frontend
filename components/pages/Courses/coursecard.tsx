// components/CourseCard.js
'use client';

import { RUPEE_HTML_CODE } from '@/api-constant';
import { getCourseUrl } from '@/utils/common/common';
import { formatCourseLength } from '@/utils/dateFormatter';
import { ArrowUpRight, Clock, Star } from 'lucide-react';
import Image from 'next/image';

export default function CourseCard({ price, title, desc, img, category, feedback, length, offline_course }: any) {
    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <Image src={getCourseUrl(img)} alt={title || 'Course'} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw" className="object-cover transition duration-500 group-hover:scale-105" />
                {category && <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0b1b33] backdrop-blur">{category}</span>}
            </div>

            <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-[#0b1b33]">{title ?? ''}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{desc ?? ''}</p>

                <div className="mb-5 mt-4 flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-500">
                        Course By: <span className="font-medium text-[#0b1b33]">Gaurav Singh</span>
                    </span>
                    {feedback ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#0b1b33]">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            {feedback}
                        </span>
                    ) : null}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                    <div className="min-h-[3.25rem]">
                        <span className="tc-serif text-2xl font-black text-[#0b1b33]" dangerouslySetInnerHTML={{ __html: `${RUPEE_HTML_CODE} ${Number(price || 0).toLocaleString('en-IN')}` }} />
                        {!offline_course && (
                            <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <Clock className="h-3.5 w-3.5" />
                                {formatCourseLength(length)}
                            </span>
                        )}
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0b1b33] text-[#16c75f] transition group-hover:bg-[#16c75f] group-hover:text-[#0b1b33]">
                        <ArrowUpRight className="h-5 w-5" />
                    </span>
                </div>
            </div>
        </div>
    );
}
