"use client";
import React, { useState, Fragment } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import IconMail from "@/components/icon/icon-mail";
import { useForm } from "react-hook-form";
import { ForgotPasswordForm, ForgotSchema, LoginForm } from "@/utils/formValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import HookFormInputField from "@/hooks/hookFormInput";
import { registerLoader, startLoading, stopLoading } from "@/lib/loader";
import { showToast } from "@/utils/toast";
import IconLoader from "@/components/icon/icon-loader";
import { useSearchParams } from "next/navigation";

export default function ConfirmEmail(
    { isToggle, onClose, email, page }:
        {
            isToggle: boolean;
            onClose: () => void;
            email: string | null;
            page?: boolean;
        }) {
    const [isOpen, setIsOpen] = useState(false);
    console.log({ email })

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        setValue,
    } = useForm<any>({
        // resolver: yupResolver(ForgotSchema) as any,
        defaultValues: {
            identifier: email || "",
        },
    });
    const [loading, setLoading] = useState(false);
    
    const onSubmit = async (val: any): Promise<void> => {
        try {
            registerLoader(setLoading);
            startLoading();

            // ✅ Step 1: Call Strapi forgot password API
            const res = await fetch(`/api/auth/email/confirmation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: val, // user email
                }),
            });

            const data = await res.json();

            // ✅ Step 2: Handle response
            if (!res.ok) {
                showToast("error", data?.error?.message || "Failed to send email");
                return;
            }

            // ✅ Step 3: Success
            showToast("success", "Email resent successfully");
            reset();
            onClose();

        } catch (err: any) {
            showToast("error", err.message || "Something went wrong");
        } finally {
            stopLoading();
        }
    };

    return (


        <Transition appear show={isToggle} as={Fragment}>
            <Dialog as="div" open={isToggle} onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 " />
                </TransitionChild>

                <div className={page ? `fixed inset-0  z-[999] overflow-y-auto` : "fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto"}>
                    <div className="flex items-start justify-center min-h-screen px-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-sm my-8 text-black dark:text-white-dark">
                                {/* Header */}
                                <div className="flex items-center justify-between p-5 font-semibold text-lg dark:text-white">
                                    <div className='flex gap-2'>
                                        <img src="/assets/images/auth/logo-mob.png" alt="img" width={40} />
                                        <h5 className='text-dark'>Check Your Email</h5>
                                    </div>

                                    {!page && <button
                                        type="button"
                                        onClick={onClose}
                                        className="p-2 rounded-full hover:bg-gray-200 transition"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-6 text-white-dark hover:text-black transition"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.5}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>}
                                </div>

                                {/* Form */}
                                <div className="p-5 pt-0">
                                    <div className="flex items-center p-3.5 rounded text-dark  dark:bg-info-dark-light">
                                        <span className="ltr:pr-2 rtl:pl-2 text-md text-center">
                                            {/* <strong className="ltr:mr-1 rtl:ml-1">Info!</strong> */}
                                            To verify your identity, a verification link has been sent to
                                            <strong className="ltr:mr-1 rtl:ml-1"> {email ?? ""}</strong>

                                            .Please check your email to activate your account.
                                        </span>
                                        <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80">
                                        </button>
                                    </div>

                                    {/* <span className="text-xs">Enter Your email so that we can send you password reset link</span> */}
                                    <form onSubmit={handleSubmit(() => onSubmit(email), (err) => console.log(err))}
                                        className="space-y-5 mt-4">
                                        <div className="relative mb-4">

                                        </div>
                                        {/* <button type="submit" className="btn btn-primary w-full">
                                      Submit
                                        </button> */}
                                        <button type="submit" className="btn btn-primary w-full  ">
                                            {loading ?
                                                <> <IconLoader className="inline-block shrink-0 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2" />Loading...</> :
                                                "Resend Email"
                                            }
                                        </button>
                                    </form>
                                </div>

                                {/* Footer */}
                                <div className="p-5 border-t border-[#ebe9f1] dark:border-white/10">
                                    <p className="text-sm text-center text-white-dark dark:text-white-dark/70 text-center">
                                        Nothing in sight? {" "}
                                        {/* info@educandle.com */}
                                        <a className="text-primary underline" href="mailto:info@educandle.com?subject=Need%20help%20with%20email%20verification" role="button">
                                            Contact Support
                                        </a>
                                        {/* <button
                      type="button"
                      className="text-[#515365] hover:underline dark:text-white-dark ltr:ml-1 rtl:mr-1"
                      onClick={() => {
                        onClose();
                        setTimeout(onSwitchToLogin, 300);
                      }}
                    >
                      Login?
                    </button> */}
                                    </p>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>

    );
}
