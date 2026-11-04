import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Shared by the About and Courses pages, which differ only in the portrait
export default function AboutSection({ image = '/assets/landing/about/4.png' }: { image?: string }) {
    return (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div className="tc-grid-bg relative grid items-end gap-8 overflow-hidden rounded-[2rem] bg-[#0b1b33] px-6 pt-10 sm:px-12 sm:pt-14 lg:grid-cols-[1fr_auto]">
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#16c75f]/25 blur-3xl" />

                <div className="relative max-w-2xl space-y-5 pb-4 lg:pb-14">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
                        <img src="/assets/landing/courses/5.png" alt="" className="h-9 w-9" />
                    </span>

                    <p className="leading-relaxed text-white/75">
                        We Believe Education Isn’t Just A Step Toward Success—It’s The Foundation. In A Financial Landscape That Changes By The Second, Staying Informed And Skillful Is Everything.
                        That’s Why Our Mission Is Simple: Make Trading Clear, Accessible, And Practical For Everyone—Whether You’re New To The Market Or Sharpening Advanced Strategies.
                    </p>

                    <p className="leading-relaxed text-white/75">
                        Our Community Is Built By Passionate Educators, Experienced Traders, And Market Analysts Dedicated To Sharing Real-World Insights, Proven Techniques, And Market-Driven
                        Strategies. Through Our Interactive Courses, Live Sessions, And Up-To-Date Market Analysis, We Equip Learners To Move From Theory To Confident Action.
                    </p>

                    <Link href="/contact" className="!mt-8 inline-flex items-center gap-2 rounded-xl bg-[#16c75f] px-7 py-3.5 font-semibold text-[#0b1b33] transition hover:-translate-y-0.5 hover:bg-[#2fe079]">
                        Connect With Us <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="relative mx-auto w-[220px] self-end sm:w-[280px] lg:w-[334px]">
                    <div className="absolute inset-x-0 bottom-0 top-[12%] rounded-t-full bg-white/10" />
                    <Image src={image} alt="Educator" width={334} height={359} className="relative w-full" />
                </div>
            </div>
        </section>
    );
}
