"use client"
import { TheChartsThemedLogo } from '@/components/pages/Landing/logo';
import IconLoader from '@/components/icon/icon-loader';
import IconLock from '@/components/icon/icon-lock';
import HookFormCheckboxField from '@/hooks/hookFormCheckbox';
import HookFormInputField from '@/hooks/hookFormInput';
import { registerLoader, startLoading, stopLoading } from '@/lib/loader';
import { ResetPasswordForm, resetPasswordSchema } from '@/utils/formValidation';
import { showToast } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
// import { Link } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

export default function page() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const code = searchParams.get("code"); // get code from URL
    const router = useRouter()

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        setValue,
    } = useForm<ResetPasswordForm>({
        resolver: yupResolver(resetPasswordSchema) as any,
        defaultValues: {
            newPassword: "",
            confirmNewPassword: "",
        },
    });
    const onSubmit = async (val: ResetPasswordForm): Promise<void> => {

        try {
            registerLoader(setLoading);
            startLoading();
            const res = await fetch("/api/auth/resetPassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code,
                    password: val?.newPassword,
                    passwordConfirmation: val?.confirmNewPassword
                })
            });



            // console.log({ res })
            if (res?.status !== 200) {
                showToast("error", res?.statusText || "Something went wrong");
                return;
            } else {
                showToast("success", "Password Reset Successful");
                reset();
                // onClose();
                router.push("/")
            }

            // Optional: redirect or reset form here
        } catch (err: any) {
            showToast("error", err.message || "Something went wrong");
        } finally {
            stopLoading();
        }
    };
    return (
          <div className="relative min-h-screen overflow-hidden bg-[#fafafa]">
    {/* Background Decorations */}
    <div className="absolute inset-0">
        <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
    </div>

    {/* Main Content Container */}
    <div className="relative flex min-h-screen items-start justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-4 py-10 dark:bg-[#060818]">
        
        {/* Decorative Objects */}
        <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2 -z-10" />
        <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
        <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />

        {/* The Card Wrapper */}
        <div className="flex w-full flex-col items-center justify-start z-[999]">
            
            {/* Logo Section */}
            <div className="flex items-center mb-4">
                            <Link href="/">
                                <div className=" flex items-center">
                                    <TheChartsThemedLogo className="h-14" />
                                </div>
                            </Link>
                        </div>

            {/* Adjusted Card: wider max-width for better desktop presence */}
            <div className="bg-white/80 backdrop-blur-md w-full max-w-[400px] rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                
                <div className="p-10">
                    <div className="mb-8 text-center">
                        <h5 className="text-xl font-extrabold text-dark mb-2">Reset Password</h5>
                        <p className="text-sm text-gray-500">Secure your account by entering a new password</p>
                    </div>

                   
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email field */}
                        <HookFormInputField
                            label="New Password"
                            name="newPassword"
                            control={control}
                            placeholder="New Password"
                            icon={<IconLock />}
                            error={errors.newPassword?.message}
                            required
                            className="form-input ltr:pl-10 rtl:pr-10 "
                        />

                        {/* Password field */}
                        <HookFormInputField
                            label="Confirm New Password"
                            name="confirmNewPassword"
                            // type=""
                            control={control}
                            icon={<IconLock />}
                            placeholder="Confirm New Password"
                            error={errors.confirmNewPassword?.message}
                            required
                            className="form-input ltr:pl-10 rtl:pr-10"

                        />


                        <div className="flex items-center justify-between text-sm ">

                        </div>

                        <button type="submit" disabled={loading} 
                    className="btn btn-gradient !mt-6 w-full border-0 py-3 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"

                        >
                            {loading ? (
                                <>
                                    <IconLoader className="inline-block shrink-0 animate-[spin_2s_linear_infinite] align-middle mr-2" />
                                    Loading...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </form>
                </div>

                <div className="p-6 bg-gray-50/80 border-t border-gray-100 text-center">
                    <p className="text-gray-600">
                        Suddenly remembered? 
                        <Link href="/" className="text-primary font-bold hover:underline ml-2">
                            Back to Home
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
        // </div>

    )
}
