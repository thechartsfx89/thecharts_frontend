"use client";

import Image from "next/image";
import { ArrowUpRight, CircleCheck } from "lucide-react";
import Link from "next/link";

export default function PricingCard() {
  return (
    <main className="">
      {/* --- Our Plans Section --- */}
      <section className=" container mx-auto lg:py-16  py-4 xl:px-10 lg:px-2.5 px-2.5">
        <div className="  ">
          {/* Heading */}
          <h2 className="lg:text-5xl md:text-4xl text-3xl font-extrabold mb-2">
            Our{" "}
            <span className="text-green-600 italic font-normal font-mrs-saint lg:text-[88px] text-4xl">
              Plans
            </span>
          </h2>
          <p className=" lg:mb-24 mb-5">
            We Focus On Real-World Examples, Live Chart Analysis, And
            Strategy-Building Sessions To Help Learners Apply What They Study.
          </p>

          {/* Cards */}
          <div className="flex flex-row lg:flex-row items-center
+              gap-10 lg:gap-14 xl:gap-28
+              overflow-x-auto xl:overflow-visible
+              snap-x snap-mandatory scroll-smooth
+              -mx-2 px-2
+              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:py-0 lg:py-14 py-5 justify-evenly ">
            {/* Left Card */}
            <div className="relative rounded-2xl py-12 px-9 shadow-md hover:shadow-xl transition-all duration-300 bg-green-200 max-w-[360px]
+                 shrink-0 min-w-[300px] sm:min-w-[360px] lg:min-w-0 snap-center">
              <div className="absolute top-0 right-0  overflow-hidden rounded-tr-2xl">
                <img
                  src="/assets/landing/plans/1.png"
                  alt="Starter Plan"
                  // width={121}
                  // height={166}
                  className="object-cover"
                />
              </div>
              <h3 className="lg:text-xl text-xl mb-3.5 font-semibold">Foundation course</h3>
              <p className="text-gray-700 mb-3.5">
                For Beginners Ready To Take Their First Step
              </p>
              <p className="text-xl font-semibold mb-6">
                ₹99 {" "}
                <span className="text-gray-500 text-sm line-through">
                  ₹1,99
                </span>
              </p>

              <Link href="/courses/course-details/w4v2ac64489eegvefk0fjwbv">
                <button className="flex items-center justify-between bg-white px-4 py-1 lg:text-md text-md mb-6 w-full rounded-full shadow hover:scale-105 transition">
                  <span className="text-gray-800 ">Get Started</span>
                  <img src="/assets/landing/plans/red-arrow.png" className="w-9 h-9" />
                </button>
              </Link>
              <p className="text-gray-700 mb-4">what’s Include :</p>
              <ul className="mt-2 space-y-2 text-sm text-left">
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Access To Beginner Trading Courses
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Weekly Live Sessions (Basic Level)
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Practice Quizzes & Assignments
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Community Access
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Real-time interaction
                </li>
              </ul>
              <div className="w-1/2 h-4 bg-[#ddd] absolute bottom-0 left-0 rounded-b-2xl bg-gradient-to-r from-[#62C76F] to-green-200"></div>

              <div className="absolute bottom-1 right-2 rounded-full z-9999">
                <img src="/assets/landing/featured-courses/2.png" className="w-12 h-12 " />
              </div>
            </div>

            {/* Middle Card (Bigger) */}
            <div className="relative rounded-2xl pt-11 pb-28 px-9 shadow-md hover:shadow-xl transition-all duration-300 bg-blue-200 max-w-[431px] scale-105
+                 shrink-0 min-w-[300px] sm:min-w-[360px] lg:min-w-0 snap-center">
              <div className="absolute top-0 right-0 overflow-hidden rounded-tr-2xl">
                <Image
                  src="/assets/landing/plans/2.png"
                  alt="Pro Trader Plan"
                  width={146}
                  height={200}
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4">Full course</h3>
              <p className="text-gray-700 mb-4 pr-12">
                For Serious Traders Who Want An Edge
              </p>
              <p className="text-xl font-semibold mb-10">
                ₹26,550 {" "}
                <span className="text-gray-500 text-sm line-through">
                  ₹56,999
                </span>
              </p>
              <Link href="/courses/course-details/yijrnm2mbfm4rxxm5mumf0gb">
                <button className="flex items-center justify-between bg-white px-4 py-1 lg:text-md text-md mb-6 w-full rounded-full shadow hover:scale-105 transition">
                  <span className="text-gray-800 ">Get Started</span>
                  <img src="/assets/landing/plans/red-arrow.png" className="w-9 h-9" />
                </button>
              </Link>
              <p className="text-gray-700 mb-3">what’s Include :</p>
              <ul className="mt-2 space-y-2 text-sm text-left">
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  All Starter Features
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Intermediate + Advanced Courses
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Live Chart Analysis (3x/Week)
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Daily doubt session
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Direct Mentor Support
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Premium community access
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Real-time market experience
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Dedicated psychology program
                </li>
              </ul>
              <div className="w-1/2 h-4 bg-[#ddd] absolute bottom-0 left-0 rounded-b-2xl bg-gradient-to-r from-[#7B8FA3] to-blue-200"></div>

              <div className="absolute bottom-1 right-2 rounded-full ">
                <img src="/assets/landing/featured-courses/2.png" className="w-12 h-12" />
              </div>
            </div>

            {/* Right Card */}
            <div className="relative rounded-2xl py-11 px-9 shadow-md hover:shadow-xl transition-all duration-300 bg-orange-300 max-w-[360px]
+                 shrink-0 min-w-[300px] sm:min-w-[360px] lg:min-w-0 snap-center">
              <div className="absolute top-0 right-0  overflow-hidden rounded-tr-2xl">
                <Image
                  src="/assets/landing/plans/3.png"
                  alt="Advance Plan"
                  width={121}
                  height={166}
                  className="object-cover"
                />
              </div>
              <h3 className="lg:text-xl text-xl mb-3.5 font-semibold">Offline course </h3>
              <p className="text-gray-700 mb-4">
                For Dedicated Learners Seeking Full Trading Growth
              </p>
              <p className="text-xl font-semibold mb-6">
                ₹29,500 {" "}
                <span className="text-gray-500 text-sm line-through">
                  ₹64,999
                </span>
              </p>
              <Link href="/courses/course-details/w7ru2um7ouxua9yxsw7c81i8">
                <button className="flex items-center justify-between bg-white px-4 py-1 lg:text-md text-md mb-6 w-full rounded-full shadow hover:scale-105 transition">
                  <span className="text-gray-800 ">Get Started</span>
                  <img src="/assets/landing/plans/red-arrow.png" className="w-9 h-9" />
                </button>
              </Link>
              <p className="text-gray-700 mb-3">what’s Include :</p>
              <ul className="mt-2 space-y-2 text-sm text-left">
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Real-time doubt solution
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  1-On-1 Mentorship
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Trade Review & Feedback
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Career orientation
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Entry/Exit Strategy Templates
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheck size={22} className="fill-black text-white " />{" "}
                  Real-time psychology development
                </li>
              </ul>
              <div className="w-1/2 h-4 bg-[#ddd] absolute bottom-0 left-0 rounded-b-2xl bg-gradient-to-r from-[#B36A42] to-orange-300"></div>

              <div className="absolute bottom-1 right-2 rounded-full ">
                <img src="/assets/landing/featured-courses/2.png" className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
