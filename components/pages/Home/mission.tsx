// import Image from "next/image";

export default function MissionVision() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-10 px-6 md:px-20 py-16">
      {/* Left Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img 
          src='/chart.png'
          alt="Candlestick Chart"
         
        />
      </div>

      {/* Right Card */}
      <div className="w-full md:w-1/2 py-36 bg-gradient-to-b from-green-500 to-green-700 text-white p-8 rounded-2xl relative">
        {/* Custom cut corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-white rounded-bl-[2rem]" />

        {/* Content */}
        <h2 className="text-3xl font-michroma mb-11 relative z-10">
          Our Mission & Vision
        </h2>
        <p className="font-montserrat text-sm leading-relaxed relative z-10">
          Its A Attitude , Approach And Acumen On How Our Company Will Conduct
          Business On Daily Basis. Our Company Want To Empower The Employment In
          Our Country By Focusing On Make In India Agenda To Be Globally And
          Help Every Member With Positive Attitude And Provide Them A Universal
          Platform To Fulfill There Dreams.
        </p>
        <p className="font-montserrat text-sm mt-11 relative z-10">
          Empowering People To Enhance Their Lifestyle By Helping Them To
          Achieve Their Ambitions In Life In Style. That Is Why Our Motto Says
          <span className="italic"> "It's Mi Life. It's Mi Style"</span>
        </p>
      </div>
    </section>
  );
}
