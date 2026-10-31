import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const HeroAbout = () => {
    return (
        <section className="lg:py-16 md:py-10 py-2.5 xl:px-10 lg:px-2.5 px-2.5">
            <div className="container  mx-auto text-center lg:h-[700px]">
                <div className="flex relative  w-full items-center justify-center h-full">
                    <Image src="/assets/landing/about/1.png" alt="aboutus " fill className="object-fill lg:block hidden" />

                    {/* Text Content */}
                    <div className=" relative  ">
                        <span className=" lg:text-5xl font-semibold text-2xl">Welcome To </span>
                        <h2
                            className="lg:mt-11 mt-2 lg:text-[84px] text-3xl font-extrabold [text-shadow:5px_13px_4px_rgba(0,153,69,0.22)] font-michroma  text-[#009945]"
                        >
                            EDUCANDLE
                        </h2>
                        <p className="lg:mt-9 mt-3 max-w-2xl lg:text-lg text-sm  mx-auto">
                            Stay updated with the latest trends, expert analysis, and market-moving news. Your daily dose of clarity and confidence in the ever-changing world of trading.
                        </p>
                        <div className="w-full flex justify-center">
                            <Link href={"/contact"}>
                                <button className="flex lg:mt-11 mt-4  items-center gap-2 bg-white text-black lg:px-5 px-3 lg:py-3 py-1 rounded-full shadow-[2px_4px_9px_5px_rgba(0,0,0,0.25)] hover:bg-gray-100 transition lg:text-xl text-sm">
                                    Contact Us
                                    <span className="bg-red-500 text-white p-1 rounded-full">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroAbout;
