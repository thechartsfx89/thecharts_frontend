"use client";

import { useState } from "react";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { TcPage } from "@/components/pages/Landing/page-shell";

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[#0b1b33] outline-none transition placeholder:text-slate-400 focus:border-[#16c75f] focus:bg-white focus:ring-2 focus:ring-[#16c75f]/25";

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
    <TcPage>
      <section className="tc-page-hero relative overflow-hidden px-4 py-14 sm:px-6 sm:py-20">
        <div className="tc-page-hero-grid absolute inset-0" aria-hidden="true" />

        <div className="tc-rise relative mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-5">

          {/* LEFT CONTENT */}
          <div className="tc-grid-bg relative flex flex-col justify-center overflow-hidden bg-[#0b1b33] p-8 text-white sm:p-12 lg:col-span-2">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#16c75f]/25 blur-3xl" />

            <div className="relative">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#16c75f]">
                We’re here to help you
              </h4>

              <h1 className="tc-serif mt-4 text-3xl font-black leading-tight sm:text-4xl">
                Discuss Your Learning Goals
              </h1>

              <p className="mt-4 leading-relaxed text-white/70">
                Reach out to us — we’re here to guide you every step.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#16c75f]/15 text-[#16c75f]">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-white/50">E-mail</p>
                    <a href="mailto:thechartsfx89@gmail.com" className="break-all font-medium text-white transition hover:text-[#16c75f]">
                      thechartsfx89@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#16c75f]/15 text-[#16c75f]">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm text-white/50">Phone</p>
                    <a href="tel:01354510719" className="font-medium text-white transition hover:text-[#16c75f]">
                      01354510719
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="p-6 sm:p-10 lg:col-span-3 lg:p-12">
            {success && (
              <p role="status" className="mb-5 rounded-xl border border-[#16c75f]/30 bg-[#e9f8ef] px-4 py-3 font-medium text-[#0e9f4a]">
                Enquiry submitted successfully!
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  aria-label="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  aria-label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  aria-label="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                />

                <input
                  type="text"
                  name="course_type"
                  placeholder="Course Type (Forex, Crypto, etc.)"
                  aria-label="Course Type"
                  value={formData.course_type}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                />
              </div>

              <textarea
                name="message"
                placeholder="Type your message..."
                aria-label="Message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className={fieldClass}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b1b33] px-8 py-4 font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-[#13284a] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Sending..." : "Get a Solution"} <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </TcPage>
  );
}
