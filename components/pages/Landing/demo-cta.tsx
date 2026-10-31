'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowRight } from 'lucide-react';
import { showToast } from '@/utils/toast';

type EmailFormData = { email: string };

export default function DemoCTA() {
    const { register, handleSubmit, reset } = useForm<EmailFormData>();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: EmailFormData) => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/email/demo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email }),
            });
            const result = await res.json();
            if (res.ok) {
                showToast('success', 'Email sent successfully!');
                reset();
            } else {
                showToast('error', result.error || 'Something went wrong');
            }
        } catch (error) {
            showToast('error', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="demo" className="scroll-mt-24 px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
            <div className="tc-grid-bg relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#0b1b33] px-6 py-14 text-center sm:px-12 sm:py-20">
                <div className="absolute -bottom-32 left-1/2 h-72 w-[80%] -translate-x-1/2 rounded-full bg-[#16c75f]/30 blur-3xl" />
                <div className="relative">
                    <h2 className="tc-serif mx-auto max-w-2xl text-3xl font-black leading-tight text-white sm:text-5xl">
                        Ready to read the charts <span className="text-[#16c75f]">with confidence?</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-white/70">Book a free demo session and see how our lessons, live analysis and mentorship work before you enrol.</p>

                    <form onSubmit={handleSubmit(onSubmit, () => showToast('error', 'Email is required'))} className="mx-auto mt-10 flex max-w-xl flex-col gap-3 rounded-2xl bg-white/10 p-2 backdrop-blur sm:flex-row">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            aria-label="Email address"
                            {...register('email', { required: true })}
                            className="flex-1 rounded-xl bg-white px-5 py-3.5 text-[#0b1b33] outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#16c75f]"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16c75f] px-6 py-3.5 font-semibold text-[#0b1b33] transition hover:bg-[#2fe079] disabled:opacity-70"
                        >
                            {loading ? 'Sending...' : 'Book a Demo'} <ArrowRight className="h-4 w-4" />
                        </button>
                    </form>
                    <p className="mt-6 text-sm text-white/50">
                        Trusted by <span className="font-semibold text-white">5000+</span> students
                    </p>
                </div>
            </div>
        </section>
    );
}
