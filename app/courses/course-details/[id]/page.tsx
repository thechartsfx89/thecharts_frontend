import HeaderLanding from '@/app/dashboard/landing/headerLanding'
import Footer from '@/components/pages/Footer/footer'
import Header from '@/components/pages/Header/header'
import CounterSection from '@/components/pages/SingleProductPage/counter'
import CourseDetails from '@/components/pages/SingleProductPage/coursedetails'
import React from 'react'

// import Header from '../header'
// import CourseDetails from '@/component/SingleProductPage/coursedetails'
// import Footer from '@/component/Footer/footer'
// import CounterSection from '@/component/SingleProductPage/counter'

const SingleProductPage = () => {
  return (
   <>
   
   <HeaderLanding />
   <CourseDetails />
   {/* <CounterSection /> */}
   <Footer />
   </>
  )
}

export default SingleProductPage