"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CourseCard from "./coursecard";
import CourseFilter from "./course-filter";
import NoDataComponent from "@/utils/common/noDataComponent";

export default function CoursesGrid() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses", { headers: { "Content-Type": "application/json" } });
        const { data } = await res.json();
        if(res?.ok && res.status === 200) {
        setCourses(data || []);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const renderSkeleton = () =>
    [...Array(8)].map((_, i) => (
      <div key={i} className="panel h-full overflow-hidden border-0 p-0 bg-white animate-pulse rounded-lg">
        <div className="min-h-[190px] w-full bg-gray-200 dark:bg-dark-light" />
        <div className="p-5 space-y-4">
          <div className="h-5 bg-gray-200 dark:bg-dark-light rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-dark-light rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-dark-light rounded w-5/6" />
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 dark:bg-dark-light rounded-full" />
              <div className="h-3 w-16 bg-gray-200 dark:bg-dark-light rounded" />
            </div>
            <div className="h-3 w-8 bg-gray-200 dark:bg-dark-light rounded" />
          </div>
        </div>
      </div>
    ));



  return (
    <section className="lg:py-2 py-2.5 xl:px-10 lg:px-2.5 px-2.5">
      <div className="container mx-auto">
        {/* <CourseFilter /> */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5 lg:gap-5 gap-5 lg:mt-14 mt-0">
          {loading
            ? renderSkeleton()
            : courses.length > 0
              ? courses.map((course: any, index: number) => (
                <Link href={`/courses/course-details/${course?.documentId}`} key={index} className="h-full">
                  <CourseCard
                    price={course?.course_price}
                    category={course?.course_category?.category_name}
                    title={course?.course_title}
                    desc={course?.course_desc}
                    img={course?.course_thumbnail?.url}
                    bg={course?.bg}
                    gst={course?.gst}
                    feedback={course?.feedback}
                    length={course?.length}
                    offline_course={course?.offline_course}
                    className="h-full"
                  />
                </Link>
              ))
              : null}
        </div>
        {!loading && courses.length === 0 && <NoDataComponent />}
        {/* Pagination / Controls Placeholder */}
        <div className="flex justify-center lg:py-24 py-5 gap-2.5"></div>
      </div>
    </section>
  );
}
