import { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import Header from '@/components/pages/Landing/header';
import Hero from '@/components/pages/Landing/hero';
import { AboutMission, HowItWorks, Plans, StatsRow, Testimonials, TopicsStrip } from '@/components/pages/Landing/sections';
import FeaturedCourses from '@/components/pages/Landing/featured-courses';
import DemoCTA from '@/components/pages/Landing/demo-cta';
import Footer from '@/components/pages/Landing/footer';
import '@/components/pages/Landing/landing.css';

export const metadata: Metadata = {
    title: 'The Charts',
    description: 'Learn forex, stock and crypto trading with step-by-step lessons, live chart analysis and mentorship.',
};

const serif = Merriweather({ weight: ['700', '900'], subsets: ['latin'], variable: '--font-tc-serif' });
const sans = Inter({ subsets: ['latin'], variable: '--font-tc-sans' });

// Home page
const Landing = () => {
    return (
        <div className={`tc-root ${serif.variable} ${sans.variable}`}>
            <Header />
            <main>
                <Hero />
                <TopicsStrip />
                <StatsRow />
                <HowItWorks />
                <FeaturedCourses />
                <AboutMission />
                <Plans />
                <Testimonials />
                <DemoCTA />
            </main>
            <Footer />
        </div>
    );
};

export default Landing;
