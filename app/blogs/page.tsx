import BlogsGrid from '@/components/pages/Blog/bloggrid'
import BlogSection from '@/components/pages/Blog/heroblog'
import React from 'react'
import { TcPage } from '@/components/pages/Landing/page-shell';

const BlogPage = () => {
  return (
    <TcPage>
      <BlogSection />
      <BlogsGrid />
    </TcPage>
  )
}

export default BlogPage
