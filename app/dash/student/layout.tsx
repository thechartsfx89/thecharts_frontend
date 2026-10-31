import ContentAnimation from '@/components/layouts/content-animation';
import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import MainContainer from '@/components/layouts/main-container';
import Overlay from '@/components/layouts/overlay';
import ScrollToTop from '@/components/layouts/scroll-to-top';
import Setting from '@/components/layouts/setting';
import StudentHeader from '@/components/layouts/student/studentHeader';
import StudentSidebar from '@/components/layouts/student/studentSidebar';
import Portals from '@/components/portals';
import { Suspense } from 'react';
// import SessionGuard from '@/components/auth/sessionGaurd';
import { SessionProvider } from 'next-auth/react';
import SessionGuard from '@/components/auth/sessionGaurd';


export default function DefaultLayout({ children }: { children: React.ReactNode}) {
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
    return (
        <>
            {/* BEGIN MAIN CONTAINER */}
            {/* <SessionProvider  refetchInterval={5 * 60}> */}
            {/* <SessionProvider refetchInterval={60}> */}
            {/* This invisible component handles the auto-redirect */}
            <SessionGuard />
            <div className="relative">
                <Overlay />
                <ScrollToTop />

                {/* BEGIN APP SETTING LAUNCHER */}
                {/* <Setting /> */}
                {/* END APP SETTING LAUNCHER */}

                <MainContainer>
                    {/* BEGIN SIDEBAR */}
                    {/* <Sidebar /> */}
                    <StudentSidebar />
                    {/* END SIDEBAR */}
                    <div className="main-content flex min-h-screen flex-col">
                        {/* BEGIN TOP NAVBAR */}
                        {/* <Header /> */}
                        <StudentHeader />
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
            {/* </SessionProvider> */}
        </>
    );
}
