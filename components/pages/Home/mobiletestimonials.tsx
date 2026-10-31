// app/testimonials/page.tsx
'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { A11y, Autoplay } from 'swiper/modules';

type Testimonial = {
  id: string;
  name: string;
  quote: string;
  photo: string;
};

const DATA: Testimonial[] = [
  { id: '1', name: 'Arman', quote: 'Started as a complete beginner — now I confidently analyze charts and trade on my own. EDUCANDLE made complex topics easy to understand!', photo: '/assets/landing/testimonials/1.png' },
  { id: '2', name: 'Jay',   quote: 'Crisp modules, great community, and frameworks I actually use. My results are finally consistent.', photo: '/assets/landing/testimonials/2.png' },
  { id: '3', name: 'Wei',   quote: 'The live breakdowns clicked for me. Risk management lessons alone were worth it.', photo: '/assets/landing/testimonials/3.png' },
  { id: '4', name: 'Marco', quote: 'Short, actionable lessons. The mentorship feedback changed my approach.', photo: '/assets/landing/testimonials/4.png' },
  { id: '5', name: 'Ana',   quote: 'Loved the structure—easy to follow and practical.', photo: '/assets/landing/testimonials/1.png' },
  { id: '6', name: 'Ravi',  quote: 'Great community support and constant feedback.', photo: '/assets/landing/testimonials/2.png' },
  { id: '7', name: 'Li',    quote: 'Made me consistent with clear frameworks.', photo: '/assets/landing/testimonials/3.png' },
  { id: '8', name: 'Mira',  quote: 'Exactly what I needed to improve.', photo: '/assets/landing/testimonials/4.png' },
   { id: '1', name: 'Arman', quote: 'Started as a complete beginner — now I confidently analyze charts and trade on my own. EDUCANDLE made complex topics easy to understand!', photo: '/assets/landing/testimonials/1.png' },
  { id: '2', name: 'Jay',   quote: 'Crisp modules, great community, and frameworks I actually use. My results are finally consistent.', photo: '/assets/landing/testimonials/2.png' },
  { id: '3', name: 'Wei',   quote: 'The live breakdowns clicked for me. Risk management lessons alone were worth it.', photo: '/assets/landing/testimonials/3.png' },
  { id: '4', name: 'Marco', quote: 'Short, actionable lessons. The mentorship feedback changed my approach.', photo: '/assets/landing/testimonials/4.png' },
  { id: '5', name: 'Ana',   quote: 'Loved the structure—easy to follow and practical.', photo: '/assets/landing/testimonials/1.png' },
  { id: '6', name: 'Ravi',  quote: 'Great community support and constant feedback.', photo: '/assets/landing/testimonials/2.png' },
  { id: '7', name: 'Li',    quote: 'Made me consistent with clear frameworks.', photo: '/assets/landing/testimonials/3.png' },
  { id: '8', name: 'Mira',  quote: 'Exactly what I needed to improve.', photo: '/assets/landing/testimonials/4.png' },
];

export default function MobileTestimonials() {
  const [active, setActive] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <main className="relative container mx-auto  overflow-hidden px-4 pb-16 pt-8 sm:max-w-screen-lg sm:pb-20 sm:pt-10 lg:hidden block">
      <h2 className="mb-6 text-center text-2xl font-semibold sm:mb-8 sm:text-3xl">
        <span className="font-extrabold">What People </span>
        <span className="text-green-600 italic font-normal font-mrs-saint lg:text-[88px] text-4xl">Say</span>
      </h2>

      <Swiper
        modules={[A11y, Autoplay]}
        onSwiper={(sw) => (swiperRef.current = sw)}
        loop
        loopAdditionalSlides={DATA.length}
        loopPreventsSliding={false}
        autoplay={{ delay: 2400, disableOnInteraction: false, pauseOnMouseEnter: true }}
        speed={500}
        centeredSlides
        slidesPerView="auto"               // fixed per-breakpoint width via class below
        spaceBetween={12}
        onSlideChange={(sw) => setActive(sw.realIndex ?? sw.activeIndex)}
        className="!overflow-visible pb-10"
        breakpoints={{
          320:  { spaceBetween: 12, centeredSlides: true },
          390:  { spaceBetween: 12, centeredSlides: true },
          640:  { spaceBetween: 14, centeredSlides: true }, // tablet portrait
          768:  { spaceBetween: 16, centeredSlides: true }, // tablet landscape
        }}
      >
        {DATA.map((t, idx) => (
          <SwiperSlide
            key={`${t.id}-${idx}`}                // unique key = reliable loop
            className="!w-[240px] sm:!w-[280px] md:!w-[300px]" // uniform width
          >
            <TestimonialCard t={t} />
          </SwiperSlide>
        ))}
        {DATA.map((t, idx) => (
          <SwiperSlide
            key={`${t.id}-${idx}`}                // unique key = reliable loop
            className="!w-[240px] sm:!w-[280px] md:!w-[300px]" // uniform width
          >
            <TestimonialCard t={t} />
          </SwiperSlide>
        ))}
        
      </Swiper>

      {/* fixed 5 dots (optional) */}
      <div className="mt-2 flex justify-center">
        <Dots count={5} active={active} />
      </div>
    </main>
  );
}

/* ---------- components ---------- */

function TestimonialCard({ t }: { t: Testimonial }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`relative w-full rounded-3xl bg-white p-3 shadow-md ring-1 ring-black/10 overflow-hidden ${
        expanded ? 'h-auto' : 'h-[400px]'
      }`}
    >
      {/* image */}
      <div className="relative w-full overflow-hidden rounded-2xl">
        {/* 👉 mobile keeps 4/5; tablet+ uses square to free space */}
        <div className="relative w-full aspect-[4/5] sm:aspect-square">
          <Image
            src={t.photo}
            alt={t.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 280px, 300px"
          />
        </div>
      </div>

      {/* content with 3-line clamp + toggle */}
      <div className="mt-3">
        <p className="text-sm font-semibold text-slate-900">{t.name}</p>
        <p
          className={`mt-1 text-sm leading-relaxed text-slate-600 ${
            expanded
              ? 'overflow-visible'
              : 'overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]'
          }`}
        >
          “{t.quote}”
        </p>
        {(t.quote?.length ?? 0) > 120 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 text-sm font-medium text-emerald-600 hover:underline"
          >
            {expanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
}



/* 5 fixed dots regardless of slide count */
function Dots({ count = 3, active }: { count?: number; active: number }) {
  const activeDot = ((active % count) + count) % count;
  const nextDot = (activeDot + 1) % count;
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`h-2.5 w-2.5 rounded-full ${
            i === activeDot ? 'bg-red-500'
            : i === nextDot ? 'bg-green-300'
            : 'bg-red-300'
          }`}
        />
      ))}
    </div>
  );
}
