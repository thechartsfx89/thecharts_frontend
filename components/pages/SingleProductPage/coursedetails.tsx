// app/courses/[id]/CourseDetails.tsx
'use client';

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
            <div className="container mx-auto lg:py-24 py-5 lg:px-0 px-2.5">
                <div className="animate-pulse h-8 w-2/3 bg-gray-100 rounded mb-6" />
                <div className="aspect-video bg-gray-100 rounded-xl" />
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
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8 md:py-12">
            <AuthModals openModal={openModal} onClose={() => setOpenModal(null)} isMobile={true} />

            <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

                {/* LEFT SIDE */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">

                    {/* Header Section */}
                    <div className="panel rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-purple-100 text-purple-600 px-3 md:px-4 py-2 rounded-full text-sm font-medium">
                                {category}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">{title}</h1>

                        {/* Rating and Stats */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                                </div>
                                <span className="text-gray-600 font-medium text-sm md:text-base">4.8 (2,500 reviews)</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Users size={18} />
                                <span className="text-sm md:text-base">5,000+ Enrolled</span>
                            </div>
                        </div>

                        {/* Instructor */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-14 md:w-14 h-14 md:h-14 border border-2 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl ">

                                <Image src="/assets/images/auth/logo-mob.png" className="w-full h-full" alt="logo" width={80} height={60} style={{ width: '46px', height: "36px", marginBottom: "7px" }} />

                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm md:text-base">Educandle</p>
                                <p className="text-gray-600 text-xs md:text-sm">Vision To reality</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="panel rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8">
                        <div className="flex gap-4 md:gap-8 border-b border-gray-200 mb-6 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('about')}
                                className={`pb-3 font-semibold text-base md:text-lg whitespace-nowrap transition-colors ${activeTab === 'about' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <BookOpen className="inline mr-2" size={18} />
                                About
                            </button>
                            <button
                                onClick={() => setActiveTab('lessons')}
                                className={`pb-3 font-semibold text-base md:text-lg whitespace-nowrap transition-colors ${activeTab === 'lessons' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Play className="inline mr-2" size={18} />
                                Lessons
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`pb-3 font-semibold text-base md:text-lg whitespace-nowrap transition-colors ${activeTab === 'reviews' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <MessageSquare className="inline mr-2" size={18} />
                                Reviews
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-6">
                            {activeTab === 'about' && (
                                <>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Course Overview</h3>
                                        <p className="text-gray-700 leading-relaxed text-base md:text-lg">{desc}</p>
                                    </div>


                                </>
                            )}



                            {activeTab === 'lessons' && (
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                                        Course Curriculum
                                    </h3>

                                    <div className="space-y-4">
                                        {course?.course_modules?.length ? (
                                            course.course_modules
                                                .sort((a, b) => a.order - b.order)
                                                .map((module) => {
                                                    const totalDuration =
                                                        module.playlist?.rows?.reduce(
                                                            (sum, lesson) => sum + lesson.length,
                                                            0
                                                        ) || 0;

                                                    return (
                                                        <details
                                                            key={module.id}
                                                            className="group rounded-xl border border-gray-200 bg-white"
                                                        >
                                                            {/* MODULE HEADER */}
                                                            <summary className="flex cursor-pointer list-none items-start lg:items-center justify-between p-4 flex-col lg:flex-row ">
                                                                <div className="flex items-start gap-3">
                                                                    <ChevronDown
                                                                        size={18}
                                                                        className="mt-1 text-gray-500 transition-transform group-open:rotate-180"
                                                                    />

                                                                    <div>
                                                                        <h4 className="text-base lg:text-lg font-semibold text-gray-900">
                                                                            {module.title}
                                                                        </h4>

                                                                        {module.description && (
                                                                            <p className="text-xs lg:text-sm text-gray-500 mt-1">
                                                                                {module.description}
                                                                            </p>
                                                                        )}


                                                                    </div>
                                                                </div>
                                                                <p className="text-xs lg:text-sm text-dark mt-1 ml-7 lg:ml-0  font-semibold">
                                                                    {module.playlist?.count || 0} lessons {" "}
                                                                    {/* {formatDuration(totalDuration)} */}
                                                                </p>
                                                            </summary>

                                                            {/* LESSON LIST */}
                                                            <div className="border-t border-gray-100">
                                                                {module.playlist?.rows?.length ? (
                                                                    module.playlist.rows.map((lesson, index) => (
                                                                        <div
                                                                            key={lesson.id}
                                                                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <Play size={16} className="text-purple-600" />
                                                                                <span className="text-gray-900 font-medium">
                                                                                    {index + 1}. {lesson.title}
                                                                                </span>
                                                                            </div>

                                                                            <span className="text-sm text-gray-500">
                                                                                {formatDuration(lesson.length)}
                                                                            </span>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="px-4 py-3 text-sm text-gray-500">
                                                                        No lessons available in this module.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </details>
                                                    );
                                                })
                                        ) : (
                                            <p className="text-gray-500">No modules available.</p>
                                        )}
                                    </div>
                                </div>
                            )}





                            {activeTab === 'reviews' && (
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Student Reviews</h3>
                                    <div className="space-y-6">
                                        {/* Placeholder reviews - replace with actual data if available */}
                                        {[
                                            { name: "Tushant Bhoi", rating: 5, comment: "Excellent course! Learned a lot.", date: "2 weeks ago" },
                                            { name: "Yashoda Chauhan", rating: 4, comment: "Great content, but could use more examples.", date: "1 month ago" },
                                            { name: "Yash Jain", rating: 5, comment: "Highly recommend for beginners.", date: "3 weeks ago" },
                                        ].map((review, index) => (
                                            <div key={index} className="p-4 bg-gray-50 rounded-xl">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-600 font-bold">
                                                        {review.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{review.name}</p>
                                                        <div className="flex items-center gap-1">
                                                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" className="text-yellow-400" />)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 mb-2">{review.comment}</p>
                                                <p className="text-gray-500 text-sm">{review.date}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                </div>

                {/* RIGHT SIDEBAR */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 space-y-6">

                        {/* Thumbnail */}
                        <div className="relative">
                            <Image
                                src={img}
                                alt={title}
                                width={500}
                                height={300}
                                className="rounded-xl md:rounded-2xl w-full object-cover shadow-md"
                            />

                        </div>

                        {/* Course Features */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Clock className="text-purple-600 flex-shrink-0" size={18} />
                                <span className="text-gray-700 text-sm md:text-base">
                                    {moduleCount ?? 0} {" "}
                                    Modules </span>

                                <span className="text-gray-700 text-sm md:text-base">
                                    {lectureCount ?? 0} {" "}
                                    Lecture </span>

                            </div>
                            <div className="flex items-center gap-3">
                                <Award className="text-purple-600 flex-shrink-0" size={18} />
                                <span className="text-gray-700 text-sm md:text-base">Certificate of Completion</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="text-purple-600 flex-shrink-0" size={18} />
                                <span className="text-gray-700 text-sm md:text-base">Lifetime Access</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
                            <p className="text-gray-600 text-xs md:text-sm uppercase tracking-wide">Course Price</p>
                            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-600 mt-2">{priceText}</p>
                            <p className="text-gray-500 text-xs md:text-sm mt-1">One-time payment</p>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3">
                            {/* <button
                                onClick={() => {
                                    // dispatch(addToCart(course as any));

                                    if (status === "unauthenticated") {
                                        setOpenModal(null);
                                        setTimeout(() => setOpenModal("login"), 10);
                                    } else {
                                        if (!documentId) {
                                            return showToast("error", "Something Went Wrong")
                                        }
                                        onSubmit();
                                    }
                                }}

                                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base"
                            >
                                {loading ?
                                    <> <IconLoader className="inline-block shrink-0 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2" />Loading...</> :
                                    "Enroll Now"
                                }

                            </button> */}
                            {isPurchased &&<div>
                                <span className='text-sm'>Click here: </span>
                            <span className="text-purple-600">
                                <button
                                className='text-sm font-medium underline'
                                 onClick={() => {
                                    if (status === "unauthenticated") {
                                        setOpenModal(null);
                                        setTimeout(() => setOpenModal("login"), 10);
                                    } else {
                                        router.push('/dash/student/billing');
                                    }
                                }}> View Payment Status</button></span>
                            </div>}
                            <button
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
                                className={`w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold transition-all duration-300 text-sm md:text-base transform 
        ${isPurchased
                                        ? "bg-gray-400 text-white cursor-not-allowed shadow-none"
                                        : "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl hover:-translate-y-1"
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
                        </div>

                        {/* Guarantee */}
                        <div className="text-center text-gray-600 text-xs md:text-sm">
                            <p>30-day money-back guarantee</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}