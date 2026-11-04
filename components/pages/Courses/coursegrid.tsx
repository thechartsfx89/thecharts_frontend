"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CourseCard from "./coursecard";
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
    [...Array(6)].map((_, i) => (
      <div key={i} className="h-[420px] animate-pulse rounded-3xl bg-slate-100" />
    ));

  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? renderSkeleton()
          : courses.map((course: any, index: number) => (
              <Link href={`/courses/course-details/${course?.documentId}`} key={index} className="h-full">
                <CourseCard
                  price={course?.course_price}
                  category={course?.course_category?.category_name}
                  title={course?.course_title}
                  desc={course?.course_desc}
                  img={course?.course_thumbnail?.url}
                  feedback={course?.feedback}
                  length={course?.length}
                  offline_course={course?.offline_course}
                />
              </Link>
            ))}
      </div>
      {!loading && courses.length === 0 && <NoDataComponent />}
    </section>
  );
}
