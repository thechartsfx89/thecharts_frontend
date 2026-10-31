'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Grid } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import { Play } from 'lucide-react'; // or any play icon

const webinars = [
    { id: 1, img: '/assets/images/carousel1.jpg' },
    { id: 2, img: '/assets/images/carousel2.jpg' },
    { id: 3, img: '/assets/images/carousel3.jpg' },
    { id: 4, img: '/assets/images/carousel4.jpg' },
    { id: 5, img: '/assets/images/carousel5.jpg' },
    { id: 6, img: '/assets/images/carousel6.jpg' },
    { id: 7, img: '/assets/images/carousel7.jpg' },
    { id: 8, img: '/assets/images/carousel1.jpg' },
    { id: 9, img: '/assets/images/carousel2.jpg' },
    { id: 12, img: '/assets/images/carousel3.jpg' },
    { id: 13, img: '/assets/images/carousel4.jpg' },
    { id: 14, img: '/assets/images/carousel5.jpg' },
    { id: 15, img: '/assets/images/carousel6.jpg' },
    { id: 16, img: '/assets/images/carousel7.jpg' },
];

export default function Webinar() {
    return (
        <main className="">
            {/* --- Our Plans Section --- */}
            <section className="container mx-auto lg:py-16 py-4 xl:px-10 lg:px-2.5 px-2.5">
                <div className="">
                    {/* Heading */}
                    <h2 className="lg:text-5xl md:text-4xl text-3xl font-extrabold mb-2">
                        Our <span className="text-green-600 italic font-normal font-mrs-saint lg:text-[88px] text-4xl">Webinar</span>
                    </h2>
                    <p className="lg:mb-6 mb-5">Learn to Trade Smart and Hard</p>

                    {/* Swiper Grid */}
                    <Swiper
                        modules={[Autoplay, Grid]}
                        breakpoints={{
                            320: { slidesPerView: 1.5 }, // mobile
                            640: { slidesPerView: 2.5 }, // sm
                            768: { slidesPerView: 2.5 }, // md
                            1024: { slidesPerView: 2.5 }, // lg
                            1280: { slidesPerView: 3 }, // xl
                        }}
                        grid={{ rows: 1, fill: 'row' }}
                        spaceBetween={20}
                        loop
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                            reverseDirection: true,
                        }}
                        speed={1000}
                        className="w-full"
                    >
                        {webinars.map((w) => (
                            <SwiperSlide key={w.id}>
                                <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                                    {/* Image */}
                                    <img src={w.img} alt="webinar" className="w-full h-48 object-cover group-hover:blur-sm transition-all duration-500" />

                                    {/* Gradient overlay */}
                                    <div
                                        className="absolute inset-0 rounded-2xl 
                  bg-gradient-to-t from-black/80 via-black/60 to-black/20"
                                    ></div>

                                    {/* Drop shadow overlay (using Figma values: x=0, y=1, blur=4, spread=3, 25% opacity) */}
                                    <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: '0px 1px 4px 3px rgba(0,0,0,0.25)' }}></div>

                                    {/* Play button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-red-500 absolute bottom-4 left-4 rounded-full p-4 backdrop-blur-sm shadow-md">
                                            <Play className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <Swiper
                        modules={[Autoplay, Grid]}
                         breakpoints={{
                            320: { slidesPerView: 1 }, // mobile
                            640: { slidesPerView: 2 }, // sm
                            768: { slidesPerView: 3 }, // md
                            1024: { slidesPerView: 3 }, // lg
                            1280: { slidesPerView: 3.5 }, // xl
                        }}
                        grid={{ rows: 1, fill: 'row' }}
                        spaceBetween={20}
                        loop
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        speed={1000}
                        className="w-full mt-6"
                    >
                        {webinars.map((w) => (
                            <SwiperSlide key={w.id}>
                                <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                                    {/* Image */}
                                    <img src={w.img} alt="webinar" className="w-full h-48 object-cover group-hover:blur-sm transition-all duration-500" />

                                    {/* Gradient overlay */}
                                    <div
                                        className="absolute inset-0 rounded-2xl 
                  bg-gradient-to-t from-black/80 via-black/60 to-black/20"
                                    ></div>

                                    {/* Drop shadow overlay (using Figma values: x=0, y=1, blur=4, spread=3, 25% opacity) */}
                                    <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: '0px 1px 4px 3px rgba(0,0,0,0.25)' }}></div>

                                    {/* Play button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-red-500 absolute bottom-4 left-4 rounded-full p-4 backdrop-blur-sm shadow-md">
                                            <Play className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        </main>
    );
}
