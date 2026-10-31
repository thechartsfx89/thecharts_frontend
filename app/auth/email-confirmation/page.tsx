"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import Link from "next/link";
import Image from "next/image";

export default function VerifyEmail() {
    const [animationDataSuccess, setAnimationDataSuccess] = useState<any>(null);
// const [animationDataError, setAnimationDataError] = useState<any>(null);
//      const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const confirmEmail = async () => {
//       const params = new URLSearchParams(window.location.search);
//       const token = params.get("confirmation");

//       if (!token) {
//         setStatus("error");
//         setMessage("Invalid confirmation link.");
//         return;
//       }

//       try {
//         const res = await fetch(`/api/auth/email/verification?confirmation=${token}`);

//         const data = await res.json();

//         if (res.ok) {
//           setStatus("success");
//           setMessage(data.message || "Email verified successfully");
//         } else {
//           setStatus("error");
//           setMessage(data.error || "Invalid or expired confirmation link");
//         }
//       } catch (err) {
//         setStatus("error");
//         setMessage("Something went wrong. Please try again.");
//       }
//     };

//     confirmEmail();
//   }, []);

    const loadAnimationSuccess = async () => {
        try {
            const response = await fetch("/assets/animations/Success.json"); // ✅ Correct path
            if (!response.ok) throw new Error("Failed to load animation");
            const data = await response.json();
            setAnimationDataSuccess(data);
        } catch (error) {
            console.error(error);
        }
    };

    // const loadAnimationError = async () => {
    //     try {
    //         const response = await fetch("/assets/animations/error.json"); // ✅ Correct path
    //         if (!response.ok) throw new Error("Failed to load animation");
    //         const data = await response.json();
    //         setAnimationDataError(data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };



    useEffect(() => {
        loadAnimationSuccess();
        // loadAnimationError()
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#fafafa]">
            <div className="absolute inset-0 ">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-start justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-0 lg:px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2 -z-10" />
                {/* <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" /> */}
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px] " />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                

        <div className="flex flex-col items-center justify-start  pt-10  px-4 max-w-lg mx-auto z-999">
            <div className="flex items-center mb-4">
                <Link href="/">
                    <div className=" flex items-center">
                        <Image src="/assets/images/auth/logo-mob.png" className="w-full h-full" alt="logo" width={160} height={80} style={{ width: '60px' }} />
                        <div className='flex flex-col justify-center items-center'>
                            <span className='font-bold text-xl text-dark'>EduCandle</span>
                            <span className='text-xs text-[10px]'>Vision to Reality</span>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="bg-white/70 p-10 rounded-2xl shadow-md text-center z-999">


                {animationDataSuccess ? (
                    <Lottie animationData={animationDataSuccess} loop={false} className="w-40 h-40 mx-auto mt-[-40px]" />
                ) : (
                    <p className="text-gray-400 mb-4">Loading...</p>
                )}
                 <>
                    <h1 className="text-xl font-bold text-dark mt-[-30px]">Email Verified Successfully</h1>
                    <p className="text-gray-600 mt-2">
                        Your email has been verified. You can now proceed to log in to your account.
                    </p></>
                    
                    {/* <>
                        <h1 className="text-xl font-bold text-dark ">Verification Failed</h1>
                        <p className="text-gray-600 mt-2">
                            We could not verify your email at this moment. Please try again or request a new verification link.
                        </p>

                    </> */}
                

                <Link
                    href="/"
                    // className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg transition"
                    // className="btn btn-gradient !mt-6 w-full border-0  shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                >
                    <button 
                    className="btn btn-gradient !mt-6 w-full border-0  shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                    
                    >
                    Go to Home

                    </button>
                </Link>
            </div>
        </div>
            </div>
        </div>


    );
}
