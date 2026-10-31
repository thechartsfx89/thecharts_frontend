"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function FeaturedCourses() {
  const courses = [
    {
      level: "Beginner",
      title: "Currency Pairs & Pips",
      desc: "Learn the basics of forex markets, key terms, and how trading works.",
      img: "/featured-courses/1.png", // put your images in /public/courses/
      bg: "bg-green-200",
    },
    {
      level: "Intermediate",
      title: "Technical Analysis Mastery",
      desc: "Master chart patterns, indicators, and price action strategies.",
      img: "/featured-courses/1.png",
      bg: "bg-blue-200",
    },
    {
      level: "Advanced",
      title: "Forex Strategy Blueprint",
      desc: "Build and test complete trading systems with defined rules.",
      img: "/featured-courses/1.png",
      bg: "bg-orange-300",
    },
    
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        {/* Title */}
        <h2 className="text-5xl font-extrabold mb-2">
          Featured <span className="text-green-600 italic font-normal font-mrs-saint text-[88px]">Courses</span>
        </h2>
        <p className="text-gray-600 mb-10 ">
          Kickstart your trading journey with essential knowledge of currency
          markets, pips, and trading platforms.
        </p>

        {/* Cards */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {courses.map((course, index) => (
            <div
              key={index}
              className={`${course.bg} rounded-4xl p-6 min-w-[320px] relative shadow-md`}
            >
              {/* Arrow button */}
              <button className="absolute top-4 left-4  ">
                <img src="/featured-courses/2.png" />
              </button>

              {/* Image */}
              <div className="flex justify-end mb-4">
                <img
                  src={course.img}
                  alt={course.title}
                  width={192}
                  height={80}
                  className="rounded-xl object-cover"
                />
              </div>

              {/* Level */}
              <span className="inline-block border border-black px-3 py-1 text-sm rounded-full mb-3">
                {course.level}
              </span>

              {/* Title */}
              <h3 className="text-2xl  mb-2">{course.title}</h3>

              {/* Description */}
              <p className="text-gray-700 text-sm">{course.desc}</p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="mt-6 h-2 bg-gray-200 rounded-full relative">
          <div className="absolute top-0 left-0 h-2 w-28 bg-black rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
