// src/components/CounterSection.js
"use client";

import CountUp from "../Countup/countup";

export default function CounterSection() {
  return (
    <section className="mb-55 xl:px-10 lg:px-2.5 px-2.5">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 lg:gap-10 gap-5 text-center ">
        {/* Card 1 */}
        <div
          className="lg:p-12 p-5 rounded-xl border  bg-white  transition"
          style={{ boxShadow: "1px 1px 20px 0px #E31E24" }}
        >
          <CountUp
            from={0}
            to={20}
            duration={2}
            className="lg:text-6xl  text-2xl font-michroma bg-gradient-to-r from-pink-400 to-blue-500 bg-clip-text text-transparent"
          />
          <span className="lg:text-6xl text-2xl bg-gradient-to-r from-pink-400 to-blue-500 bg-clip-text text-transparent">
            +
          </span>
          <p className="mt-4 lg:text-lg text-sm font-medium">Hours of Expert Training</p>
        </div>

        {/* Card 2 */}
        <div
          className="lg:p-12 p-5 rounded-xl border  bg-white transition"
          style={{ boxShadow: "1px 1px 20px 0px #E31E24" }}
        >
          <CountUp
            from={0}
            to={50}
            duration={2}
            className="lg:text-6xl text-2xl font-michroma bg-gradient-to-r from-pink-400 to-blue-500 bg-clip-text text-transparent"
          />
          <span className="lg:text-6xl text-2xl bg-gradient-to-r from-pink-400 to-blue-500 bg-clip-text text-transparent">
            +
          </span>
          <p className="mt-4 lg:text-lg text-sm font-medium">
            Lessons Covering Key Trading Topics
          </p>
        </div>

        {/* Card 3 */}
        <div
          className="lg:p-12 p-5 rounded-xl   bg-white transition"
          style={{ boxShadow: "1px 1px 20px 0px #E31E24" }}
        >
          <CountUp
            from={0}
            to={100}
            duration={2}
            className="lg:text-6xl text-2xl font-michroma bg-gradient-to-r from-pink-400 to-blue-500 bg-clip-text text-transparent"
          />
          <span className="lg:text-6xl text-2xl bg-gradient-to-r from-pink-400 to-blue-500 bg-clip-text text-transparent">
            +
          </span>
          <p className="mt-4 lg:text-lg text-sm font-medium">
            Practice Exercises & Live Market Examples
          </p>
        </div>
      </div>
    </section>
  );
}
