import React from 'react'
import Testimonials from '@/components/pages/Home/testimonials'
import { PageHero, TcPage } from '@/components/pages/Landing/page-shell';

const testimonialsPage = () => {
  return (
    <TcPage>
      <PageHero
        eyebrow="Testimonials"
        title={
          <>
            Our <span className="text-[#16c75f]">Testimonials</span>
          </>
        }
        sub="The strategies actually work. Finally seeing consistent results!"
      />
      <Testimonials />
    </TcPage>
  )
}

export default testimonialsPage
