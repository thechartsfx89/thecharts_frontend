// app/testimonials/page.tsx
import Image from 'next/image';
import { Quote } from 'lucide-react';

type Testimonial = {
    id: string;
    name: string;
    quote: string;
    photo: string;
};

const DATA: Testimonial[] = [
    {
        id: '1',
        name: 'Arman',
        quote: 'Short, actionable lessons. The mentorship feedback changed my approach.',
        photo: '/assets/landing/testimonials/1.png',
    },
    {
        id: '2',
        name: 'Jay',
        quote: 'Crisp modules, great community, and frameworks I actually use. My results are finally consistent.',
        photo: '/assets/landing/testimonials/2.png',
    },
    {
        id: '3',
        name: 'Wei',
        quote: 'The live breakdowns clicked for me. Risk management lessons alone were worth it.',
        photo: '/assets/landing/testimonials/3.png',
    },
    {
        id: '4',
        name: 'Marco',
        quote: 'Short, actionable lessons. The mentorship feedback changed my approach.',
        photo: '/assets/landing/testimonials/4.png',
    },
];

export default function Testimonials() {
    return (
        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-2 lg:px-8">
            {DATA.map((t) => (
                <figure key={t.id} className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl sm:flex-row">
                    <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-slate-100 sm:aspect-auto sm:w-48">
                        <Image src={t.photo} alt={t.name} fill sizes="(min-width: 640px) 192px, 100vw" className="object-cover object-top transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-7">
                        <div>
                            <Quote className="h-8 w-8 text-[#16c75f]" />
                            <blockquote className="mt-4 leading-relaxed text-slate-700">{t.quote}</blockquote>
                        </div>
                        <figcaption className="mt-6 font-semibold text-[#0b1b33]">{t.name}</figcaption>
                    </div>
                </figure>
            ))}
        </section>
    );
}
