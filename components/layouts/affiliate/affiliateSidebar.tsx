'use client';
import { TheChartsThemedLogo } from '@/components/pages/Landing/logo';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '@/store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '@/store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '@/components/icon/icon-carets-down';
import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard';
import IconCaretDown from '@/components/icon/icon-caret-down';
import IconMinus from '@/components/icon/icon-minus';
import IconMenuScrumboard from '@/components/icon/menu/icon-menu-scrumboard';
import { usePathname } from 'next/navigation';
import { getTranslation } from '@/i18n';
// import IconVideo from '../icon/icon-video';
import Image from 'next/image';
import { FileQuestion } from 'lucide-react';
import { useSession } from 'next-auth/react';
import IconVideo from '@/components/icon/icon-video';
import IconUser from '@/components/icon/icon-user';
import IconUsers from '@/components/icon/icon-users';
import IconUsersGroup from '@/components/icon/icon-users-group';
import IconCashBanknotes from '@/components/icon/icon-cash-banknotes';
import IconWallet from '@/components/icon/icon-wallet';
import IconShare from '@/components/icon/icon-share';
import IconMultipleForwardRight from '@/components/icon/icon-multiple-forward-right';
import IconUserPlus from '@/components/icon/icon-user-plus';

const AffiliateSidebar = () => {
    const dispatch = useDispatch();
    const { t } = getTranslation();
    const pathname = usePathname();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };
    console.log({ themeConfig });
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

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        selector?.classList.add('active');
    };
    const { data: session, status } = useSession<any>();

    return (

        <div className={semidark ? 'dark' : ''}>

            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
 <div className='p-2 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700  transition-shadow duration-300' style={{
  backgroundImage: "url('/assets/images/sidebar-bg-4.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
}}>

                <div className="h-full backdrop-blur
    bg-white/70 rounded-2xl
    bg-gradient-to-b from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 border border-blue-200 dark:border-emerald-800">
                        <div className="flex items-center justify-between px-4 py-3">
                            <Link href="/" className="main-logo flex shrink-0 items-center width-10 hh">

                                <div className="flex items-center">
                                    <TheChartsThemedLogo className="h-10" />
                                </div>
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
                                    <Link href={session?.user?.role == "mentor" ? `/dash/mentor` : session?.user?.role == "student" ? `/dash/affiliate` : "#"} className="group">
                                        <div className="flex items-center">
                                            <IconMenuDashboard className="shrink-0 group-hover:!text-primary" />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 ">{t('Dashboard')}</span>
                                        </div>
                                    </Link>
                                </li>




                                <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                    <IconMinus className="hidden h-5 w-4 flex-none" />
                                    <span>{t('EXPLORE')}</span>
                                </h2>
                                <li className="menu nav-item">
                                    <button type="button" className={`${currentMenu === 'My Profile' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('My Profile')}>
                                        <div className="flex items-center">
                                            <IconUser className="shrink-0 group-hover:!text-primary" />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('My Profile')}</span>
                                        </div>

                                        <div className={currentMenu !== 'My Profile' ? '-rotate-90 rtl:rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300} height={currentMenu === 'My Profile' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            <li>
                                                <Link href="/dash/affiliate/profile">{t('View Profile')}</Link>
                                            </li>
                                            <li>
                                                <Link href="/dash/affiliate/kyc-details">{t('KYC Details')}</Link>
                                            </li>
                                        </ul>
                                    </AnimateHeight>
                                </li>
                                <li className="menu nav-item">
                                    <button type="button" className={`${currentMenu === 'My Network' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('My Network')}>
                                        <div className="flex items-center">
                                            <IconUsersGroup className="shrink-0 group-hover:!text-primary" />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('My Network')}</span>
                                        </div>

                                        <div className={currentMenu !== 'My Network' ? '-rotate-90 rtl:rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300} height={currentMenu === 'My Network' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            <li>
                                                <Link href="/dash/affiliate/genealogy">{t('Genealogy')}</Link>
                                            </li>
                                            <li>
                                                <Link href="/dash/affiliate/my-sponsor-list">{t('Direct Referral List')}</Link>
                                            </li>
                                            <li>
                                                <Link href="/dash/affiliate/downline-list">{t('All Downline List')}</Link>
                                            </li>
                                            
                                        </ul>
                                    </AnimateHeight>
                                </li>
                                 <li className="menu nav-item">
                                    <button type="button" className={`${currentMenu === 'Tree Manager' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Tree Manager')}>
                                        <div className="flex items-center">
                                            <IconMenuScrumboard className="shrink-0 group-hover:!text-primary" />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Tree Manager')}</span>
                                        </div>

                                        <div className={currentMenu !== 'Tree Manager' ? '-rotate-90 rtl:rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300} height={currentMenu === 'Tree Manager' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">

                                            <li>
                                                <Link href="/dash/affiliate/level-report">{t('Level Tree')}</Link>
                                            </li>
                                            <li>
                                                <Link href="/dash/affiliate/club-report">{t('Club Tree')}</Link>
                                            </li>
                                        </ul>
                                    </AnimateHeight>
                                </li>
                                <li className="menu nav-item">
                                    <button type="button" className={`${currentMenu === 'Financial Manager' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Financial Manager')}>
                                        <div className="flex items-center">
                                            <IconCashBanknotes className="shrink-0 group-hover:!text-primary" />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Financial Manager')}</span>
                                        </div>

                                        <div className={currentMenu !== 'Financial Manager' ? '-rotate-90 rtl:rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300} height={currentMenu === 'Financial Manager' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            <li>
                                                <Link href="/dash/affiliate/payout-request">{t('Payout Request')}</Link>
                                            </li>
                                            <li>
                                                <Link href="/dash/affiliate/payout-report">{t('Payout Report')}</Link>
                                            </li>
                                        </ul>
                                    </AnimateHeight>
                                </li>
                                <li className="menu nav-item">
                                    <button type="button" className={`${currentMenu === 'E-Wallet Manager' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('E-Wallet Manager')}>
                                        <div className="flex items-center">
                                            <IconWallet className="shrink-0 group-hover:!text-primary" />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('E-Wallet Manager')}</span>
                                        </div>

                                        <div className={currentMenu !== 'E-Wallet Manager' ? '-rotate-90 rtl:rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300} height={currentMenu === 'E-Wallet Manager' ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            <li>
                                                <Link href="/dash/affiliate/wallet">{t('My E-Wallet')}</Link>
                                            </li>
                                            <li>
                                                <Link href="/dash/affiliate/transaction-history">{t('Transaction History')}</Link>
                                            </li>
                                        </ul>
                                    </AnimateHeight>
                                </li>

                               
                                <li className="nav-item">
                                    <ul>
                                        <li className="nav-item">
                                            <Link href="/dash/affiliate/share-earn" className="group">
                                                <div className="flex items-center">
                                                    <IconMultipleForwardRight className="shrink-0 group-hover:!text-primary" />
                                                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Affiliate Link')}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </PerfectScrollbar>
                    </div>

                </div>
            </nav>

        </div>

    );
};

export default AffiliateSidebar;
