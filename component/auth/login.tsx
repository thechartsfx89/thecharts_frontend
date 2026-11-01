"use client"
import { TheChartsThemedLogo } from '@/components/pages/Landing/logo';
import React, { useEffect } from 'react'
import { Dialog, DialogPanel, Transition, Tab, TransitionChild } from '@headlessui/react';
import { useState, Fragment } from 'react';
import IconMail from '@/components/icon/icon-mail';
import IconLock from '@/components/icon/icon-lock';
import Link from 'next/link';
// import Signup from './signup';
import { showToast } from '@/utils/toast';
import { useForm } from 'react-hook-form';
import { LoginForm, loginSchema, RegisterForm, registerSchema } from '@/utils/formValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import HookFormInputField from '@/hooks/hookFormInput';
import { registerLoader, startLoading, stopLoading } from '@/lib/loader';
import IconLoader from '@/components/icon/icon-loader';
import HookFormCheckboxField from '@/hooks/hookFormCheckbox';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Signup from './signup';
import { getSession, signIn, useSession } from "next-auth/react";
const Login = React.memo(function Login({
    isToggle,
    onClose,
    onSwitchToSignup,
    onSwitchToForgot
}: {
    isToggle: boolean;
    onClose: () => void;
    onSwitchToSignup: () => void;
    // onSwitchToSignup: () => void;
    onSwitchToForgot: () => void;
    page?: boolean;

}) {
    const [toggleReg, setToggleReg] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const callbackUrl = searchParams.get("callbackUrl");

    const currentUrl =
        pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
        console.log({ currentUrl, callbackUrl });
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        setValue,
    } = useForm<LoginForm>({
        resolver: yupResolver(loginSchema) as any,
        defaultValues: {
            identifier: "",
            password: "",
            rememberMe: false
        },
    });
    const email = watch("identifier");
    const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
    const onSubmit = async (val: LoginForm): Promise<void> => {
        try {
            registerLoader(setLoading);
            startLoading();

            const res: any = await signIn("credentials", {
                redirect: false,
                identifier: val.identifier,
                password: val.password,
                rememberMe: val.rememberMe,
                // callbackUrl: callbackUrl ?? "" // default redirect after login
            });
            // console.log("Login Response:", res);
            if (res?.error) {
                const err = res?.error?.toLowerCase() || "";

                if (res?.status === 401 && err.includes("email") && err.includes("confirmed")) {
                    setIsEmailVerified(true);
                }

                showToast("error", res?.error || "Login failed");
                return;
            }

            const session: any = await getSession(); // ✅ fetch latest session
            // console.log({ session });
            const role = session?.user?.role;

            // if (role === "student") router.push("/dash/student");
            // else if (role === "mentor") router.push("/dash/mentor");
            if (callbackUrl && callbackUrl?.includes("/dash")) {
                router.push(callbackUrl);
                 onClose();
            } else if (callbackUrl) {
                router.push(currentUrl);
                 onClose();
            } else {
                if (role === "student") router.push("/dash/student");
                else if (role === "admin") router.push("/dash/admin");
                else if (role === "mentor") router.push("/dash/mentor");
                 onClose();
            }


            // else router.push("/dash/analytics");

            showToast("success", "Login successful");
            reset();
            onClose();
        } catch (err: any) {
            showToast("error", err?.message || "Something went wrong");
        } finally {
            stopLoading();
        }
    };



    const onError = (errors: any) => {
        //   showToast("info","Please fill required field");
        console.log("❌ Validation Errors:", errors);
    };

    //  const [loading, setLoading] = useState(false);

    const emailResendHandler = async (val: any): Promise<void> => {
        try {
            registerLoader(setEmailLoading);
            startLoading();

            // ✅ Step 1: Call Strapi forgot password API
            const res = await fetch(`/api/auth/email/confirmation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: val ?? email ?? "", // user email
                }),
            });

            const data = await res.json();

            // ✅ Step 2: Handle response
            if (!res.ok) {
                showToast("error", data?.error?.message || "Failed to send email");
                return;
            }

            // ✅ Step 3: Success
            showToast("success", "Email Resent Successfully");
            reset();
            onClose();
            setIsEmailVerified(false);

        } catch (err: any) {
            showToast("error", err.message || "Something went wrong");
        } finally {
            stopLoading();
        }
    };

    return (
        <>


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
                        <div className="fixed inset-0" />
                    </TransitionChild>
                    <div id="login_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
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

                                    <div className="flex items-center justify-between p-5 font-semibold text-lg dark:text-white">
                                        {/* <div className='flex justify-center'>
                                        <img src="/assets/landing/logo2.png" alt="img"/>
                                    </div> */}
                                        <div className='flex items-center gap-3'>
                                            <TheChartsThemedLogo className="h-9" />
                                            <h5 className='text-dark'>Login</h5>
                                        </div>

                                        <button
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
                                        </button>

                                    </div>

                                    <div className="p-5">
                                        {isEmailVerified && <div className='p-3 mb-4 rounded text-secondary bg-secondary-light dark:bg-secondary-dark-light'>
                                            <strong className="ltr:mr-1 rtl:ml-1  text-xs">It seems your email is not verified.</strong>
                                            <div className="flex items-center pt-2">
                                                <span className=' text-xs font-semibild'>
                                                    Please check your inbox or click 'Resend' to get a new verification link.
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => emailResendHandler(email ?? "")}
                                                    className="btn btn-sm bg-white text-black shadow-sm hover:shadow-md hover:bg-gray-100 transition-all"
                                                >
                                                    {emailLoading ? (
                                                        <>
                                                            <IconLoader
                                                                className="inline-block shrink-0 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2 text-primary-600"
                                                            />
                                                            Sending..
                                                        </>
                                                    ) : (
                                                        "Resend"
                                                    )}
                                                </button>


                                            </div>
                                        </div>}
                                        <form onSubmit={handleSubmit(onSubmit, onError)}
                                            className="space-y-5 ">
                                            <div className="relative mb-4">
                                                <HookFormInputField
                                                    label="Identifier"
                                                    name="identifier"
                                                    control={control}
                                                    placeholder="Enter Username or Email"
                                                    error={errors.identifier?.message}
                                                    icon={<IconMail className='color-[#000]' />}
                                                    required
                                                    className="form-input ltr:pl-10 rtl:pr-10  "
                                                />
                                                <div className='mt-4'></div>
                                                <HookFormInputField
                                                    label="Password"
                                                    name="password"
                                                    type="password"
                                                    control={control}
                                                    placeholder="Enter Password"
                                                    error={errors.password?.message}
                                                    icon={<IconLock />}
                                                    required
                                                    className="form-input ltr:pl-10 rtl:pr-10"
                                                />
                                                {/* <span className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 dark:text-white-dark">
                                                    <IconMail />
                                                </span>
                                                <input type="email" placeholder="Email" className="form-input ltr:pl-10 rtl:pr-10 
                                                " id="login_email" /> */}
                                            </div>

                                            <div className="flex items-center justify-between text-sm py-2">
                                                <div className="flex items-center ">



                                                    <HookFormCheckboxField
                                                        // label="Remember Me"
                                                        name="rememberMe"
                                                        control={control}
                                                        // error={errors.rememberMe?.message}
                                                        // labelClassName=
                                                        label={<span className="flex items-center justify-center gap-2 text-white-dark dark:text-gray-300 cursor-pointer">Remember Me</span>}
                                                    // className="!h-4 !w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer !text-white-dark dark:text-gray-300 cursor-pointer"
                                                    />
                                                </div>
                                                <Link
                                                    href="#"
                                                    className="text-white-dark hover:underline hover:text-[#4361ee] mt-[-8px] pt-[-4px]"
                                                    // className="text-gray-500 dark:text-gray-300 hover:underline hover:text-[#4361ee]"
                                                    onClick={() => {
                                                        onClose();
                                                        setTimeout(onSwitchToForgot, 300);
                                                    }}
                                                >
                                                    Forgot Password?
                                                </Link>
                                            </div>
                                            {/* <Link href="/dash/analytics"> */}
                                            {/* <button type="submit" className="btn btn-primary w-full">
                                                Login
                                            </button> */}
                                            <button type="submit" disabled={loading} className="btn btn-primary w-full ">
                                                {loading ?
                                                    <> <IconLoader className="inline-block shrink-0 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2" />Loading...</> :
                                                    "Login"
                                                }
                                            </button>
                                            {/* </Link> */}
                                        </form>
                                    </div>
                                    {/* <div className="my-4 text-center text-xs text-white-dark dark:text-white-dark/70">OR</div>
                                    <div className="flex items-center justify-center gap-3 mb-5">
                                        <button type="button" className="btn btn-outline-primary flex gap-1">
                                           

                                            <span>Facebook</span>
                                        </button>
                                        <button type="button" className="btn btn-outline-danger flex gap-1">
                                           
                                            <span>Github</span>
                                        </button>
                                    </div> */}

                                    <div className="p-5 border-t border-[#ebe9f1] dark:border-white/10">
                                        <p className="text-sm text-center text-white-dark dark:text-white-dark/70">
                                            Looking to
                                            <button type="button"
                                                onClick={() => {
                                                    onClose();
                                                    setTimeout(onSwitchToSignup, 300);
                                                }} className="text-[#515365] hover:underline dark:text-white-dark ltr:ml-1 rtl:mr-1 " >
                                                create an account?
                                            </button>
                                        </p>

                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            {/* <Signup isToggle={toggleReg} onClose={() => setToggleReg(false)}
                onSwitchToLogin={() => {
                    setToggleReg(false);
                    setTimeout(onClose, 300);
                }}
            /> */}

        </>
    )
})
export default Login;