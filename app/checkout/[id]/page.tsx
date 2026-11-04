"use client"
import React, { useEffect, useState } from 'react'
import { TcPage } from '@/components/pages/Landing/page-shell';
import PaymentForm from '@/components/pages/checkout/PaymentForm';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
type CourseAPI = {
  id: number;
  documentId?: string;
  course_title?: string;
  course_desc?: string;
  course_price?: number;
  video_url?: string;
  course_thumbnail?: { url?: string } | null | any;
  course_category?: { category_name?: string } | any;
  teacher?: { teacher_name?: string } | any;
};
const Checkout = (props: { price?: number; title?: string; desc?: string; img?: string; bg?: string; category?: string; documentId?: string }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log({ status })
  const [course, setCourse] = useState<CourseAPI>();
  const params = useParams();
  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/auth/register");
    }
  }, [])

  // const routeId = (params as any)?.id as string | undefined; // /courses/[id]
  // const [course, setCourse] = useState<CourseAPI>();
  const [loading, setLoading] = useState<boolean>(true);

  const documentId = (params as any)?.id as string | undefined;

  useEffect(() => {
    let ignore = false;
    const fetchCourse = async () => {
      try {
        const q = documentId ? `?documentId=${encodeURIComponent(documentId)}` : '';
        const res = await fetch(`/api/courses/nominal/${documentId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        const { data } = await res.json();
        setCourse(data ?? null);
      } catch (e) {
        console.error('Failed to load course:', e);
        setCourse({} as CourseAPI);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
    return () => {
      ignore = true;
    };
  }, [documentId]);
return (
  <TcPage>
    <section className="bg-gradient-to-b from-white to-[#f3fbf6] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <PaymentForm course={course} />
      </div>
    </section>
  </TcPage>
);

}

export default Checkout
