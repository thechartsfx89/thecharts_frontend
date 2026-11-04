import Image from 'next/image';
import { PageHero } from '@/components/pages/Landing/page-shell';

export default function BlogSection() {
  return (
    <>
      <PageHero
        eyebrow="Our Blogs / News"
        title={
          <>
            Market Insights & <br />
            <span className="text-[#16c75f]">Trading Stories</span>
          </>
        }
        sub="Stay updated with the latest trends, expert analysis, and market-moving news. Your daily dose of clarity and confidence in the ever-changing world of trading."
      />

      {/* Top row of the collage only; its lower rows are cropped */}
      <div className="tc-fade-bottom relative mx-auto mt-10 aspect-[2576/720] max-w-[1500px] overflow-hidden px-4">
        <Image src="/assets/landing/blogs/1.png" alt="" fill sizes="(min-width: 1500px) 1500px, 100vw" className="object-cover object-top" />
      </div>
    </>
  );
}
