// components/WhoWeAre.js
import Image from "next/image";
import Link from "next/link";


export default function WhoWeAre() {

  return (
    <section className="container mx-auto  lg:py-16 py-5  xl:px-10 lg:px-2.5 px-2.5  lg:block hidden ">
      <div className="flex flex-col lg:flex-row items-center gap-12">

        {/* Left Content */}
        <div className="flex-1">
          <h2 className="lg:text-5xl md:text-4xl text-3xl font-bold mb-6">
            <span className="relative">
              Who <span className="text-green-600 italic font-normal font-mrs-saint lg:text-[88px] text-4xl">We</span> Are
            </span>
          </h2>

          <p className="text-lg text-gray-700 mb-6">
            Welcome To EDUCANDLE — Your Trusted Partner In Trading And Equity Market Education.
          </p>

          <p className="text-gray-600 mb-6 leading-relaxed">
            At EDUCANDLE, We Empower Individuals With The Knowledge, Confidence, And Strategies
            Needed To Navigate The Complex World Of Currency And Equity Trading. We Believe That
            True Financial Growth Begins With The Right Education — And Our Mission Is To Make
            That Education Clear, Practical, And Accessible To Everyone, Regardless Of Experience
            Level.
          </p>

          <p className="text-gray-600 mb-8 leading-relaxed">
            In Today’s Fast-Paced Global Markets, Staying Informed Isn’t Optional — It’s
            Essential. That’s Why Our Team Of Expert Traders, Educators, And Market Analysts Work
            Together To Deliver Up-To-Date Insights, In-Depth Courses, And Real-World Trading
            Techniques That Help You Grow Smarter, Faster, And Stronger As A Trader.
          </p>
          <Link href={"/about"}>
            <button className="flex items-center gap-2 bg-white px-6 py-3 shadow-lg border rounded-full hover:bg-gray-100 transition">
              <span className="text-lg font-medium">Learn More</span>
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white">
                ➜
              </span>
            </button>
          </Link>

        </div>

        {/* Right Side - Image Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4 relative">
          {/* Circular Logo on Top Right */}
          <div className="absolute top-[-150px] right-4 z-10">
            <Image
              src="/assets/landing/wwr/2.png"
              alt="Circle Logo"
              width={204}
              height={100}
            />
          </div>

          {/* Main Images */}
          <div className="col-span-2">
            <Image
              src="/assets/landing/wwr/1.png"
              alt="Teacher"
              width={600}
              height={413}
              className="w-full"
            />
          </div>


        </div>
      </div>
    </section>
  );
}

