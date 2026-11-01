import { TheChartsThemedLogo } from '@/components/pages/Landing/logo';
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaXTwitter, FaYoutube } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-white/50 text-black border-t border-gray-200">
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/0000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition duration-300"
      >
        <FaWhatsapp size={28} />
      </a>
      <div className="container mx-auto  xl:px-10 lg:px-2.5 px-2.5 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Left Section */}
        <div className="col-span-1 space-y-6">
          {/* Logo */}
          {/* <div className="flex items-center gap-3">
                        <Image src="/assets/landing/logo1.png" alt="The Charts Logo" width={200} height={80} className="" />
                    </div> */}
          <div className=" flex items-center">
            <TheChartsThemedLogo className="h-14" />
          </div>

          <div className="flex gap-3 text-xl text-black">
            <a href="#" aria-label="Facebook" className="hover:text-green-600"><FaFacebook /></a>
            <a href="#" aria-label="Instagram" className="hover:text-green-600"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-green-600"><FaLinkedin /></a>
            <a href="#" aria-label="X (Twitter)" className="hover:text-green-600"><FaXTwitter /></a>
            <a href="#" aria-label="YouTube" className="hover:text-green-600"><FaYoutube /></a>
          </div>

          <p className="text-base lg:text-lg text-gray-700 leading-relaxed max-w-xs">
            Get access to proven trading strategies, live market sessions, and mentorship that actually works — all inside THE CHARTS.
          </p>
        </div>

        {/* Links Section */}
        <div className="col-span-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          <div>
            <h4 className="font-normal text-lg mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-green-700">Home</Link></li>
              <li><Link href="/about" className="hover:text-green-700">About Us</Link></li>
              <li><Link href="/courses" className="hover:text-green-700">Courses</Link></li>
              <li><Link href="/blogs" className="hover:text-green-700">Blogs</Link></li>
              <li><Link href="/contact" className="hover:text-green-700">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-normal text-lg mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="hover:text-green-700">FAQ</Link></li>

              <li><Link href="/testimonials" className="hover:text-green-700">Testimonials</Link></li>
              <li><Link href="/live-charts" className="hover:text-green-700">Live Charts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-normal text-lg mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-and-policy" className="hover:text-green-700">Privacy Policy</Link></li>
              <li><Link href="/return-and-refund-policy" className="hover:text-green-700">Refund &amp; Exchange</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-green-700">Terms &amp; Conditions</Link></li>
              <li><Link href="/cooling-off-policy" className="hover:text-green-700">Cooling Off Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto border-t border-gray-200 p-2 text-center text-xs text-gray-500">
        Disclaimer: Futures, forex, stock, and options trading are not appropriate for all traders. There is a substantial risk of loss associated with trading these markets. Losses can and will occur. No system or methodology has ever been developed that can ensure returns or against losses. No representation or implication is being made that using any of these methodologies or systems will generate returns or ensure against losses.
      </div>

      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">© {new Date().getFullYear()}. The Charts All rights reserved.</div>
    </footer>

  );
}
