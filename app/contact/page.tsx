"use client";

import { useState } from "react";
import HeaderLanding from "../dashboard/landing/headerLanding";
import Footer from "@/components/pages/Footer/footer";
import IconMail from "@/components/icon/icon-mail";
import IconPhoneCall from "@/components/icon/icon-phone-call";

interface FormDataType {
  name: string;
  email: string;
  phone: string;
  course_type: string;
  message: string;
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
    course_type: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);

    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      course_type: formData.course_type.trim(),
      message: formData.message.trim(),
    };

    if (!validatePhone(trimmedData.phone)) {
      alert("Enter valid 10 digit phone number");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact-enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Submission failed");
      }

      setSuccess(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        course_type: "",
        message: "",
      });

    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderLanding />

      <div className="flex justify-center items-center px-4 py-10 sm:py-14">
        <div className="bg-white grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full overflow-hidden rounded-2xl shadow-lg">

          {/* LEFT CONTENT */}
          <div className="bg-gray-50 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
            <h4 className="text-xs sm:text-sm text-gray-500 uppercase font-semibold mb-2">
              We’re here to help you
            </h4>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug mb-4">
              Discuss Your Learning Goals
            </h1>

            <p className="text-sm sm:text-base text-gray-600 mb-8">
              Reach out to us — we’re here to guide you every step.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full shrink-0">
                  <IconMail />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">E-mail</p>
                  <p className="font-medium text-gray-800">
                    info@educandle.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full shrink-0">
                  <IconPhoneCall />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="font-medium text-gray-800">
                    01354510719
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="p-6 sm:p-8 md:p-10 bg-white">
            {success && (
              <p className="text-green-600 mb-4 font-medium">
                Enquiry submitted successfully!
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />

              <input
                type="text"
                name="course_type"
                placeholder="Course Type (Forex, Crypto, etc.)"
                value={formData.course_type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />

              <textarea
                name="message"
                placeholder="Type your message..."
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white font-semibold rounded-lg px-8 py-3 transition ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Sending..." : "Get a Solution"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
