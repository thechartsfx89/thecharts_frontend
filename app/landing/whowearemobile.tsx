// components/AboutSection.tsx
'use client';

import Image from 'next/image';

export default function WhoWeAreMobile() {
    return (
        <section className="lg:hidden block">
            <div className="py-5 px-2.5 flex justify-center  ">
                <div className="w-full max-w-4xl bg-[#C3F499] rounded-3xl px-5 py-5 text-black space-y-12 shadow-md">
                    {/* Who We Are */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-michroma">Who We Are</h2>
                        <p className="text-sm leading-relaxed">
                            Welcome To <span className="font-semibold">EDUCANDLE</span> — Your Trusted Partner In Trading And Equity Market Education.
                        </p>
                        <p className="text-sm leading-relaxed">
                            At <span className="font-semibold">EDUCANDLE</span>, We Empower Individuals With The Knowledge, Confidence, And Strategies Needed To Navigate The Complex World Of Currency
                            And Equity Trading. We Believe That True Financial Growth Begins With The Right Education — And Our Mission Is To Make That Education Clear, Practical, And Accessible To
                            Everyone, Regardless Of Experience Level.
                        </p>

                        {/* Image */}
                        <div className="flex justify-center">
                            <Image
                                src="/assets/landing/home/wwrmobile.png" // replace with your actual image
                                alt="Vision Graphic"
                                width={195}
                                height={195}
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Mission & Vision */}
                    <div className="space-y-6">
                        <h2 className="text-lg  font-michroma">Mission & Vision</h2>
                        <p className="text-sm leading-relaxed">
                            Its A Attitude, Approach And Acumen On How Our Company Will Conduct Business On Daily Basis. Our Company Want To Empower The Employment In Our Country By Focusing On Make
                            In India Agenda To Be Globally And Help Every Member With Positive Attitude And Provide Them A Universal Platform To Fulfill Their Dreams.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
