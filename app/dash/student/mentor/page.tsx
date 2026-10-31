'use client';
import React, { useState, Fragment, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { Dialog, DialogPanel, Transition, Tab, TransitionChild } from '@headlessui/react';
import IconFacebook from '@/components/icon/icon-facebook';
import IconInstagram from '@/components/icon/icon-instagram';
import IconLinkedin from '@/components/icon/icon-linkedin';
import IconTwitter from '@/components/icon/icon-twitter';
import Link from 'next/link';
import { head } from 'lodash';
import { getImageUrl } from '@/utils/common/common';

const ComponentsDragndropSortable = () => {
    const [modal19, setModal19] = useState(false);
    const [mentorList, setMentorList] = useState([]);
    const [mentorDatabyId, setMentorDatabyId] = useState<any>({});

    console.log("Mentor List State:", mentorList, mentorDatabyId);

    const fetchMentorList = async () => {
        try {
            const response = await fetch('/api/mentor/list', {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
            );
            const data = await response.json();
            setMentorList(data?.data?.data ?? []);
            console.log("Fetched mentor list:", data.data.data);
        } catch (error) {
            console.error('Error fetching mentor list:', error);
        }
    };
    useEffect(() => {
        fetchMentorList();
    }, []);

    const fetchMentorListById = async (id: any) => {
        try {
            const response = await fetch(`/api/mentor/list?id=${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
            );
            console.log("Fetching mentor by ID:", response);
            const data = await response.json();
            setMentorDatabyId(data?.data ?? {});
            console.log("Fetched mentor list:", data.data.data);
        } catch (error) {
            console.error('Error fetching mentor list:', error);
        }
    };

    return (
        <div className="panel">
            <div className="mb-5 text-lg font-semibold">All Mentors</div>
            <div className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
                <div>
                    <ul id="example1">
                        {mentorList?.length > 0 && mentorList.map((item) => {
                            return (
                                <li key={item.id} className="mb-2.5 cursor-grab">
                                    <div className="items-md-center flex flex-col rounded-md border border-white-light bg-white px-6 py-3.5 text-center dark:border-dark dark:bg-[#1b2e4b] md:flex-row ltr:md:text-left rtl:md:text-right">
                                        <div className="ltr:sm:mr-4 rtl:sm:ml-4">
                                            <img
                                                src={
                                                     getImageUrl(item?.profile_image?.url)
                                                        
                                                }
                                                alt="profile"
                                                className="mx-auto h-11 w-11 rounded-full"
                                            />
                                            {/* <img alt="avatar" src={`/assets/images/profile-${item.profile_image.url}.jpeg`} className="mx-auto h-11 w-11 rounded-full" /> */}
                                        </div>
                                        <div className="flex flex-1 flex-col items-center justify-between md:flex-row">
                                            <div className="my-3 font-semibold md:my-0">
                                                <div className="text-base text-dark dark:text-[#bfc9d4]">{item?.mentor_expertise}</div>
                                                <div className="text-xs text-white-dark">{`${item?.firstName ?? ""} ${item?.lastName ?? ""} `}</div>
                                            </div>
                                            <div className='flex gap-2'>

                                                <Link href={`/dash/student/mentor/chat?mentorId=${item?.id}`} >
                                                    <button type="button" className="btn btn-success btn-sm px-5 py-2">
                                                        Chat
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

            </div>
            <div>

                <Transition appear show={modal19} as={Fragment}>
                    <Dialog as="div" open={modal19} onClose={() => setModal19(false)}>
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0"></div>
                        </TransitionChild>
                        <div id="profile_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                            <div className="flex items-start justify-center min-h-screen px-4">
                                <TransitionChild
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden max-w-[340px] w-full  my-8 text-black dark:text-white-dark">
                                        <div className=" z-[999] absolute flex items-center justify-end  ltr:pr-4 rtl:pl-4 text-white dark:text-white-light top-1 right-0">
                                            <button
                                                type="button"
                                                onClick={() => setModal19(false)}
                                                className="p-2 rounded-full hover:bg-gray-200 transition"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-6 h-6 text-white-dark hover:text-black transition"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={1.5}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="w-full">

                                            <div className="relative overflow-hidden rounded-md bg-white text-center shadow dark:bg-[#1c232f]" >
                                                <div className="relative overflow-hidden rounded-md bg-white text-center shadow dark:bg-[#1c232f]">
                                                    <div className="rounded-t-md bg-white/40 bg-[url('/assets/images/notification-bg.png')] bg-cover bg-center p-6 pb-0">
                                                        <img className="mx-auto max-h-40 w-4/5 object-contain" src={`/assets/images/profile-35.png`} alt="contact_image" />
                                                    </div>
                                                    <div className="relative -mt-10 px-6 pb-24">
                                                        <div className="rounded-md bg-white px-2 py-4 shadow-md dark:bg-gray-900">
                                                            <div className="text-base text-dark dark:text-[#bfc9d4] font-semibold">{`${mentorDatabyId?.firstName ?? ""} ${mentorDatabyId?.lastName ?? ""} `}</div>
                                                            <div className="text-xs text-white-dark font-medium">{mentorDatabyId?.mentor_expertise ?? ""}</div>


                                                        </div>
                                                        <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">
                                                            <div className="flex items-center">
                                                                <div className="text-[11px]">{mentorDatabyId?.mentor_description ?? ""}</div>
                                                                {/* <div className="truncate text-white-dark">{contact.email}</div> */}
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-0 mt-6 flex w-full gap-4 p-6 ltr:left-0 rtl:right-0">

                                                        <button type="button" className="btn btn-outline-primary w-1/2" >
                                                            <Link href={`/dash/student/mentor/chat?mentorId=${mentorDatabyId?.id}`}>
                                                                Chat
                                                            </Link>
                                                        </button>

                                                        <button type="button" className="btn btn-outline-danger w-1/2">
                                                            Email
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </DialogPanel>
                                </TransitionChild>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
};

export default ComponentsDragndropSortable;
