// import Image from "next/image";

export default function MissionVision() {
    return (
        <section className="container mx-auto flex  flex-col md:flex-row items-center justify-evenly xl:px-10 lg:px-2.5 px-2.5 lg:py-16">
            {/* Left Image */}
            <div className="w-full  flex justify-center">
                <img src="/assets/landing/chart.png" alt="Candlestick Chart" />
            </div>

            {/* Right Card */}
            <div className="w-full xl:pl-40 lg:pl-4 ">
                <div className="w-full lg:py-28 px-11 bg-gradient-to-b from-green-500 to-green-700 text-white p-8 rounded-2xl relative">
                    {/* Custom cut corner */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#FAFAFA] rounded-bl-[2rem]" />

                    {/* Content */}
                    <h2 className="2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl text-xl font-bold font-michroma lg:mb-11 mb-2.5 relative z-10">Our Mission & Vision</h2>
                    <p className="font-montserrat text-sm leading-relaxed relative z-10">
                        Its A Attitude , Approach And Acumen On How Our Company Will Conduct Business On Daily Basis. Our Company Want To Empower The Employment In Our Country By Focusing On Make In
                        India Agenda To Be Globally And Help Every Member With Positive Attitude And Provide Them A Universal Platform To Fulfill There Dreams.
                    </p>
                    <p className="font-montserrat text-sm lg:mt-11 mt-2.5 relative z-10">
                        Empowering People To Enhance Their Lifestyle By Helping Them To Achieve Their Ambitions In Life In Style. That Is Why Our Motto Says
                        <span className="italic"> "It's Mi Life. It's Mi Style"</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
