import CoursesGrid from '@/components/pages/Courses/coursegrid'
import CourseHeader from '@/components/pages/Courses/courseheader'
import React from 'react'
import CoursesAboutSection from '@/components/pages/Courses/coursesaboutsection'
import { TcPage } from '@/components/pages/Landing/page-shell';

const CoursesPage = () => {
  return (
    <TcPage>
      <CourseHeader />
      <CoursesGrid />
      <CoursesAboutSection />
    </TcPage>
  )
}

export default CoursesPage
