import ComponentsDashboardSales from '@/components/dashboard/components-dashboard-sales';
import { Metadata } from 'next';
import React from 'react';
import Hero from './dashboard/landing/hero';
import Highlights from './dashboard/landing/Highlights';
import FeaturedCourses from './dashboard/landing/features';
import WhoWeAre from './dashboard/landing/WhoWeAre';
import MissionVision from './dashboard/landing/mission';
// import HeaderLanding from '@/components/landing/headerLanding';
// import Footer from '@/components/layouts/footer';
import HeaderLanding from './dashboard/landing/headerLanding';
import Footer from '@/components/pages/Footer/footer';
import PricingCard from '@/components/pages/Home/pricingcard';
import Testimonials from '@/components/pages/Home/testimonials';
import ForexDemoCard from './dashboard/landing/heromobilehome';
import HeroMobileHome from './dashboard/landing/heromobilehome';
import WhoWeAreMobile from './dashboard/landing/whowearemobile';
import Webinar from '@/components/pages/Home/webinar';
import MobileTestimonials from '@/components/pages/Home/mobiletestimonials';
import CoursesDropdown from '@/component/Dropdown/coursesdropdown';
import Header from './dashboard/landing/headerLanding';

export const metadata: Metadata = {
    title: 'Educandle',
};

const Landing = () => {
    return (
        <>
            <Header />
            {/* <Header /> */}
            {/* <CoursesDropdown /> */}
            <Hero />
            <HeroMobileHome />
            <Highlights />
            <FeaturedCourses />
            <WhoWeAre />
            <WhoWeAreMobile />
            <MissionVision />
            <Webinar />
            <PricingCard />
            <Testimonials />
            <MobileTestimonials />
            <Footer />
        </>
    );
};

export default Landing;
