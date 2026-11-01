'use client';
import { TheChartsThemedLogo } from '@/components/pages/Landing/logo';
import { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { IRootState } from '@/store';
import { toggleSidebar, toggleRTL } from '@/store/themeConfigSlice';
import Dropdown from '@/components/dropdown';
import IconMenu from '@/components/icon/icon-menu';
import IconXCircle from '@/components/icon/icon-x-circle';
import IconInfoCircle from '@/components/icon/icon-info-circle';
import IconBellBing from '@/components/icon/icon-bell-bing';
import IconUser from '@/components/icon/icon-user';
import IconLogout from '@/components/icon/icon-logout';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import IconWallet from '../../icon/icon-wallet';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { getImageUrl, getRandomColor, getTextColor } from '@/utils/common/common';
import IconRestore from '../../icon/icon-restore';
import IconSettings from '../../icon/icon-settings';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from '@/api-constant';
import apiService from '@/lib/axios';
import { normalizeIp } from '@/utils/normalizeIp';
import { getHardwareId } from '@/utils/helpers/device';


const AffiliateHeader = () => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const router = useRouter();
    const { t, i18n } = getTranslation();
    const { data: session, status } = useSession();
    const params = useParams();
    console.log({ params })
    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }

            let allLinks = document.querySelectorAll('ul.horizontal-menu a.active');
            for (let i = 0; i < allLinks.length; i++) {
                const element = allLinks[i];
                element?.classList.remove('active');
            }
            selector?.classList.add('active');

            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [pathname]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
        router.refresh();
    };

    function createMarkup(messages: any) {
        return { __html: messages };
    }
    const [messages, setMessages] = useState([
        {
            id: 1,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>',
            title: 'Congratulations!',
            message: 'Your OS has been updated.',
            time: '1hr',
        },
        {
            id: 2,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>',
            title: 'Did you know?',
            message: 'You can switch between artboards.',
            time: '2hr',
        },
        {
            id: 3,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light"> <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>',
            title: 'Something went wrong!',
            message: 'Send Reposrt',
            time: '2days',
        },
        {
            id: 4,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>',
            title: 'Warning',
            message: 'Your password strength is low.',
            time: '5days',
        },
    ]);

    const removeMessage = (value: number) => {
        setMessages(messages.filter((user) => user.id !== value));
    };

    const [notifications, setNotifications] = useState([
        // {
        //     id: 1,
        //     profile: 'user-profile.jpeg',
        //     message: '<strong class="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
        //     time: '45 min ago',
        // },
        // {
        //     id: 2,
        //     profile: 'profile-34.jpeg',
        //     message: '<strong class="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
        //     time: '9h Ago',
        // },
        // {
        //     id: 3,
        //     profile: 'profile-16.jpeg',
        //     message: '<strong class="text-sm mr-1">Anna Morgan</strong>Upload a file',
        //     time: '9h Ago',
        // },
    ]);

    const removeNotification = (value: number) => {
        setNotifications(notifications.filter((user) => user.id !== value));
    };

    const [search, setSearch] = useState(false);
    // const { data: session, status } = useSession();
    const handleDeviceRestrictInfo = async (id: string) => {
        Swal.fire({
          icon: "warning",
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          buttonsStyling: false,
          customClass: {
            icon: "swal-icon-large",
            confirmButton: "btn btn-primary mx-2",
            cancelButton: "btn btn-danger mx-2",
            popup: "custom-swal",
            title: "custom-swal-title",
            htmlContainer: "custom-swal-text",
          },
          width: "520px",
          padding: "0.8rem",
          position: "top",
        });
      };

//  useEffect(() => {
//     if (!session?.user?.id) return;

//     const checkSession = async () => {
//         const hardwareId = getHardwareId(); // Your stable device ID

//         const sessionsRes = await apiService.get(
//             `${API_ENDPOINTS.userSessions}?filters[user][$eq]=${session.user.id}`,
//             { headers: { Authorization: `Bearer ${session.jwt}` } }
//         );
        
//         const activeSessions = sessionsRes.data.data;

//         // Verify based on Hardware ID instead of User Agent
//         const isCurrentDeviceRegistered = activeSessions.some(
//             (s) => s.attributes.device_id === hardwareId
//         );

//         if (!isCurrentDeviceRegistered) {
//             console.log("This browser/device is not registered.");
//             // Handle redirection or registration logic here
//         }
//     };

//     checkSession();
// }, [session]);

                    // Check if current device/IP is already registered
                   

    const onSubmit = (e: any) => {
        e.preventDefault();
      if(session?.user?.role == "mentor"){
        router.push("/dash/mentor");
      }else if(session?.user?.role == "student"){
        router.push("/dash/student");
      }
    };
    return (
        <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
            <div className="shadow-sm">
                <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
                    <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <div className=" flex items-center">
                                <TheChartsThemedLogo className="h-10" />
                            </div>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconMenu className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="hidden ltr:mr-2 rtl:ml-2 sm:block">
                        <ul className="flex items-center space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                            <div className='text-lg font-bold text-dark'>Affiliate Panel</div>
                        </ul>
                    </div>
                    <div className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2">
                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
                        </div>
                        {/* <Link href={session?.user?.role == "mentor" ? `/dash/mentor` : session?.user?.role == "student" ? `/dash/student` : "#"}> */}
                            <button
                                type="button"
                                onClick={onSubmit}
                                className="relative inline-flex items-center justify-center px-6 py-2 rounded-xl font-semibold text-slate-900 bg-white shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-[1px]"
                            >
                                {/* moving border */}
                                <span className="absolute inset-0 rounded-xl animate-spin-slow bg-gradient-to-r from-red-500 via-green-500 to-blue-500 p-[2px]">
                                    <span className="block w-full h-full rounded-[10px] bg-white"></span>
                                </span>

                                <span className="relative z-10 text-xs lg:text-sm">Student</span>
                            </button>
                        {/* </Link> */}
                        <div className="dropdown shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                button={
                                    <span>
                                        <IconBellBing />
                                        <span className="absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0">
                                            <span className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-75 ltr:-left-[3px] rtl:-right-[3px]"></span>
                                            <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-success"></span>
                                        </span>
                                    </span>
                                }
                            >
                                <ul className="w-[300px] divide-y !py-0 text-dark dark:divide-white/10 dark:text-white-dark sm:w-[350px]">
                                    <li onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-between px-4 py-2 font-semibold">
                                            <h4 className="text-lg">Notification</h4>
                                            {notifications.length ? <span className="badge bg-primary/80">{notifications.length}New</span> : ''}
                                        </div>
                                    </li>
                                    {notifications.length > 0 ? (
                                        <>
                                            {notifications.map((notification) => {
                                                return (
                                                    <li key={notification.id} className="dark:text-white-light/90" onClick={(e) => e.stopPropagation()}>
                                                        <div className="group flex items-center px-4 py-2">
                                                            <div className="grid place-content-center rounded">
                                                                <div className="relative h-12 w-12">
                                                                    <img className="h-12 w-12 rounded-full object-cover" alt="profile" src={`/assets/images/${notification.profile}`} />
                                                                    <span className="absolute bottom-0 right-[6px] block h-2 w-2 rounded-full bg-success"></span>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-auto ltr:pl-3 rtl:pr-3">
                                                                <div className="ltr:pr-3 rtl:pl-3">
                                                                    <h6
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: notification.message,
                                                                        }}
                                                                    ></h6>
                                                                    <span className="block text-xs font-normal dark:text-gray-500">{notification.time}</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="text-neutral-300 opacity-0 hover:text-danger group-hover:opacity-100 ltr:ml-auto rtl:mr-auto"
                                                                    onClick={() => removeNotification(notification.id)}
                                                                >
                                                                    <IconXCircle />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                            <li>
                                                <div className="p-4">
                                                    <button className="btn btn-primary btn-small block w-full">Read All Notifications</button>
                                                </div>
                                            </li>
                                        </>
                                    ) : (
                                        <li onClick={(e) => e.stopPropagation()}>
                                            <button type="button" className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent">
                                                <div className="mx-auto mb-4 rounded-full ring-4 ring-primary/30">
                                                    <IconInfoCircle fill={true} className="h-10 w-10 text-primary" />
                                                </div>
                                                No data available.
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </Dropdown>
                        </div>
                        <Link href="/dash/affiliate/wallet" >
                            <button
                                className={`${'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                    }`}
                            >
                                <IconWallet />
                            </button>
                        </Link>
                        <div className="dropdown flex shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative group block"
                            //     button={
                            //     <img className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src={getImageUrl(session?.user?.profileImage) ?? ""} alt="userProfile" />
                            // }
                            button= {(session?.user?.profileImage || session?.user?.profile_img_path) ? (
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
                                            {/* <img className="h-10 w-10 rounded-md object-cover" 
                                            src={getImageUrl(session?.user?.profileImage) ?? ""} 
                                            alt="userProfile" /> */}
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
                                                    {session?.user?.username ?? ''}
                                                    <span className="rounded bg-success-light px-1 text-xs text-success ltr:ml-2 rtl:ml-2">Pro</span>
                                                </h4>
                                                <button type="button" className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                                                    {session?.user?.email ?? ''}
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <Link href="/dash/affiliate/profile" className="dark:hover:text-white">
                                            <IconUser className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                            Profile
                                        </Link>
                                    </li>
                                    {/* <li>
                                        <Link href="/dash/users/user-account-settings" className="dark:hover:text-white">
                                            <IconSettings className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                            Setting
                                        </Link>
                                    </li> */}
                                    {/* <li>
                                        <Link href="/dash/dashboard/refundlist" className="dark:hover:text-white">
                                            <IconRestore className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                            Refund
                                        </Link>
                                    </li> */}
                                    <li onClick={() => signOut({ callbackUrl: "/" })} className="border-t border-white-light dark:border-white-light/10">
                                        <Link href="#" className="!py-3 text-danger"
                                        >
                                            <IconLogout className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
                                            Sign Out
                                        </Link>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AffiliateHeader;
