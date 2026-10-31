import Image from "next/image";
import Link from "next/link";

export default function CoursesDropdown() {
  return (
    <div className="container mx-auto   rounded-lg  flex gap-10 bg-white overflow-hidden shadow-[rgba(67,71,85,0.27)_0px_0px_0.25em,rgba(90,125,188,0.05)_0px_0.25em_1em]">
      {/* Left: Courses */}
      <div className="flex-1 space-y-8 p-12 w-3/5">
        {/* Fundamental Analysis Courses */}
        <div>
          <h3 className="text-2xl  mb-4 font-michroma">
            Fundamental Analysis Courses
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#"
              className="bg-orange-400 text-lg px-4 py-2 rounded-lg hover:bg-orange-500 transition"
            >
              Learn To Trade – Greg Secker
            </Link>
            <Link
              href="#"
              className="bg-orange-400 text-lg px-4 py-2 rounded-lg hover:bg-orange-500 transition"
            >
              Investopedia Academy
            </Link>
            <Link
              href="#"
              className="bg-orange-400 text-lg px-4 py-2 rounded-lg hover:bg-orange-500 transition"
            >
              Forex Trading A-Z™
            </Link>
            <Link
              href="#"
              className="bg-orange-400 text-lg px-4 py-2 rounded-lg hover:bg-orange-500 transition"
            >
              Andrew Mitchem’s The Forex Trading Coach
            </Link>
            <Link
              href="#"
              className="bg-orange-400 text-lg px-4 py-2 rounded-lg hover:bg-orange-500 transition"
            >
              FX Academy – Learn To Trade Forex
            </Link>
          </div>
        </div>

        <hr />

        {/* Strategy-Based Courses */}
        <div>
          <h3 className="text-2xl  mb-4 font-michroma">
            Strategy-Based Courses
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#"
              className="bg-[#C3F499] text-lg px-4 py-2 rounded-lg hover:bg-green-400 transition"
            >
              Scalping, Day , Swing Trading
            </Link>
            <Link
              href="#"
              className="bg-[#C3F499] text-lg px-4 py-2 rounded-lg hover:bg-green-400 transition"
            >
              Backtesting Strategies
            </Link>
            <Link
              href="#"
              className="bg-[#C3F499] text-lg px-4 py-2 rounded-lg hover:bg-green-400 transition"
            >
              Trade Journaling
            </Link>
            <Link
              href="#"
              className="bg-[#C3F499] text-lg px-4 py-2 rounded-lg hover:bg-green-400 transition"
            >
              Scalping, Day Trading, Swing Trading
            </Link>
          </div>
        </div>

        <hr />

        {/* Risk Management & Psychology */}
        <div>
          <h3 className="text-2xl  mb-4 font-michroma">
            Risk Management & Psychology
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#"
              className="bg-blue-200 text-lg px-4 py-2 rounded-lg  "
            >
              Discipline And Consistency
            </Link>
            <Link
              href="#"
              className="bg-blue-200 text-lg px-4 py-2 rounded-lg  "
            >
              Lot Size & Leverage
            </Link>
            <Link
              href="#"
              className="bg-blue-200 text-lg px-4 py-2 rounded-lg  "
            >
              Position Sizing
            </Link>
            <Link
              href="#"
              className="bg-blue-200 text-lg px-4 py-2 rounded-lg  "
            >
              Trading Psychology & Emotional Control
            </Link>
          </div>
        </div>
      </div>

      {/* Right: Phone Image */}
      <div className="w-2/5 flex justify-end items-end">
        <Image
          src="/assets/landing/dropdown-img.png" // replace with your phone mockup
          alt="Forex App"
          width={328}
          height={540}
          className="object-contain"
        />
      </div>
    </div>
  );
}
