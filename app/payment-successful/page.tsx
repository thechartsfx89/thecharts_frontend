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
  <div className="panel text-center w-full max-w-7xl mx-auto bg-white/50 dark:bg-white/5 backdrop-blur-sm">
<h1 className="text-xl lg:text-2xl font-bold text-green-700 mt-4 text-gradient">
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

    <div className="mt-4 inline-block rounded-xl p-[2px] bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-spin-slow">
  <p className="bg-white text-gray-700 leading-relaxed font-semibold rounded-[10px] px-6 py-4">
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
      className="btn btn-gradient text-xs lg:text-sm py-3 inline-block border-0 mt-4 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
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
