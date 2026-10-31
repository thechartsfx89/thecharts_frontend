import Marquee from "react-fast-marquee";

export default function Highlights() {
  return (
    <section className="bg-[#009945] py-3">
      <Marquee gradient={false} speed={50} className="text-white font-extrabold text-xl ">
        <div className="flex items-center gap-3 mx-10">
          <img src="assets/landing/highlights/1.png" />
          <span>Learn Trading From Industry Experts</span>
        </div>

        <div className="flex items-center gap-3 mx-10">
          <img src="assets/landing/highlights/2.png" />
          <span>Turn Knowledge Into Profits</span>
        </div>

        <div className="flex items-center gap-3 mx-10">
          <img src="assets/landing/highlights/3.png" />
          <span>Master Risk Management</span>
        </div>
        <div className="flex items-center gap-3 mx-10">
          <img src="assets/landing/highlights/1.png" />
          <span>Learn Trading From Industry Experts</span>
        </div>

        <div className="flex items-center gap-3 mx-10">
          <img src="assets/landing/highlights/2.png" />
          <span>Turn Knowledge Into Profits</span>
        </div>

        <div className="flex items-center gap-3 mx-10">
          <img src="assets/landing/highlights/3.png" />
          <span>Master Risk Management</span>
        </div>
        <div className="flex items-center gap-3 mx-10">
          <img src="assets/landing/highlights/1.png" />
          <span>Learn Trading From Industry Experts</span>
        </div>

        <div className="flex items-center gap-3 mx-10">
          <img src="assets/landing/highlights/2.png" />
          <span>Turn Knowledge Into Profits</span>
        </div>

        <div className="flex items-center gap-3 mx-10">
          <img src="assets/landing/highlights/3.png" />
          <span>Master Risk Management</span>
        </div>
      </Marquee>
    </section>
  );
}

