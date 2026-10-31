"use client"
import CartPage from '@/components/pages/Cart/cart'
import Footer from '@/components/pages/Footer/footer'
import Header from '@/components/pages/Header/header'
import React, { useEffect, useState } from 'react'
import HeaderLanding from '../../dashboard/landing/headerLanding';
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
  <div className="relative min-h-screen flex flex-col overflow-hidden">

    {/* ===== Background Layer ===== */}
    <div className="absolute inset-0 -z-10">
      <div className="h-full w-full bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat dark:bg-[#060818]" />

      <img
        src="/assets/images/auth/bg-gradient.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <img
        src="/assets/images/auth/coming-soon-object1.png"
        className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2"
      />
      <img
        src="/assets/images/auth/coming-soon-object2.png"
        className="absolute left-24 top-0 h-40 md:left-[30%]"
      />
      <img
        src="/assets/images/auth/coming-soon-object3.png"
        className="absolute right-0 top-0 h-[300px]"
      />
      <img
        src="/assets/images/auth/polygon-object.svg"
        className="absolute bottom-0 end-[28%]"
      />
    </div>

    {/* ===== Header ===== */}
    <div className="relative z-20">
      <HeaderLanding />
    </div>

    {/* ===== Main Content (IMPORTANT CHANGE) ===== */}
    <main className="relative z-10 flex-1 flex justify-center px-4 lg:py-16 lg:px-6">
      <div
        className="w-full max-w-7xl rounded-md
        bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,#fff9f9_100%)]
        p-2
        dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]"
      >
        <PaymentForm course={course} />
      </div>
    </main>

    {/* ===== Footer ===== */}
    <div className="relative z-20 bg-white/60 dark:bg-black/30 backdrop-blur-md border-t">
      <Footer />
    </div>

  </div>
);

}

export default Checkout
