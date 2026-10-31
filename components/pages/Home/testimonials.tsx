// app/testimonials/page.tsx
'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { A11y, Autoplay } from 'swiper/modules'; // 👈 added Autoplay

// import styles in globals.css
// @import 'swiper/css';

type Testimonial = {
    id: string;
    name: string;
    quote: string;
    photo: string;
    barColor: string;
};

const DATA: Testimonial[] = [
    {
        id: '1',
        name: 'Arman',
        quote: 'Short, actionable lessons. The mentorship feedback changed my approach.',
        photo: '/assets/landing/testimonials/1.png',
        barColor: 'bg-indigo-600',
    },
    {
        id: '2',
        name: 'Jay',
        quote: 'Crisp modules, great community, and frameworks I actually use. My results are finally consistent.',
        photo: '/assets/landing/testimonials/2.png',
        barColor: 'bg-yellow-400',
    },
    {
        id: '3',
        name: 'Wei',
        quote: 'The live breakdowns clicked for me. Risk management lessons alone were worth it.',
        photo: '/assets/landing/testimonials/3.png',
        barColor: 'bg-violet-700',
    },
    {
        id: '4',
        name: 'Marco',
        quote: 'Short, actionable lessons. The mentorship feedback changed my approach.',
        photo: '/assets/landing/testimonials/4.png',
        barColor: 'bg-emerald-700',
    },
    {
        id: '5',
        name: 'Arman',
        quote: 'Short, actionable lessons. The mentorship feedback changed my approach.',
        photo: '/assets/landing/testimonials/1.png',
        barColor: 'bg-indigo-600',
    },
    {
        id: '6',
        name: 'Jay',
        quote: 'Crisp modules, great community, and frameworks I actually use. My results are finally consistent.',
        photo: '/assets/landing/testimonials/2.png',
        barColor: 'bg-yellow-400',
    },
    {
        id: '7',
        name: 'Wei',
        quote: 'The live breakdowns clicked for me. Risk management lessons alone were worth it.',
        photo: '/assets/landing/testimonials/3.png',
        barColor: 'bg-violet-700',
    },
    {
        id: '8',
        name: 'Marco',
        quote: 'Short, actionable lessons. The mentorship feedback changed my approach.',
        photo: '/assets/landing/testimonials/4.png',
        barColor: 'bg-emerald-700',
    },
    {
        id: '9',
        name: 'Arman',
        quote: 'Short, actionable lessons. The mentorship feedback changed my approach.',
        photo: '/assets/landing/testimonials/1.png',
        barColor: 'bg-indigo-600',
    },
    {
        id: '10',
        name: 'Jay',
        quote: 'Crisp modules, great community, and frameworks I actually use. My results are finally consistent.',
        photo: '/assets/landing/testimonials/2.png',
        barColor: 'bg-yellow-400',
    },
    {
        id: '11',
        name: 'Wei',
        quote: 'The live breakdowns clicked for me. Risk management lessons alone were worth it.',
        photo: '/assets/landing/testimonials/3.png',
        barColor: 'bg-violet-700',
    },
    {
        id: '12',
        name: 'Marco',
        quote: 'Short, actionable lessons. The mentorship feedback changed my approach.',
        photo: '/assets/landing/testimonials/4.png',
        barColor: 'bg-emerald-700',
    },
    {
        id: '13',
        name: 'Arman',
        quote: 'Short, actionable lessons. The mentorship feedback changed my approach.',
        photo: '/assets/landing/testimonials/1.png',
        barColor: 'bg-indigo-600',
    },
    {
        id: '14',
        name: 'Jay',
        quote: 'Crisp modules, great community, and frameworks I actually use. My results are finally consistent.',
        photo: '/assets/landing/testimonials/2.png',
        barColor: 'bg-yellow-400',
    },
    {
        id: '15',
        name: 'Wei',
        quote: 'The live breakdowns clicked for me. Risk management lessons alone were worth it.',
        photo: '/assets/landing/testimonials/3.png',
        barColor: 'bg-violet-700',
    },
    {
        id: '16',
        name: 'Marco',
        quote: 'Short, actionable lessons. The mentorship feedback changed my approach.',
        photo: '/assets/landing/testimonials/4.png',
        barColor: 'bg-emerald-700',
    },
];

export default function Testimonials() {
    const [active, setActive] = useState(0);
    const swiperRef = useRef<SwiperType | null>(null);

    // scaling effect
    useEffect(() => {
        const sw = swiperRef.current;
        if (!sw) return;
        const updateScales = () => {
            sw.slides.forEach((el: any) => {
                const p = Math.abs(el.progress);
                let scale = 0.9;
                if (p < 0.5) scale = 0.95;
                else if (p < 1.5) scale = 1.1;
                else scale = 0.9;
                const opacity = p < 1.6 ? 1 : 0.85;
                el.style.transform = `scale(${scale})`;
                el.style.opacity = String(opacity);
            });
        };
        sw.on('progress', updateScales);
        sw.on('setTranslate', updateScales);
        sw.on('resize', updateScales);
        updateScales();
        return () => {
            sw.off('progress', updateScales);
            sw.off('setTranslate', updateScales);
            sw.off('resize', updateScales);
        };
    }, []);
    const ALL = [...DATA]; // or use useMemo if you like
    const safeActive = ALL.length ? ((active % ALL.length) + ALL.length) % ALL.length : 0;
    return (
        <section className="container mx-auto lg:block hidden 2xl:mt-44 xl:mt-20 lg:mt-10 xl:px-10 lg:px-2.5 px-2.5 ">
            <div className="mx-auto mb-8 w-full">
                {/* Heading */}
                <h2 className="lg:text-5xl md:text-4xl text-3xl font-extrabold mb-2">
                    Our <span className="text-green-600 italic font-normal font-mrs-saint lg:text-[88px] text-4xl">Testimonials</span>
                </h2>
                <p className=" lg:mb-24 mb-5">The strategies actually work. Finally seeing consistent results!</p>
            </div>
            <div className="relative overflow-hidden pb-72 pt-10 ">
                
                <div className="mx-auto mb-8 w-full">
                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        <span className="font-extrabold text-transparent">Our </span>
                        <span className="italic text-transparent">Testimonials</span>
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-transparent">The strategies actually work. Finally seeing consistent results!</p>
                </div>

                {/* phone overlay */}
                <div className="pointer-events-none absolute left-1/2 top-[170px] z-20 -translate-x-1/2 sm:top-[0px] bg-white 2xl:w-72 xl:w-60 lg:w-60">
                    <Phone phoneImageSrc="/assets/landing/testimonials/5.png" item={ALL[safeActive]} />
                </div>

                {/* swiper */}
                <div className="relative mx-auto w-full ">
                    <Swiper
                        modules={[A11y, Autoplay]} // 👈 added Autoplay here
                        onSwiper={(sw) => (swiperRef.current = sw)}
                        watchSlidesProgress
                        centeredSlides
                        loop // 👈 enable loop
                        loopAdditionalSlides={DATA.length}
                        autoplay={{
                            // 👈 autoplay config
                            delay: 1000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        speed={500}
                        slidesPerView="auto"
                        spaceBetween={8}
                        onAfterInit={(sw) => setActive(sw.realIndex ?? sw.activeIndex)}
                        onSlideChange={(sw) => setActive(sw.realIndex ?? sw.activeIndex)}
                        className="!overflow-visible pb-24"
                        breakpoints={{
                            320: { spaceBetween: 20 },
                            640: { spaceBetween: 28 },
                            1024: { spaceBetween: 60 },
                        }}
                    >
                        {DATA.map((t, idx) => (
                            <SwiperSlide key={t.id} className="!w-auto sm:!w-[260px] md:!w-[110px] lg:!w-[210px] 2xl:!w-[250px]">
                                <PortraitCard t={t} highlight={idx === active} />
                            </SwiperSlide>
                        ))}
                        {DATA.map((t, idx) => (
                            <SwiperSlide key={t.id} className="!w-auto sm:!w-[260px] md:!w-[110px] lg:!w-[210px] 2xl:!w-[250px]">
                                <PortraitCard t={t} highlight={idx === active} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* dots */}
                    <div className="pointer-events-none absolute left-1/2 top-[400px] z-10 -translate-x-1/2 lg:top-[400px] 2xl:top-[500px]">
                        <Dots total={DATA.length} active={active} />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---------------- subcomponents (same as before) ---------------- */

function Phone({ phoneImageSrc, item }: { phoneImageSrc: string; item?: Testimonial }) {
    return (
        <div className="relative">
            <Image src={phoneImageSrc} alt="Phone" width={425} height={700} priority />
            <div className="absolute p-5   top-[30px] w-auto  sm:top-[50px] ">
                <div className="rounded-xl bg-sky-200 p-5 text-[12px] leading-snug text-slate-800 shadow-sm">{item ? <>“{item.quote}”</> : null}</div>
            </div>
            <div className="absolute  bottom-1 w-full   flex p-2.5">
                <div className="relative aspect-[3/4] w-full overflow-hidden ">
                    {/* <div
            className={`absolute inset-y-0 left-1/2 w-16 -translate-x-1/2 opacity-90 ${item?.barColor ?? 'bg-yellow-400'}`}
          /> */}
                    {item?.photo ? <Image src={item.photo} alt={item.name} fill className="object-cover" /> : null}
                    <div className="absolute inset-0 mix-blend-luminosity grayscale" />
                </div>
            </div>
        </div>
    );
}

function PortraitCard({ t, highlight }: { t: Testimonial; highlight: boolean }) {
    return (
        <div className={`relative aspect-[3/4] rounded-[28px] bg-white p-3 shadow-lg ring-1 ring-black/10 transition-all duration-300 ${highlight ? 'ring-emerald-20' : ''}`}>
            <div className="relative z-[1] h-full w-full overflow-hidden rounded-2xl flex justify-end ">
                <Image src={t.photo} alt={t.name} fill className="object-cover " />
            </div>
        </div>
    );
}

function Dots({ total, active }: { total: number; active: number }) {
    const count = 5; // force 5 dots
    const activeDot = ((active % count) + count) % count;
    const nextDot = (activeDot + 1) % count;

    return (
        <div className="flex items-center gap-2">
            {Array.from({ length: count }).map((_, i) => (
                <span key={i} className={`h-3 w-3 rounded-full ${i === activeDot ? 'bg-red-500' : i === nextDot ? 'bg-green-300' : 'bg-red-300'}`} />
            ))}
        </div>
    );
}
