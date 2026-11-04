"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import Link from "next/link"; 

export default function PaymentSuccess() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch("/assets/animations/Success.json"); // ✅ Correct path
        if (!response.ok) throw new Error("Failed to load animation");
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadAnimation();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
  <div className="w-full max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
<h1 className="tc-serif text-2xl lg:text-3xl font-black text-[#0b1b33]">
      Thank You for Your Payment!
    </h1>
    {animationData ? (
      <Lottie
        animationData={animationData}
        loop={false}
        className="w-48 h-48 mx-auto"
      />
    ) : (
      <p className="text-gray-400 mb-4">Loading animation...</p>
    )}

    

    <p className="text-gray-700 text-base lg:text-lg font-semibold leading-relaxed mt-[-30px] mb-4">
      We’ve received your payment details successfully.
    </p>

    {/* <p className="text-gray-600 mt-4 leading-relaxed font-semibold">
      Our team is currently
      verifying the transaction. This process may take up to
      <strong> 24 hours</strong>.
    </p> */}

    <div className="mt-4 inline-block rounded-2xl border border-[#16c75f]/30 bg-[#f3fbf6]">
  <p className="text-slate-700 leading-relaxed font-medium px-6 py-4">
    Our team is currently verifying the transaction. This process may take up to
    <strong> 24 hours</strong>.
  </p>
</div>


    <p className="text-gray-600 mt-2 leading-relaxed font-semibold">
      Once verified, your enrolled course will automatically appear in your
      dashboard.
    </p>

   

    <Link
      href="/dash/student"
      // className="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
      className="mt-6 inline-block rounded-xl bg-[#0b1b33] px-7 py-3.5 font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-[#13284a]"
    >
      Go to Dashboard
    </Link>
     <p className="text-gray-500 text-sm mt-4">
      If you have any questions, feel free to contact our support team.
    </p>
  </div>
</div>

  );
}
