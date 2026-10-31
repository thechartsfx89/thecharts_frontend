"use client";

import { useState } from "react";
import Image from "next/image";

export default function CoursesDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Navbar Item */}
      <button className="px-4 py-2 text-black font-medium hover:text-green-600">
        Courses
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-2 w-screen max-w-6xl bg-white shadow-xl rounded-xl z-50 p-8 flex flex-col lg:flex-row gap-12">
          {/* --- Left Content --- */}
          <div className="flex-1 space-y-8">
            {/* Fundamental */}
            <div>
              <h3 className="font-bold text-lg mb-4">
                Fundamental Analysis Courses
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "Learn To Trade – Greg Secker",
                  "Investopedia Academy",
                  "Forex Trading A-Z™",
                  "Andrew Mitchem’s The Forex Trading Coach",
                  "FX Academy – Learn To Trade Forex",
                ].map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-orange-400 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-500 transition"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Strategy */}
            <div>
              <h3 className="font-bold text-lg mb-4">
                Strategy-Based Courses
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "Scalping, Day , Swing Trading",
                  "Backtesting Strategies",
                  "Trade Journaling",
                  "Scalping, Day Trading, Swing Trading",
                ].map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-green-300 text-black px-4 py-2 rounded-md text-sm hover:bg-green-400 transition"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Risk */}
            <div>
              <h3 className="font-bold text-lg mb-4">
                Risk Management & Psychology
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "Discipline And Consistency",
                  "Lot Size & Leverage",
                  "Position Sizing",
                  "Trading Psychology & Emotional Control",
                ].map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-300 text-black px-4 py-2 rounded-md text-sm hover:bg-blue-400 transition"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* --- Right Image --- */}
          <div className="hidden lg:block w-[280px] relative">
            <Image
              src="/assets/landing/mobile-phone.png"
              alt="Courses Preview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
