import AboutSection from '@/components/pages/About/aboutsection'
import HeroAbout from '@/components/pages/About/heroabout'
import React from 'react'
import UniqueAccordion from '@/components/pages/About/aboutaccordian';
import { TcPage } from '@/components/pages/Landing/page-shell';

const AboutPage = () => {
  return (
    <TcPage>
      <HeroAbout />
      <UniqueAccordion />
      <AboutSection />
    </TcPage>
  )
}

export default AboutPage
