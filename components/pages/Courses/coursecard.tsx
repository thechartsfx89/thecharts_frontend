// components/CourseCard.js
'use client';

import { RUPEE_HTML_CODE } from '@/api-constant';
import IconStar from '@/components/icon/icon-star';
import { getCourseUrl, getImageUrl } from '@/utils/common/common';
import { formatCourseLength } from '@/utils/dateFormatter';
import Image from 'next/image';

export default function CourseCard({ price, title, desc, img, bg, category, gst, feedback, length, offline_course }: any) {
    return (

        <div className="panel h-full overflow-hidden border-0 p-0 bg-[#ffffff] rounded-lg">
            <div className="min-h-[190px] w-full relative">
                <Image
                    src={getCourseUrl(img) }
                    alt="Purchased course image"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="p-5">
                <div className="mb-5">
                    <p className="font-semibold mb-1 text-[16px]">
                        {title ?? ""}
                    </p>
                    <span className="text-xs text-gray-600 line-clamp-2 leading-snug max-w-full">
                        {desc ?? ""}
                    </span>
                </div>
                <div className="space-y-1">
                    <div className="mb-4 flex items-center justify-between font-semibold">
                        <div>
                            <span className="font-semibold mb-1 text-[14px]">
                                Course By: <span className='font text-[14px] text-gray-600'>Gaurav Singh</span>
                            </span>

                        </div>
                        <div className="flex items-center gap-2">
                            <IconStar className="text-yellow-500" />
                            <span className="text-sm font-semibold">{feedback ?? ""}</span>
                        </div>
                    </div>


                </div>
                <div className="space-y-1">
                    <div className="mb-2 flex items-center justify-between font-semibold">
                        <div>
                            <span className="text-lg text-dark leading-none font-bold" dangerouslySetInnerHTML={{ __html: `${RUPEE_HTML_CODE} ${Number(price || 0).toLocaleString('en-IN')}` }}>

                            </span>
                            {/* {gst &&
                                <span className="ml-1 text-gray-500 text-base">+ GST</span>
                            } */}
                            {/* {true && (
                                <span
                                    className="ml-3 text-gray-400 text-base line-through"
                                    dangerouslySetInnerHTML={{
                                        __html: `${RUPEE_HTML_CODE} ${Number(16000).toLocaleString('en-IN')}`,
                                    }}
                                />
                            )} */}
                        </div>
                        <div className="flex items-center gap-2">
                            {!offline_course &&  <span className="text-sm font-semibold">🕒 {formatCourseLength(length)}</span>}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        {/* <span className="text-sm text-gray-500">🕒 12 Total Hours</span > */}
                        {/* <span className=" text-sm bg-[#62C76F] px-2 py-[2px] rounded font-[500] cursor-pointer font-semibold">
                         Best Seller
                        </span> */}
                    </div>
                    {/* <div className="h-5 w-full overflow-hidden rounded-full bg-dark-light p-1 shadow-3xl">
                        <div
                            className="relative h-full w-full rounded-full bg-gradient-to-r from-[#126337] to-[#009746] before:absolute before:inset-y-0 before:m-auto before:h-2 before:w-2 before:rounded-full before:bg-white right-0.5"
                            style={{ width: '65%' }}
                        ></div>
                    </div> */}
                </div>
            </div>
        </div>

    );
}
