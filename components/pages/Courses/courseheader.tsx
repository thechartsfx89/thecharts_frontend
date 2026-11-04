import { PageHero } from '@/components/pages/Landing/page-shell';

export default function CourseHeader() {
  return (
    <PageHero
      eyebrow="Courses"
      title={
        <>
          Explore Our <span className="text-[#16c75f]">All Courses</span>
        </>
      }
      sub="Explore our complete range of trading courses designed to guide you from beginner basics to advanced trading strategies. Learn at your own pace, build real skills, and trade the global markets with confidence."
    />
  );
}
