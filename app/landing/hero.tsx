"use client"
import { showToast } from "@/utils/toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

type EmailFormData = {
  email: string;
};
// components/Hero.js
export default function Hero() {
 

 const { register, handleSubmit, reset } = useForm<EmailFormData>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data: EmailFormData) => {
    setLoading(true);
    setMessage("");
    console.log({data})
    try {
      const res = await fetch("/api/auth/email/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // to: data.email,
          email: data.email,
          // subject: "Welcome to our platform!",
          // html: `<h2>Thank you for joining us, ${data.email}!</h2>`,
          // from:"anilchauhan.src@gmail.com"
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("✅ Email sent successfully!");
        // showToast("")
         showToast("success", "Email sent successfully!");
        reset();
      } else {
        showToast("error", result.error || "Something went wrong");
        setMessage(`❌ Failed: ${result.error || "Something went wrong"}`);
      }
    } catch (error) {
     showToast("error", "Something went wrong");
      setMessage("⚠️ Error sending email");
    } finally {
      setLoading(false);
    }
  };
 const onError = (errors: any) => {
           showToast("error", "Email is required");


        //   showToast("info","Please fill required field");
        console.log("❌ Validation Errors:", errors);
    };
  return (

    <section className="pt-2 pb-8 lg:block hidden panel xl:px-10 lg:px-2.5 px-2.5 ">

      <div
        className="container mx-auto  panel  2xl:p-12 lg:p-10   rounded-2xl flex flex-col lg:flex-row items-center gap-12 px-24 shadow-[rgba(67,71,85,0.27)_0px_0px_0.25em,rgba(90,125,188,0.05)_0px_0.25em_1em]"
        style={{
          // backgroundImage: "url('/assets/landing/home/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",

        }}
      >
        {/* Left Side - Content */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-gray-600 2xl:text-lg font-michroma ">
            Learn Trading From The Ground Up
          </p>
          <h1 className="ext-gray-900 2xl:text-4xl xl:text-3xl lg:text-2xl md:text-2xl font-normal 2xl:leading-tight xl:leading-snug md:leading-relaxed mt-5 font-michroma">
            Master Trading With
            Zero Confusion
          </h1>

          <p className="text-gray-400 2xl:text-lg mt-5 ">
            Step-By-Step Lessons, Real Market Examples, And Expert Guidance To
            Turn You From Beginner To Confident Trader — No Prior Experience
            Needed.
          </p>

          {/* Input + Button */}
          {/* <div className="mt-12 bg-[#DFDFDF] p-2 flex flex-col sm:flex-row items-center gap-3 rounded-full justify-between">
            <input
              type="email"
              placeholder="Enter an Email"
              className="px-4 py-3 rounded-lg  text-lg  text-black w-full sm:w-72 bg-transparent form-input"
            />
            <button className="px-6 py-3 bg-[#009945] font-bold text-lg text-white rounded-full shadow hover:bg-green-700 transition">
              Book A Demo
            </button>
          </div> */}
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="mt-12 flex w-full max-w-2xl overflow-hidden rounded-full bg-[#DFDFDF] focus-within:ring-2 focus-within:ring-[#009945]"
          >
            <input
              type="email"
              placeholder="Enter an email"
              {...register("email", { required: true })}
              className="flex-1 px-4 py-3 text-lg text-black bg-transparent outline-none placeholder:text-[16px]"
            />

            <button
              type="submit"
              // disabled={loading}
              className="relative overflow-hidden px-6 py-3 m-2 rounded-full bg-[#009945] font-bold text-md text-white hover:bg-green-700 transition disabled:opacity-70"
            >
              <span className="relative z-10">
                {loading ? "Sending..." : "Book A Demo"}
              </span>
              <span className="absolute inset-0 -translate-x-1/2 bg-gradient-to-tr from-transparent via-white/70 to-transparent skew-x-[-20deg] animate-shine" />
            </button>

            {/* {message && (
              <p className="absolute mt-16 w-full text-center text-sm text-gray-800">
                {message}
              </p>
            )} */}
          </form>
          {/* <div className="mt-12 flex w-full max-w-2xl overflow-hidden rounded-full bg-[#DFDFDF] focus-within:ring-2 focus-within:ring-[#009945]">
            <input
              type="email"
              placeholder="Enter an email"
              className="flex-1 px-4 py-3 text-lg text-black bg-transparent !outline-none  placeholder:text-[16px]"
            />
            <button
              type="button"
              className="relative overflow-hidden px-6 py-3 m-2 rounded-full bg-[#009945] font-bold text-md text-white hover:bg-green-700 transition"
            >
              <span className="relative z-10" onClick={() => showAlert()}>Book A Demo</span>
              <span className="absolute inset-0 -translate-x-1/2 bg-gradient-to-tr from-transparent via-white/70 to-transparent skew-x-[-20deg] animate-shine"></span>
            </button>
          </div> */}

          <p className="mt-12 text-lg text-gray-600">
            Trusted By <span className="text-red-600 font-bold">5000+</span>{" "}
            Students
          </p>
        </div>

        {/* Right Side - Images */}
        <div className="flex-1">
          <div className=" flex justify-end">
            <img
              src="assets/landing/home/1.jpeg"
              alt="Teacher waving"
              className="rounded-2xl 2xl:w-[471px] xl:w-[471px] lg:w-72 "
            />
          </div>
        </div>
      </div>




    </section>

  );
}
