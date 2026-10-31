'use client';

import IconCaretsDown from '@/components/icon/icon-carets-down';
import { IRootState } from '@/store';
import Image from 'next/image';
import Link from 'next/link';
import { lazy, Suspense, useEffect, useState } from "react";
// import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '@/store/themeConfigSlice';
import IconMenu from '@/components/icon/icon-menu';
import IconLogout from '@/components/icon/icon-logout';
import IconUser from '@/components/icon/icon-user';
import IconMail from '@/components/icon/icon-mail';
import IconLockDots from '@/components/icon/icon-lock-dots';
import Dropdown from '@/components/dropdown';
import IconWallet from '@/components/icon/icon-wallet';
import IconShoppingCart from '@/components/icon/icon-shopping-cart';
import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard';
import {
    Home, // for Home
    BookOpen, // for Blogs
    GraduationCap, // for Courses
    Info,
    LogIn,
    UserPlus,
    Calendar1,
    ContactRound,
    GitGraph, // for About
} from 'lucide-react';
import CoursesDropdown from '@/component/Dropdown/coursesdropdown';
import AuthModals from '@/component/auth/authModal';
import IconCart from '@/components/icon/icon-cart';
import { signOut, useSession } from 'next-auth/react';
import IconLogin from '@/components/icon/icon-login';
import { getImageUrl, getRandomColor, getTextColor } from '@/utils/common/common';
// import IconCart from '@/components/icon/icon-cart';
const Login = lazy(() => import("@/component/auth/login"));
const Signup = lazy(() => import("@/component/auth/signup"));

export default function HeaderLanding() {
    const dispatch = useDispatch();
    const { data: session, status } = useSession<any>();
    const { totalQuantity } = useSelector((state: IRootState) => state.cart);
    console.log({ session, status })
    const [toggle, setToggle] = useState<boolean>(false);
    const [toggleReg, setToggleReg] = useState<boolean>(false);

    const [currentMenu, setCurrentMenu] = useState<string>('');

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);
    const [toggleLogin, setToggleLogin] = useState(false);
    const [openAuth, setOpenAuth] = useState(false);
    const [openModal, setOpenModal] = useState<"login" | "signup" | "forgot" | null>(null);
    //   const [toggleReg, setToggleReg] = useState(false);
    return (
        <>
            <header
                className="
    hidden lg:block
    sticky top-0 z-40
    backdrop-blur-xl
    bg-white/70
    border-b border-white/30
    shadow-[0_8px_30px_rgb(0,0,0,0.04)]
    xl:px-10 lg:px-2.5 px-2.5
    border-b border-white/30
  ">
                <div className="container mx-auto ">
                    <div className="flex justify-between items-center ">
                        <div className="flex items-center">
                            <Link href="/">
                                <div className=" flex items-center">
                                    <Image src="/assets/images/auth/logo-mob.png" className="w-full h-full" alt="logo" width={180} height={100} style={{ width: '80px' }} />
                                    <div className='flex flex-col justify-center items-center'>
                                        <span className='font-bold text-2xl text-dark'>EduCandle</span>
                                        <span className='text-xs'>Vision to Reality</span>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <nav className="hidden md:flex space-x-8">
                            <Link href="/" className="text-gray-900 hover:text-green-600 px-3 py-2 text-lg font-medium font-extrabold">
                                Home
                            </Link>
                            <Link href="/about" className="text-gray-700 hover:text-green-600 px-3 py-2 text-lg font-medium">
                                About us
                            </Link>

                            <Link href="/blogs" className="text-gray-700 hover:text-green-600 px-3 py-2 text-lg font-medium">
                                Blogs
                            </Link>
                            <Link href="/courses" className="text-gray-700 hover:text-green-600 px-3 py-2 text-lg font-medium group">
                                All Courses


                            </Link>
                            <Link href="/contact" className="text-gray-700 hover:text-green-600 px-3 py-2 text-lg font-medium">
                                Contact us
                            </Link>
                            {/* <Link href="./forexfactory.com/calendar" className="text-gray-700 hover:text-green-600 px-3 py-2 text-lg font-medium">
                                Calendar
                            </Link> */}
                            <a
                                href="https://www.forexfactory.com/calendar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:text-green-600 px-3 py-2 text-lg font-medium"
                            >
                                Calendar
                            </a>

                            <Link href="/live-charts" className="text-gray-700 hover:text-green-600 px-3 py-2 text-lg font-medium">
                                Live Charts
                            </Link>


                        </nav>

                        <div className="flex items-center space-x-4 py-4">
                            {/* <Link href="/cart">
                                <div className="flex items-center space-x-2 cursor-pointer">
                                    <IconCart count={totalQuantity ?? 0} className="text-gray-800 w-6 h-6" />
                                    <span className="text-sm font-medium">Cart</span>
                                </div>
                            </Link> */}
                            {!session ?


                                <AuthModals /> :
                                <>
                                    <Link
                                        href={
                                            session?.user?.role === "mentor"
                                                ? "/dash/mentor"
                                                : session?.user?.role === "student"
                                                    ? "/dash/affiliate"
                                                    :
                                                    session?.user?.role == "admin" ? `/dash/admin`
                                                        : "#"
                                        }
                                    >
                                        <button
                                            type="button"
                                            className="
                                           relative inline-flex items-center justify-center
                                           px-8 py-2.5 rounded-xl font-semibold
                                           text-slate-900 bg-white
                                           shadow-md
                                           overflow-hidden
                                           transition-transform duration-300
                                           hover:-translate-y-[1px]
                                         "
                                        >
                                            {/* moving border */}
                                            <span className="absolute inset-0 rounded-xl animate-spin-slow bg-gradient-to-r from-red-500 via-green-500 to-blue-500 p-[2px]">
                                                <span className="block w-full h-full rounded-[10px] bg-white"></span>
                                            </span>

                                            <span className="relative z-10">Dashboard</span>
                                        </button>
                                    </Link>

                                    <div className="dropdown flex shrink-0">
                                        <Dropdown
                                            offset={[0, 8]}
                                            // placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                            btnClassName="relative group block"
                                            // button={<img className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src={getImageUrl(session?.user?.profileImage)} alt="userProfile" />}
                                            button={
                                                (session?.user?.profileImage || session?.user?.profile_img_path) ? (
                                                    <img
                                                        // src={getImageUrl(user?.profile_image?.url)}
                                                        src={
                                                            session?.user?.profileImage
                                                                ? `${getImageUrl(session?.user?.profileImage)}?t=${Date.now()}`
                                                                : session?.user?.profile_img_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/${session?.user?.profile_img_path}` : "/assets/images/fallback-profile.png"
                                                        }
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        alt=""
                                                    />
                                                ) : (
                                                    <div
                                                        className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-[12px] uppercase"
                                                        style={{ backgroundColor: getRandomColor(session?.user?.id), color: getTextColor(getRandomColor(session?.user?.id)) }}
                                                    >
                                                        {session?.user?.fullName
                                                            ?.split(' ')
                                                            .map((name: any) => name[0])
                                                            .slice(0, 2)
                                                            .join('')}

                                                    </div>
                                                )}
                                        >
                                            <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                                <li>
                                                    <div className="flex items-center px-4 py-4">
                                                        {/* <img className="h-10 w-10 rounded-md object-cover" src={getImageUrl(session?.user?.profileImage)} alt="userProfile" /> */}
                                                        {(session?.user?.profileImage || session?.user?.profile_img_path) ? (
                                                            <img
                                                                // src={getImageUrl(user?.profile_image?.url)}
                                                                src={
                                                                    session?.user?.profileImage
                                                                        ? `${getImageUrl(session?.user?.profileImage)}?t=${Date.now()}`
                                                                        : session?.user?.profile_img_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/${session?.user?.profile_img_path}` : "/assets/images/fallback-profile.png"
                                                                }
                                                                className="h-10 w-10 rounded-full object-cover"
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <div
                                                                className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-[12px] uppercase"
                                                                style={{ backgroundColor: getRandomColor(session?.user?.id), color: getTextColor(getRandomColor(session?.user?.id)) }}
                                                            >
                                                                {session?.user?.fullName
                                                                    ?.split(' ')
                                                                    .map((name: any) => name[0])
                                                                    .slice(0, 2)
                                                                    .join('')}

                                                            </div>
                                                        )}
                                                        <div className="truncate ltr:pl-4 rtl:pr-4">
                                                            <h4 className="text-base">
                                                                {session?.user?.username || ''}

                                                                <span className="rounded bg-success-light px-1 text-xs text-success ltr:ml-2 rtl:ml-2">Pro</span>
                                                            </h4>
                                                            <button type="button" className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                                                                {session?.user?.email || ''}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <Link href="/dash/student/profile" className="dark:hover:text-white">
                                                        <IconUser className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                                        Profile
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href={session?.user?.role == "mentor" ? `/dash/mentor` : session?.user?.role == "student" ? `/dash/affiliate` : session?.user?.role == "admin" ? `/dash/admin` : "#"} className="dark:hover:text-white">
                                                        <IconLockDots className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                                        Dashboard
                                                    </Link>
                                                </li>
                                                {/* <li>
                                                    <Link href="/dash/users/user-account-settings" className="dark:hover:text-white">
                                                        <IconMail className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                                        Setting
                                                    </Link>
                                                </li> */}
                                                {/* <li>
                                                    <Link href="/auth/boxed-lockscreen" className="dark:hover:text-white">
                                                        <IconLockDots className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                                        Lock Screen
                                                    </Link>
                                                </li> */}

                                                <li onClick={() => signOut()} className="border-t border-white-light dark:border-white-light/10">
                                                    <Link href="/" className="!py-3 text-danger">
                                                        <IconLogout className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
                                                        Sign Out
                                                    </Link>
                                                </li>
                                            </ul>
                                        </Dropdown>
                                    </div></>}

                        </div>
                    </div>
                </div>
            </header>
            <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''} block lg:hidden z-40`}>
                <div className="shadow-sm">
                    <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
                        <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
                            <Link href="/" className="main-logo flex shrink-0 items-center">
                                <img className="inline w-8 ltr:-ml-1 rtl:-mr-1" src="/assets/images/auth/logo-mob.png" alt="logo" style={{ width: '3rem' }} />
                                <span className="hidden align-middle text-2xl  font-semibold  transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline"></span>
                            </Link>
                        </div>

                        <div className="hidden ltr:mr-2 rtl:ml-2 sm:block"></div>
                        <div className="flex items-center  justify-end space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2">

                            {!session ?

                                <>
                                    <AuthModals openModal={openModal} onClose={() => setOpenModal(null)} isMobile={true} />
                                    <div className="dropdown flex shrink-0 ">
                                        <Dropdown
                                            offset={[0, 8]}
                                            // placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                            btnClassName="relative group block"
                                            button={<img className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src={getImageUrl(session?.user?.profileImage)} alt="userProfile" />}
                                        >
                                            <ul className="w-[200px] font-semibold text-dark dark:text-white-dark px-4 py-4 space-y-2">

                                                <li>
                                                    <button
                                                        className="w-full text-left hover:text-green-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenModal(null);
                                                            setTimeout(() => setOpenModal("login"), 10);
                                                        }}
                                                    >

                                                        <IconLogin className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                                        Login
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="w-full text-left hover:text-green-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenModal(null);
                                                            setTimeout(() => setOpenModal("signup"), 10);
                                                        }}
                                                    >
                                                        <IconUser className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                                        Sign Up
                                                    </button>
                                                </li>
                                            </ul>
                                        </Dropdown>
                                    </div>
                                </>
                                :
                                <>
                                    {/* <Link href="/dash/analytics">
                                        <button type="button" className="btn-success hover:bg-green-600 text-white px-6 py-2 rounded-[15px] font-[600] font-bold">
                                            Dashboard
                                        </button>
                                    </Link> */}


                                    <div className="dropdown flex shrink-0">
                                        <Dropdown
                                            offset={[0, 8]}
                                            // placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                            btnClassName="relative group block"
                                            button={<img className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src={getImageUrl(session?.user?.profileImage)} alt="userProfile" />}
                                        >
                                            <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                                <li>
                                                    <div className="flex items-center px-4 py-4">
                                                        <img className="h-10 w-10 rounded-md object-cover" src={getImageUrl(session?.user?.profileImage)} alt="userProfile" />
                                                        <div className="truncate ltr:pl-4 rtl:pr-4">
                                                            <h4 className="text-base">
                                                                {session?.user?.username || ''}

                                                                <span className="rounded bg-success-light px-1 text-xs text-success ltr:ml-2 rtl:ml-2">Pro</span>
                                                            </h4>
                                                            <button type="button" className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                                                                {session?.user?.email || ''}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <Link href="/dash/student/profile" className="dark:hover:text-white">
                                                        <IconUser className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                                        Profile
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href={session?.user?.role == "mentor" ? `/dash/mentor` : session?.user?.role == "student" ? `/dash/affiliate` : session?.user?.role == "admin" ? `/dash/admin` : "#"} className="dark:hover:text-white">
                                                        <IconLockDots className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                                        Dashboard
                                                    </Link>
                                                </li>
                                                {/* <li>
                                                    <Link href="/dash/users/user-account-settings" className="dark:hover:text-white">
                                                        <IconMail className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                                        Setting
                                                    </Link>
                                                </li> */}
                                                <li onClick={() =>
                                                    signOut({
                                                        callbackUrl: "/", // redirect to home after logout
                                                    })
                                                } className="border-t border-white-light dark:border-white-light/10">
                                                    <Link href="#" className="!py-3 text-danger">
                                                        <IconLogout className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
                                                        Sign Out
                                                    </Link>
                                                </li>
                                            </ul>
                                        </Dropdown>
                                    </div></>}
                            <button
                                type="button"
                                className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
                                onClick={() => dispatch(toggleSidebar())}
                            >
                                <IconMenu className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className={semidark ? 'dark' : ''}>
                    <nav
                        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
                    >
                        <div className="h-full bg-white dark:bg-black">
                            <div className="flex items-center justify-between px-4 py-3">
                                <Link href="/" className="main-logo flex shrink-0 items-center width-10 hh">
                                    {themeConfig?.menu == 'collapsible-vertical' ? (
                                        <img className="inline w-8 ltr:-ml-1 rtl:-mr-1" src="/assets/images/auth/logo-mob.png" alt="logo" style={{ width: '3rem' }} />
                                    ) : (
                                        <div className="flex items-center">
                                            <Link href="/">
                                                <div className=" flex items-center">
                                                    <Image src="/assets/images/auth/logo-mob.png" className="w-full h-full" alt="logo" width={120} height={100} style={{ width: '50px' }} />
                                                    <div className='flex flex-col justify-center items-center'>
                                                        <span className='font-bold text-lg text-dark'>EduCandle</span>
                                                        <span className='text-xs' style={{ fontSize: "9px", marginTop: "-6px" }}>Vision to Reality</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                        // <img className="ml-[5px] w-8 flex-none" src="https://kooqxit.com/wp-content/uploads/2025/08/logo-removebg-preview.png" alt="logo" style={{ width: '8.7rem' }} />
                                    )}
                                    {/* <span className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">Educandle</span> */}
                                </Link>

                                <button
                                    type="button"
                                    className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                                    onClick={() => dispatch(toggleSidebar())}
                                >
                                    <IconCaretsDown className="m-auto rotate-90" />
                                </button>
                            </div>
                            <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                                <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
                                    <li className="nav-item">
                                        <Link href="/" className="group">
                                            <div className="flex items-center" onClick={() => dispatch(toggleSidebar())}>
                                                <Home className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Home</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <ul>
                                            <li className="nav-item" onClick={() => dispatch(toggleSidebar())}>
                                                <Link href="/about" className="group">
                                                    <div className="flex items-center">
                                                        <Info className="shrink-0 group-hover:!text-primary" />
                                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">About Us</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li className="nav-item" onClick={() => dispatch(toggleSidebar())}>
                                                <Link href="/blogs" className="group">
                                                    <div className="flex items-center">
                                                        <BookOpen className="shrink-0 group-hover:!text-primary" />
                                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Blogs</span>
                                                    </div>
                                                </Link>
                                            </li>

                                            <li className="nav-item">
                                                <Link href="/courses" className="group" onClick={() => dispatch(toggleSidebar())}>
                                                    <div className="flex items-center">
                                                        <GraduationCap className="shrink-0 group-hover:!text-primary" />
                                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">All Courses</span>
                                                    </div>
                                                </Link>
                                            </li>

                                            <li className="nav-item">
                                                <Link href="/contact" className="group" onClick={() => dispatch(toggleSidebar())}>
                                                    <div className="flex items-center">
                                                        <ContactRound className="shrink-0 group-hover:!text-primary" />
                                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Contact Us</span>
                                                    </div>
                                                </Link>
                                            </li>

                                            <li className="nav-item">
                                                <Link href="https://www.forexfactory.com/calendar" className="group" onClick={() => dispatch(toggleSidebar())}>
                                                    <div className="flex items-center">
                                                        <Calendar1 className="shrink-0 group-hover:!text-primary" />
                                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Calendar</span>
                                                    </div>
                                                </Link>
                                            </li>

                                            <li className="nav-item">
                                                <Link href="/live-charts" className="group" onClick={() => dispatch(toggleSidebar())}>
                                                    <div className="flex items-center">
                                                        <GitGraph className="shrink-0 group-hover:!text-primary" />
                                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Live charts</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </PerfectScrollbar>
                        </div>
                    </nav>
                </div>
            </header>
        </>
    );
}
