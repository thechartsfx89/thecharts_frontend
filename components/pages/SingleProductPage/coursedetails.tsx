// app/courses/[id]/CourseDetails.tsx
'use client';

import { TheChartsMark } from '@/components/pages/Landing/logo';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CourseForm } from './courseform';
import { useCart } from '@/app/context/cart-context';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { addToCart } from '@/store/cartSlice';
import { showToast } from '@/utils/toast';
import { getImageUrl } from '@/utils/common/common';

// Assuming you have an icon library like Lucide React or Heroicons
import { Star, Users, Award, Clock, Play, CheckCircle, BookOpen, MessageSquare, ChevronDown } from 'lucide-react'; // Added BookOpen and MessageSquare for tabs
import AuthModals from '@/component/auth/authModal';
import { useSession } from 'next-auth/react';
import IconLoader from '@/components/icon/icon-loader';


export type Lesson = {
    id: string;
    title: string;
    length: number; // seconds
    poster?: string;
    description?: string;
};

export type Playlist = {
    rows: Lesson[];
    count: number;
};

export type CourseModule = {
    id: number;
    documentId?: string;
    title: string;
    order: number;
    description?: string | null;
    playlist?: Playlist;
    course_resources_title?: string | null;
    course_resources_desc?: string | null;
    course_progress?: number | null;
    thumbnail_img_path?: string | null;
};

export type CourseAPI = {
    id: number;
    documentId?: string;

    course_title?: string;
    course_desc?: string;
    course_price?: number;
    video_url?: string;

    course_thumbnail?: {
        url?: string;
    } | null;

    course_category?: {
        category_name?: string;
    } | null;

    teacher?: {
        teacher_name?: string;
    } | null;

    /** NEW: Structured curriculum */
    course_modules?: CourseModule[];
};

export default function CourseDetails(props: { price?: number; title?: string; desc?: string; img?: string; bg?: string; category?: string; documentId?: string }) {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { totalQuantity, cartItems } = useSelector((state: IRootState) => state.cart);
    const [course, setCourse] = useState<CourseAPI>();
    console.log(course, '>>>>>>>> course details');
    const { data: session, status } = useSession();

    // showToast(totalQuantity, 'Total Items in Cart');
    //  const { totalQuantity } = useSelector((state: IRootState) => state.cart);
    const prevQuantity = useRef(totalQuantity);
    const alreadyInCart = cartItems.some(item => item.id == String(course?.id));
    // console.log(alreadyInCart, '>>>>>>>> alreadyInCart');
    const toastCardAlreadyInCart = () => {
        if (alreadyInCart) {
            showToast('info', 'Course already in cart!');
        }
    }
    useEffect(() => {
        if (totalQuantity > prevQuantity.current) {
            // quantity increased → show toast
            showToast('success', 'Course added to cart!',);
        }


        prevQuantity.current = totalQuantity;
    }, [totalQuantity, alreadyInCart]);





    const { addItem } = useCart();


    const routeId = (params as any)?.id as string | undefined; // /courses/[id]
    // const [course, setCourse] = useState<CourseAPI>();
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'about' | 'lessons' | 'reviews'>('about'); // Added state for active tab
    const [openModal, setOpenModal] = useState<"login" | "signup" | "forgot" | null>(null);

    const documentId = props.documentId || routeId;

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const q = documentId ? `?documentId=${encodeURIComponent(documentId)}` : '';
                const res = await fetch(`/api/courses/${documentId}`, {
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
                setLoading(false)
            }
        };

        fetchCourse();

    }, [documentId]);

    const [isPurchased, setIsPurchased] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [checkingPurchase, setCheckingPurchase] = useState(false);

    useEffect(() => {
        if (!documentId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // // 1. Fetch Course Details
                // const courseRes = await fetch(`//api/courses/${documentId}`, { cache: 'no-store' });
                // const courseResult = await courseRes.json();
                // setCourse(courseResult.data ?? null);

                // 2. Check if already purchased (Only if user is logged in)
                if (status === "authenticated") {
                    setCheckingPurchase(true);
                    const purchaseRes = await fetch(`/api/courses/enroll/restrict-duplicate?courseId=${documentId}`);
                    const purchaseResult = await purchaseRes.json();
                    setIsPurchased(purchaseResult?.isPurchased ?? false);
                    setPaymentData(purchaseResult?.payment ?? null);
                }
            } catch (e) {
                console.error('Failed to load data:', e);
                // setCourse({} as CourseAPI);
            } finally {
                setLoading(false);
                setCheckingPurchase(false);
            }
        };

        fetchData();
    }, [documentId, status]); // Re-run if login status changes

    // Map API -> UI with prop fallbacks
    const title = course?.course_title ?? props.title ?? 'Untitled Course';
    const desc = course?.course_desc ?? props.desc ?? '';
    const price = course?.course_price ?? props.price ?? 0;
    const category = course?.course_category?.category_name ?? props.category ?? 'General';
    const videoUrl = course?.video_url;

    const rawThumb = course?.course_thumbnail?.url || props?.img || "";

    const img = rawThumb ? (rawThumb.startsWith('http') ? rawThumb : getImageUrl(rawThumb)) : '/assets/landing/courses/6.png';

    const priceText = useMemo(() => `₹ ${Number(price || 0).toLocaleString('en-IN')}`, [price]);

    const courseId = (course?.documentId || documentId || String(course?.id || title)).toString();

    const handleAddToCart = () => {
        addItem(
            {
                id: courseId,
                title,
                price: Number(price || 0),
                image: img,
                category,
                course_desc: course?.course_desc || desc || "", // 👈 add


            },
            1,
        );
    };
    const product = {
        id: courseId,
        name: title,
        price: Number(price || 0),
        image: img,
        quantity: 1,
    };

    const handleBuyNow = () => {
        dispatch(addToCart(course as any))
        router.push('/cart');
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="mb-6 h-10 w-2/3 animate-pulse rounded-xl bg-slate-100" />
                <div className="aspect-video animate-pulse rounded-3xl bg-slate-100" />
            </div>
        );
    }


    const onSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/courses/enroll", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    course: documentId,
                    // user: data.user, // optional if backend uses token
                    // purchased_date: new Date().toISOString(),
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Enrollment failed");
            }

            showToast("success", "Proceed to Payment");
            router.push(`/checkout/${documentId}`);

        } catch (error: any) {
            console.error(error);
            showToast("error", error.message || "Something went wrong");
        } finally {
            setLoading(false);

        }
    };
    const formatDuration = (seconds: number = 0) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const moduleCount = course?.course_modules?.length || 0;

    const lectureCount =
        course?.course_modules?.reduce(
            (total, module) => total + (module.playlist?.count || 0),
            0
        ) || 0;

    return (
        <div className="bg-white">
            <AuthModals openModal={openModal} onClose={() => setOpenModal(null)} isMobile={true} />

            {/* Header Section */}
            <section className="tc-grid-bg relative overflow-hidden bg-[#0b1b33] text-white">
                <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#16c75f]/20 blur-3xl" />
                <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:pb-24">
                    <div className="lg:w-2/3 lg:pr-8">
                        <span className="inline-block rounded-full bg-[#16c75f]/15 px-3 py-1 text-sm font-semibold capitalize text-[#16c75f]">{category}</span>
                        <h1 className="tc-serif mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">{title}</h1>

                        {/* Rating and Stats */}
                        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/75">
                            <div className="flex items-center gap-2">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <span className="font-medium">4.8 (2,500 reviews)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={16} />
                                <span>5,000+ Enrolled</span>
                            </div>
                        </div>

                        {/* Instructor */}
                        <div className="mt-8 flex items-center gap-3">
                            <TheChartsMark className="h-11 w-11" dark />
                            <div>
                                <p className="font-semibold">The Charts</p>
                                <p className="text-sm text-white/60">Vision To reality</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:gap-12 lg:px-8 lg:py-14">

                {/* LEFT SIDE */}
                <div className="min-w-0 lg:col-span-2">

                    {/* Tabs */}
                    <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-1.5" role="tablist">
                        {([
                            { id: 'about', label: 'About', icon: BookOpen },
                            { id: 'lessons', label: 'Lessons', icon: Play },
                            { id: 'reviews', label: 'Reviews', icon: MessageSquare },
                        ] as const).map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold transition sm:text-base ${activeTab === tab.id ? 'bg-[#0b1b33] text-white shadow-lg shadow-slate-900/20' : 'text-slate-600 hover:bg-white hover:text-[#0b1b33]'}`}
                            >
                                <tab.icon size={17} className={activeTab === tab.id ? 'text-[#16c75f]' : ''} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="mt-8">
                        {activeTab === 'about' && (
                            <div>
                                <h3 className="tc-serif text-2xl font-black text-[#0b1b33]">Course Overview</h3>
                                <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">{desc}</p>
                            </div>
                        )}

                        {activeTab === 'lessons' && (
                            <div>
                                <h3 className="tc-serif mb-6 text-2xl font-black text-[#0b1b33]">
                                    Course Curriculum
                                </h3>

                                <div className="space-y-3">
                                    {course?.course_modules?.length ? (
                                        course.course_modules
                                            .sort((a, b) => a.order - b.order)
                                            .map((module) => {
                                                return (
                                                    <details
                                                        key={module.id}
                                                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition open:border-[#16c75f]/50 open:shadow-lg open:shadow-slate-900/5"
                                                    >
                                                        {/* MODULE HEADER */}
                                                        <summary className="flex cursor-pointer list-none flex-col items-start justify-between gap-2 p-5 lg:flex-row lg:items-center [&::-webkit-details-marker]:hidden">
                                                            <div className="flex items-start gap-3">
                                                                <ChevronDown
                                                                    size={18}
                                                                    className="mt-1 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                                                                />

                                                                <div>
                                                                    <h4 className="font-bold text-[#0b1b33] lg:text-lg">
                                                                        {module.title}
                                                                    </h4>

                                                                    {module.description && (
                                                                        <p className="mt-1 text-sm text-slate-500">
                                                                            {module.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <p className="ml-7 shrink-0 rounded-full bg-[#e9f8ef] px-3 py-1 text-xs font-semibold text-[#0e9f4a] lg:ml-0">
                                                                {module.playlist?.count || 0} lessons
                                                            </p>
                                                        </summary>

                                                        {/* LESSON LIST */}
                                                        <div className="border-t border-slate-100">
                                                            {module.playlist?.rows?.length ? (
                                                                module.playlist.rows.map((lesson, index) => (
                                                                    <div
                                                                        key={lesson.id}
                                                                        className="flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-slate-50"
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <Play size={15} className="shrink-0 text-[#0e9f4a]" />
                                                                            <span className="font-medium text-[#0b1b33]">
                                                                                {index + 1}. {lesson.title}
                                                                            </span>
                                                                        </div>

                                                                        <span className="shrink-0 text-sm text-slate-500">
                                                                            {formatDuration(lesson.length)}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="px-5 py-3 text-sm text-slate-500">
                                                                    No lessons available in this module.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </details>
                                                );
                                            })
                                    ) : (
                                        <p className="text-slate-500">No modules available.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div>
                                <h3 className="tc-serif mb-6 text-2xl font-black text-[#0b1b33]">Student Reviews</h3>
                                <div className="space-y-4">
                                    {/* Placeholder reviews - replace with actual data if available */}
                                    {[
                                        { name: "Tushant Bhoi", rating: 5, comment: "Excellent course! Learned a lot.", date: "2 weeks ago" },
                                        { name: "Yashoda Chauhan", rating: 4, comment: "Great content, but could use more examples.", date: "1 month ago" },
                                        { name: "Yash Jain", rating: 5, comment: "Highly recommend for beginners.", date: "3 weeks ago" },
                                    ].map((review, index) => (
                                        <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0b1b33] font-bold text-[#16c75f]">
                                                    {review.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[#0b1b33]">{review.name}</p>
                                                    <div className="flex items-center gap-0.5">
                                                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" className="text-amber-400" />)}
                                                    </div>
                                                </div>
                                                <p className="ml-auto text-sm text-slate-400">{review.date}</p>
                                            </div>
                                            <p className="mt-3 leading-relaxed text-slate-600">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDEBAR: lifts into the navy band on desktop, sits above the tabs on mobile */}
                <div className="relative z-10 order-first lg:order-none lg:-mt-64">
                    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/15 lg:sticky lg:top-24">

                        {/* Thumbnail */}
                        <Image
                            src={img}
                            alt={title}
                            width={500}
                            height={300}
                            className="aspect-[16/10] w-full rounded-2xl object-cover"
                        />

                        {/* Price */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Course Price</p>
                            <p className="tc-serif mt-1 text-4xl font-black text-[#0b1b33]">{priceText}</p>
                            <p className="mt-1 text-sm text-slate-500">One-time payment</p>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3">
                            {isPurchased && <div>
                                <span className="text-sm text-slate-600">Click here: </span>
                                <button
                                    type="button"
                                    className="text-sm font-semibold text-[#0e9f4a] underline"
                                    onClick={() => {
                                        if (status === "unauthenticated") {
                                            setOpenModal(null);
                                            setTimeout(() => setOpenModal("login"), 10);
                                        } else {
                                            router.push('/dash/student/billing');
                                        }
                                    }}> View Payment Status</button>
                            </div>}
                            <button
                                type="button"
                                disabled={loading || checkingPurchase || isPurchased}
                                onClick={() => {
                                    if (status === "unauthenticated") {
                                        setOpenModal(null);
                                        setTimeout(() => setOpenModal("login"), 10);
                                    } else {
                                        if (!documentId) {
                                            return showToast("error", "Something Went Wrong");
                                        }
                                        onSubmit();
                                    }
                                }}
                                className={`w-full rounded-xl py-4 font-semibold transition ${isPurchased
                                    ? "cursor-not-allowed bg-slate-300 text-white"
                                    : "bg-[#16c75f] text-[#0b1b33] shadow-lg shadow-[#16c75f]/25 hover:-translate-y-0.5 hover:bg-[#2fe079]"
                                    }`}
                            >
                                {loading || checkingPurchase ? (
                                    <>
                                        <IconLoader className="inline-block shrink-0 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2" />
                                        Loading...
                                    </>
                                ) : isPurchased ? (
                                    "Already Enrolled"
                                ) : (
                                    "Enroll Now"
                                )}
                            </button>
                            <p className="text-center text-sm text-slate-500">30-day money-back guarantee</p>
                        </div>

                        {/* Course Features */}
                        <ul className="space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-700">
                            <li className="flex items-center gap-3">
                                <Clock className="shrink-0 text-[#0e9f4a]" size={18} />
                                <span>{moduleCount ?? 0} Modules</span>
                                <span>{lectureCount ?? 0} Lecture</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Award className="shrink-0 text-[#0e9f4a]" size={18} />
                                <span>Certificate of Completion</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Users className="shrink-0 text-[#0e9f4a]" size={18} />
                                <span>Lifetime Access</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
