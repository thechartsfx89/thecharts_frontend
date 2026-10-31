import BlogsGrid from '@/components/pages/Blog/bloggrid'
import BlogSection from '@/components/pages/Blog/heroblog'
import Footer from '@/components/pages/Footer/footer'
import Header from '@/components/pages/Header/header'
import React from 'react'
import HeaderLanding from '../dashboard/landing/headerLanding';
import Testimonials from '@/components/pages/Home/testimonials'



const testimonialsPage = () => {
  return (
    <>
    <HeaderLanding />
   <Testimonials />
    <Footer />
    
    </>
  )
}

export default testimonialsPage