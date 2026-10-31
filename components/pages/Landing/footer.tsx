import Link from 'next/link';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import TheChartsLogo from './logo';

const COLUMNS = [
    {
        title: 'Quick Links',
        links: [
            { label: 'Home', href: '/' },
            { label: 'About Us', href: '/about' },
            { label: 'Courses', href: '/courses' },
            { label: 'Blogs', href: '/blogs' },
            { label: 'Contact Us', href: '/contact' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { label: 'FAQ', href: '/faq' },
            { label: 'Testimonials', href: '/testimonials' },
            { label: 'Live Charts', href: '/live-charts' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', href: '/privacy-and-policy' },
            { label: 'Refund & Exchange', href: '/return-and-refund-policy' },
            { label: 'Terms & Conditions', href: '/terms-and-conditions' },
            { label: 'Cooling Off Policy', href: '/cooling-off-policy' },
        ],
    },
];

const SOCIAL = [
    { label: 'Facebook', icon: FaFacebook },
    { label: 'Instagram', icon: FaInstagram },
    { label: 'LinkedIn', icon: FaLinkedin },
    { label: 'X (Twitter)', icon: FaXTwitter },
    { label: 'YouTube', icon: FaYoutube },
];

export default function Footer() {
    return (
        <footer className="bg-[#07142a] text-white">
            <a href="https://wa.me/0000000000" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-5 right-5 z-50 rounded-full bg-[#16c75f] p-3 text-white shadow-lg transition hover:scale-110">
                <FaWhatsapp size={28} />
            </a>

            <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
                <div className="space-y-6">
                    <TheChartsLogo className="h-14" onDark />
                    <p className="max-w-xs text-sm leading-relaxed text-white/60">Proven trading strategies, live market sessions and mentorship that actually works, all inside The Charts.</p>
                    <div className="flex gap-3">
                        {SOCIAL.map((s) => (
                            <a key={s.label} href="#" aria-label={s.label} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:bg-[#16c75f] hover:text-[#0b1b33]">
                                <s.icon />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-3">
                    {COLUMNS.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">{col.title}</h4>
                            <ul className="mt-4 space-y-3 text-sm">
                                {col.links.map((l) => (
                                    <li key={l.label}>
                                        <Link href={l.href} className="text-white/60 transition hover:text-[#16c75f]">
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-white/10">
                <p className="mx-auto max-w-5xl px-4 py-6 text-center text-xs leading-relaxed text-white/40">
                    Disclaimer: Futures, forex, stock, and options trading are not appropriate for all traders. There is a substantial risk of loss associated with trading these markets.
                    Losses can and will occur. No system or methodology has ever been developed that can ensure returns or against losses. No representation or implication is being made
                    that using any of these methodologies or systems will generate returns or ensure against losses.
                </p>
            </div>
            <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">© {new Date().getFullYear()} The Charts. All rights reserved.</div>
        </footer>
    );
}
