// src/components/AboutSection.js
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutSection() {
    return (
        <section className="container mx-auto lg:p-0 p-2.5 xl:px-10 lg:px-2.5 px-2.5 ">
            <div
                style={{
                    backgroundImage: `url("/assets/landing/courses/bg-1.png")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
                // className="container mb-32 mx-auto bg-[#92DD84 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row  justify-between relative overflow-hidden"
                className=" lg:mb-32 mb-5  lg:bg-transparent bg-[#92DD84]  rounded-2xl p-8 md:p-12 flex flex-col md:flex-row justify-between relative overflow-hidden "
            >
                {/* Left Content */}
                <div className="max-w-2xl text-white space-y-4">
                    <div className="flex items-center space-x-2">
                        <img
                            src="/assets/landing/courses/5.png" // replace with actual image
                            alt="Educator"
                            className="rounded-xl"
                        />
                    </div>

                    <p className="text-sm md:text-base leading-relaxed text-black">
                        We Believe Education Isn’t Just A Step Toward Success—It’s The Foundation. In A Financial Landscape That Changes By The Second, Staying Informed And Skillful Is Everything.
                        That’s Why Our Mission Is Simple: Make Trading Clear, Accessible, And Practical For Everyone—Whether You’re New To The Market Or Sharpening Advanced Strategies.
                    </p>

                    <p className="text-sm md:text-base leading-relaxed text-black">
                        Our Community Is Built By Passionate Educators, Experienced Traders, And Market Analysts Dedicated To Sharing Real-World Insights, Proven Techniques, And Market-Driven
                        Strategies. Through Our Interactive Courses, Live Sessions, And Up-To-Date Market Analysis, We Equip Learners To Move From Theory To Confident Action.
                    </p>
                    <Link href={"/contact"}>
                        <button className="flex mt-11 items-center gap-2 bg-white text-black px-5 py-3 rounded-full shadow-lg hover:bg-gray-100 transition">
                            Connect With Us
                            <span className="bg-red-500 text-white p-1 rounded-full">
                                <ArrowUpRight className="w-5 h-5" />
                            </span>
                        </button>
                    </Link>
                </div>

                {/* Right Image */}
                <div className="top-0  absolute right-0">
                    <Image
                        src="/assets/landing/about/4.png" // replace with actual image
                        alt="Educator"
                        width={334}
                        height={359}
                        className="rounded-xl lg:w-[334px] w-[95px]"
                    />
                </div>
            </div>
        </section>
    );
}
