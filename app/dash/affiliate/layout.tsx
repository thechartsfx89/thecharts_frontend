import SessionGuard from '@/components/auth/sessionGaurd';
import AffiliateHeader from '@/components/layouts/affiliate/affiliateHeader';
import AffiliateSidebar from '@/components/layouts/affiliate/affiliateSidebar';
import ContentAnimation from '@/components/layouts/content-animation';
import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import MainContainer from '@/components/layouts/main-container';
import Overlay from '@/components/layouts/overlay';
import ScrollToTop from '@/components/layouts/scroll-to-top';
import Portals from '@/components/portals';
import React, { Suspense } from 'react';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    // components/loaders/ChildFallbackLoader.tsx
function ChildFallbackLoader() {
    return (
        <div className="flex min-h-[60vh] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-gray-500">Loading...</p>
            </div>
        </div>
    );
}
// const SlowComponent = React.lazy(
//     () =>
//         new Promise<{ default: React.ComponentType }>((resolve) => {
//             setTimeout(() => {
//                 resolve(import('../affiliate/downline-list/page')); // 👈 real component
//             }, 10000);
//         })
// );
    return (
        <>
            {/* BEGIN MAIN CONTAINER */}
            <SessionGuard />
            <div className="relative" >
                <Overlay />
                <ScrollToTop />

                {/* BEGIN APP SETTING LAUNCHER */}
                {/* <Setting /> */}
                {/* END APP SETTING LAUNCHER */}

                <MainContainer>
                    {/* BEGIN SIDEBAR */}
                    <AffiliateSidebar />
                    {/* END SIDEBAR */}
                    <div className="main-content flex min-h-screen flex-col">
                        {/* BEGIN TOP NAVBAR */}
                        {/* <Header /> */}
                        <AffiliateHeader />
                        {/* END TOP NAVBAR */}

                        {/* BEGIN CONTENT AREA */}
                        {/* <ContentAnimation>{children}</ContentAnimation> */}
                        <ContentAnimation>
                        <Suspense fallback={<ChildFallbackLoader />}>
                            {children}
                            {/* <SlowComponent /> */}
                        </Suspense>
                    </ContentAnimation>
                        {/* END CONTENT AREA */}

                        {/* BEGIN FOOTER */}
                         <Footer />
                        {/* END FOOTER */}
                        <Portals />
                    </div>
                </MainContainer>
            </div>
        </>
    );
}
