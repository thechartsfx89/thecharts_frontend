// components/Highlights.js
// import { TrendingUp, DollarSign, AlertTriangle } from "lucide-react";

export default function Highlights() {
  return (
    <section className="bg-green-600 py-5">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-6 text-white font-extrabold text-2xl">
        {/* Item 1 */}
        <div className="flex items-center gap-3">
          <img src="/highlights/1.png" />
          <span>Learn Trading From Industry Experts</span>
        </div>

        {/* Item 2 */}
        <div className="flex items-center gap-3">
          <img src="/highlights/2.png" />
          <span>Turn Knowledge Into Profits</span>
        </div>

        {/* Item 3 */}
        <div className="flex items-center gap-3">
          <img src="/highlights/3.png" />
          <span>Master Risk Management</span>
        </div>
      </div>
    </section>
  );
}
