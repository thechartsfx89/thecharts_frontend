// components/Hero.js
export default function Hero() {
  return (
    <section className=" py-12">
      <div
        className="container custom-shadow   mx-auto p-12   rounded-2xl flex flex-col lg:flex-row items-center gap-12"
        style={{
          // backgroundImage: "url('/home/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",

        }}
      >
        {/* Left Side - Content */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-gray-600 text-lg font-michroma ">
            Learn Trading From The Ground Up
          </p>
          <h1 className="text-3xl md:text-4xl font-normal leading-tight mt-5 font-michroma">
            Master Trading With <br />
            <span className="text-black">Zero Confusion</span>
          </h1>
          <p className="text-gray-500 text-lg mt-5">
            Step-By-Step Lessons, Real Market Examples, And Expert Guidance To
            Turn You From Beginner To Confident Trader — No Prior Experience
            Needed.
          </p>

          {/* Input + Button */}
          <div className="mt-12 bg-[#DFDFDF] p-2 flex flex-col sm:flex-row items-center gap-3 rounded-full justify-between">
            <input
              type="email"
              placeholder="Enter an Email"
              className="px-4 py-3 rounded-lg  text-lg  w-full sm:w-72 "
            />
            <button className="px-6 py-3 bg-[#009945] font-bold text-lg text-white rounded-full shadow hover:bg-green-700 transition">
              Book A Demo
            </button>
          </div>

          <p className="mt-12 text-lg text-gray-600">
            Trusted By <span className="text-red-600 font-bold">5000+</span>{" "}
            Students
          </p>
        </div>

        {/* Right Side - Images */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="col-span-2 flex justify-end">
            <img
              src="/home/1.jpeg"
              alt="Teacher waving"
              className="rounded-2xl w-[591px] "
            />
          </div>
        </div>
      </div>



      
    </section>
    
  );
}
