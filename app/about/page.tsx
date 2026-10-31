import AboutSection from '@/components/pages/About/aboutsection'
import HeroAbout from '@/components/pages/About/heroabout'
import Header from '@/components/pages/Header/header'
import React from 'react'
// import Header from '../header'
// import AboutSection from '@/component/About/aboutsection'
// import HeroAbout from '@/component/About/heroabout'
// If the correct path is './(defaults)/landing/HeaderLanding', update the import as follows:
import HeaderLanding from '../dashboard/landing/headerLanding';
import UniqueAccordion from '@/components/pages/About/aboutaccordian';
import Footer from '@/components/pages/Footer/footer';

const AboutPage = () => {
  return (
    <>



      {/* <Header /> */}
      <HeaderLanding />
      <HeroAbout />
      <UniqueAccordion />
      <AboutSection />\
      <Footer />
    </>
  )
}

export default AboutPage