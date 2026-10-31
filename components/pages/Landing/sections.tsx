import Link from 'next/link';
import Marquee from 'react-fast-marquee';
import { ArrowRight, BookOpenCheck, CircleCheck, LineChart, Quote, ShieldCheck, Target, Telescope, UserRoundCheck, Users } from 'lucide-react';

const TOPICS = ['Forex Basics', 'Price Action', 'Candlestick Patterns', 'Risk Management', 'Live Chart Analysis', 'Trading Psychology', 'Equity Markets', 'Crypto Fundamentals', 'Entry & Exit Strategy'];

export function TopicsStrip() {
    return (
        <section className="border-y border-white/10 bg-[#0b1b33] py-4 text-white">
            <Marquee gradient={false} speed={40} autoFill>
                {TOPICS.map((t) => (
                    <span key={t} className="mx-8 flex items-center gap-3 text-sm font-medium tracking-wide text-white/85">
                        <span className="h-2 w-2 rotate-45 bg-[#16c75f]" />
                        {t}
                    </span>
                ))}
            </Marquee>
        </section>
    );
}

const STATS = [
    { value: '5000+', label: 'Students trained' },
    { value: '3', label: 'Programs, beginner to advanced' },
    { value: 'Daily', label: 'Doubt-solving sessions' },
    { value: '1-on-1', label: 'Mentorship available' },
];

export function StatsRow() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 lg:grid-cols-4">
                {STATS.map((s) => (
                    <div key={s.label} className="bg-white px-6 py-8 text-center">
                        <div className="tc-serif text-3xl font-black text-[#0b1b33] sm:text-4xl">{s.value}</div>
                        <div className="mt-2 text-sm text-slate-500">{s.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export function SectionHeading({ eyebrow, title, sub, center = true, dark = false }: { eyebrow: string; title: React.ReactNode; sub?: string; center?: boolean; dark?: boolean }) {
    return (
        <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0e9f4a]">{eyebrow}</span>
            <h2 className={`tc-serif mt-3 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl ${dark ? 'text-white' : 'text-[#0b1b33]'}`}>{title}</h2>
            {sub && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? 'text-white/70' : 'text-slate-600'}`}>{sub}</p>}
        </div>
    );
}

const STEPS = [
    { icon: BookOpenCheck, title: 'Learn the foundations', body: 'Start with currency markets, pips, candlesticks and trading platforms through short, structured lessons.' },
    { icon: LineChart, title: 'Practise on live charts', body: 'Join live chart analysis and strategy-building sessions to apply every concept on real market examples.' },
    { icon: UserRoundCheck, title: 'Trade with a mentor', body: 'Get your trades reviewed, clear doubts daily and build the discipline and psychology for long-term success.' },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="scroll-mt-24 bg-gradient-to-b from-white to-[#f3fbf6] py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading eyebrow="How it works" title="From first candle to confident trader" sub="A clear path in three stages, so you always know what to learn next." />
                <div className="mt-14 grid gap-6 md:grid-cols-3">
                    {STEPS.map((step, i) => (
                        <div key={step.title} className="group relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                            <span className="tc-serif absolute right-7 top-6 text-5xl font-black text-slate-100 transition group-hover:text-[#16c75f]/20">0{i + 1}</span>
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b1b33] text-[#16c75f]">
                                <step.icon className="h-7 w-7" />
                            </span>
                            <h3 className="mt-6 text-xl font-bold text-[#0b1b33]">{step.title}</h3>
                            <p className="mt-3 leading-relaxed text-slate-600">{step.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function AboutMission() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
                <div>
                    <SectionHeading eyebrow="Who we are" center={false} title="Your partner in trading & equity market education" />
                    <p className="mt-6 leading-relaxed text-slate-600">
                        At The Charts, we give individuals the knowledge, confidence and strategies to navigate currency and equity trading. True financial growth begins with the right
                        education, and our mission is to make that education clear, practical and accessible to everyone, whatever their experience.
                    </p>
                    <p className="mt-4 leading-relaxed text-slate-600">
                        Our team of traders, educators and market analysts works together to deliver up-to-date insights, in-depth courses and real-world techniques that help you
                        grow smarter, faster and stronger as a trader.
                    </p>
                    <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                        {[
                            { icon: Users, text: 'Expert trader-educators' },
                            { icon: ShieldCheck, text: 'Risk-first approach' },
                            { icon: LineChart, text: 'Real market examples' },
                            { icon: UserRoundCheck, text: 'Mentor support' },
                        ].map((f) => (
                            <li key={f.text} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-[#0b1b33]">
                                <f.icon className="h-5 w-5 text-[#16c75f]" />
                                {f.text}
                            </li>
                        ))}
                    </ul>
                    <Link href="/about" className="mt-8 inline-flex items-center gap-2 font-semibold text-[#0b1b33] hover:text-[#0e9f4a]">
                        Learn more about us <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="tc-grid-bg relative overflow-hidden rounded-[2rem] bg-[#0b1b33] p-8 text-white sm:p-12">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#16c75f]/25 blur-3xl" />
                    <div className="relative space-y-10">
                        <div>
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#16c75f]/15 text-[#16c75f]">
                                <Target className="h-6 w-6" />
                            </span>
                            <h3 className="tc-serif mt-5 text-2xl font-black">Our Mission</h3>
                            <p className="mt-3 leading-relaxed text-white/70">
                                To build disciplined, confident and consistently profitable traders through real-time education and psychology training.
                            </p>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div>
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#16c75f]/15 text-[#16c75f]">
                                <Telescope className="h-6 w-6" />
                            </span>
                            <h3 className="tc-serif mt-5 text-2xl font-black">Our Vision</h3>
                            <p className="mt-3 leading-relaxed text-white/70">
                                To provide practical trading knowledge, mindset training and real-time market experience for long-term success in trading.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const PLANS = [
    {
        name: 'Foundation Course',
        tagline: 'For beginners ready to take their first step',
        price: '₹99',
        was: '₹199',
        href: '/courses/course-details/w4v2ac64489eegvefk0fjwbv',
        features: ['Access to beginner trading courses', 'Weekly live sessions (basic level)', 'Practice quizzes & assignments', 'Community access', 'Real-time interaction'],
    },
    {
        name: 'Full Course',
        tagline: 'For serious traders who want an edge',
        price: '₹26,550',
        was: '₹56,999',
        href: '/courses/course-details/yijrnm2mbfm4rxxm5mumf0gb',
        featured: true,
        features: [
            'All Foundation features',
            'Intermediate + advanced courses',
            'Live chart analysis (3x/week)',
            'Daily doubt session',
            'Direct mentor support',
            'Premium community access',
            'Real-time market experience',
            'Dedicated psychology program',
        ],
    },
    {
        name: 'Offline Course',
        tagline: 'For dedicated learners seeking full trading growth',
        price: '₹29,500',
        was: '₹64,999',
        href: '/courses/course-details/w7ru2um7ouxua9yxsw7c81i8',
        features: ['Real-time doubt solution', '1-on-1 mentorship', 'Trade review & feedback', 'Career orientation', 'Entry/exit strategy templates', 'Real-time psychology development'],
    },
];

export function Plans() {
    return (
        <section id="plans" className="scroll-mt-24 bg-[#f3fbf6] py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading eyebrow="Our plans" title="Choose the path that fits you" sub="Real-world examples, live chart analysis and strategy-building sessions in every plan." />
                <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative flex flex-col rounded-3xl p-8 transition hover:-translate-y-1 ${plan.featured ? 'bg-[#0b1b33] text-white shadow-2xl shadow-slate-900/30 lg:-my-4 lg:py-12' : 'border border-slate-200 bg-white shadow-sm hover:shadow-xl'}`}
                        >
                            {plan.featured && <span className="absolute -top-3 left-8 rounded-full bg-[#16c75f] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0b1b33]">Most popular</span>}
                            <h3 className="text-xl font-bold">{plan.name}</h3>
                            <p className={`mt-2 text-sm ${plan.featured ? 'text-white/65' : 'text-slate-500'}`}>{plan.tagline}</p>
                            <div className="mt-6 flex items-baseline gap-3">
                                <span className="tc-serif text-4xl font-black">{plan.price}</span>
                                <span className={`text-sm line-through ${plan.featured ? 'text-white/40' : 'text-slate-400'}`}>{plan.was}</span>
                            </div>
                            <Link
                                href={plan.href}
                                className={`mt-6 inline-flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition ${plan.featured ? 'bg-[#16c75f] text-[#0b1b33] hover:bg-[#2fe079]' : 'bg-[#0b1b33] text-white hover:bg-[#13284a]'}`}
                            >
                                Get Started <ArrowRight className="h-4 w-4" />
                            </Link>
                            <p className={`mt-8 text-xs font-semibold uppercase tracking-wider ${plan.featured ? 'text-white/50' : 'text-slate-400'}`}>What&apos;s included</p>
                            <ul className="mt-4 space-y-3 text-sm">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-start gap-3">
                                        <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#16c75f]" />
                                        <span className={plan.featured ? 'text-white/85' : 'text-slate-700'}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const TESTIMONIALS = [
    { name: 'Arman', quote: 'Started as a complete beginner — now I confidently analyze charts and trade on my own. The Charts made complex topics easy to understand!', photo: '/assets/landing/testimonials/1.png' },
    { name: 'Jay', quote: 'Crisp modules, great community, and frameworks I actually use. My results are finally consistent.', photo: '/assets/landing/testimonials/2.png' },
    { name: 'Wei', quote: 'The live breakdowns clicked for me. Risk management lessons alone were worth it.', photo: '/assets/landing/testimonials/3.png' },
    { name: 'Marco', quote: 'Short, actionable lessons. The mentorship feedback changed my approach.', photo: '/assets/landing/testimonials/4.png' },
];

export function Testimonials() {
    return (
        <section className="py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading eyebrow="Testimonials" title="Traders who found their edge" />
            </div>
            <div className="mt-12">
                <Marquee gradient gradientColor="#ffffff" gradientWidth={60} speed={30} pauseOnHover>
                    {TESTIMONIALS.map((t) => (
                        <figure key={t.name} className="mx-3 flex w-[300px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:w-[360px]">
                            <Quote className="h-8 w-8 text-[#16c75f]" />
                            <blockquote className="mt-4 leading-relaxed text-slate-700">{t.quote}</blockquote>
                            <figcaption className="mt-6 flex items-center gap-3">
                                <img src={t.photo} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                                <span className="font-semibold text-[#0b1b33]">{t.name}</span>
                            </figcaption>
                        </figure>
                    ))}
                </Marquee>
            </div>
        </section>
    );
}
