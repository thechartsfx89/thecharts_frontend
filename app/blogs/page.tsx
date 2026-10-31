import BlogsGrid from '@/components/pages/Blog/bloggrid'
import BlogSection from '@/components/pages/Blog/heroblog'
import Footer from '@/components/pages/Footer/footer'
import Header from '@/components/pages/Header/header'
import React from 'react'
import HeaderLanding from '../dashboard/landing/headerLanding';

// import Header from '../header'
// import BlogSection from '@/component/Blog/heroblog'
// import BlogsGrid from '@/component/Blog/bloggrid'
// import Footer from '@/component/Footer/footer'

const BlogPage = () => {
  return (
    <>
    <HeaderLanding />
    <BlogSection />
    <BlogsGrid />
    <Footer />
    
    </>
  )
}

export default BlogPage