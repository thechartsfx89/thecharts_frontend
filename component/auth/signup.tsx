"use client"
import { TheChartsThemedLogo } from '@/components/pages/Landing/logo';
import React, { use, useEffect } from 'react'
import { Dialog, DialogPanel, Transition, Tab, TransitionChild } from '@headlessui/react';
import { useState, Fragment } from 'react';
import IconMail from '@/components/icon/icon-mail';
import IconLock from '@/components/icon/icon-lock';
import Link from 'next/link';
import Captcha from './captcha';
import HookFormInputField from '@/hooks/hookFormInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterForm, registerSchema } from '@/utils/formValidation';
import HookFormSelectField from '@/hooks/hookFormSelect';
import HookFormCheckboxField from '@/hooks/hookFormCheckbox';
import Swal from 'sweetalert2';
import { registerLoader, startLoading, stopLoading } from '@/lib/loader';
import IconLoader from '@/components/icon/icon-loader';
import Login from './login';
import { country } from '@/utils/constant/countryName';
import { capitalizeFirstWord, capitalizeSubstring } from '@/utils/helpers/capitalize';
import { useRouter, useSearchParams } from 'next/navigation';
import { set } from 'lodash';

const Signup = React.memo(function Signup({
    isToggle,
    onClose,
    onSwitchToLogin,
    onSwitchToConfirmEmail,
    page
}: {
    isToggle: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
    onSwitchToConfirmEmail: (email: string) => void;
    page?: boolean;
}) {

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        setValue,
    } = useForm<RegisterForm>({
        resolver: yupResolver(registerSchema) as any,
        defaultValues: {
            // referralCode: null,
            referralName: "",
            firstName: "",
            lastName: "",
            email: "",
            mobileNumber: undefined,
            gender: "",
            dob: undefined,
            password: "",
            confirmPassword: "",
            country: "",
            terms: false,
            role: 3,
            captcha: "",
            referralBy: "",
            referralByCode: "",
        },
    });
    const [toggle, setToggle] = useState<boolean>(false);
    const [toggleLog, setToggleLog] = useState<boolean>(false);

    const searchParams = useSearchParams();
    const refId = searchParams.get("refId");
    // console.log({ refId });
    const showToast = (
        type: "success" | "error" | "warning" | "info" | "question",
        message: string,
        duration: number = 3000
    ) => {
        const toast = Swal.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: duration,
        });

        toast.fire({
            icon: type,
            title: message,
            padding: "10px 20px",
        });
    };

    // useEffect(()=>{
    // showAlert("success", "Done!", "Your data has been saved successfully.");
    // },[])
    const [loading, setLoading] = useState(false);
    console.log({ loading })


    const router = useRouter();
    const referralApi = async (referralBy: string, referrals:string) => {
        const res = await fetch("/api/referral/level", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ referralBy, referrals  }),
        });

        return res.json();
    };

    const onSubmit = async (data: RegisterForm): Promise<any> => {
        // console.log("Form Data: ", data);
        const { confirmPassword, referralName, captcha, terms, ...val } = data;

        try {
            // Start the loader
            registerLoader(setLoading);
            startLoading();
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // username: val?.email,
                    fullName: capitalizeSubstring(
                        `${val?.firstName ?? ""} ${val?.lastName ?? ""}`
                    ),
                    first_password: val?.password,
                    ...val,
                    // mobileNumber: Number(val?.mobileNumber),
                }),
            });

            const result = await res.json();
            // console.log({ result });

            if (!result || result.status >= 400) {
                const errorMessage = result?.error || "Something went wrong";
                showToast("error", errorMessage);
                throw new Error(errorMessage);
            } 
            if (result?.status === 201 || result?.status === 200) {
                console.log("Referral Code:", result);
                try {
                    const refById = watch("referralBy");
                    await referralApi(refById, result?.data?.user?.id);
                } catch (err) {
                    console.error("Referral API failed", err);
                    // ❗ Do NOT stop registration
                }

                showToast("success", "Account Created");
                reset();
                onClose();
                const email = val?.email ?? "";
                // wait for 500ms
                if (page) {
                    router.push(
                        `/auth/verify-email?eid=${encodeURIComponent(email)}`
                    );
                } else {
                    setTimeout(() => {
                        onSwitchToConfirmEmail(email);
                    }, 300);
                }
            }

            // console.log("Registration successful:", result);
            // e.g., redirect to login/dashboard
        } catch (error: any) {
            console.log("Registration error:", error);
            if (error?.message?.includes("already") && error?.message?.includes("taken")) {
                return showToast("error", "Email already taken");
            }
            showToast("error", error?.message || "Something Went Wrong");
            // showToast("error", "Something Went Wrong");

        } finally {
            // Stop the loader in both success and error cases
            stopLoading();
        }
    };


    const onError = (errors: any) => {
        //   showToast("info","Please fill required field");
        console.log("❌ Validation Errors:", errors);
    };

    const fetchReferralName = async (code: string) => {
        if (!code || code.length < 8) return;

        try {
            const res = await fetch(`/api/referral/lookup?code=${code}`);
            const data = await res.json();

            if (!res.ok) {
                setValue("referralName", "");
                showToast("error", "Sponsor does not exist");
                return;
            }
                showToast("success", "Sponsor found");
            
            setValue("referralName", data?.name);
            setValue("referralBy", data?.userId);
        } catch {
            showToast("error", "Sponsor Does not Exist");
            setValue("referralName", "");
        }
    };
    useEffect(() => {
        if (refId) {
            setValue("referralByCode", refId);
            fetchReferralName(refId);
        }
    }, [refId]);
    return (
        <>
            <Transition appear show={isToggle} as={Fragment}>
                <Dialog as="div" open={isToggle} onClose={onClose} >
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
                    <div id="login_modal" className={page ? `fixed inset-0  z-[999] overflow-y-auto` : "fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto"}>
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
                                <DialogPanel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-3xl my-8 text-black dark:text-white-dark">

                                    <div className="flex items-center justify-between p-5 font-semibold text-lg dark:text-white">
                                        <div className='flex items-center gap-3'>
                                            <TheChartsThemedLogo className="h-9" />
                                            <h5 className='text-dark'>Register</h5>
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

                                    <form onSubmit={handleSubmit(onSubmit, onError)}
                                        className="space-y-5 py-4 px-4 lg:px-8 border rounded-lg">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <HookFormInputField
                                                label="Referral code"
                                                name="referralByCode"
                                                control={control}
                                                placeholder="Enter Referral Code"
                                                error={errors.referralByCode?.message}
                                                required
                                                onChange={(e: any) => {
                                                    const code = e.target.value;
                                                    setValue("referralByCode", code);
                                                    fetchReferralName(code);
                                                }}
                                            />
                                            <HookFormInputField
                                                label="Referral Name"
                                                name="referralName"
                                                control={control}
                                                placeholder="Referral Name"
                                                error={errors.referralName?.message}
                                                disabled
                                                required
                                            />
                                            {/* <div>
                                                <label htmlFor="gridEmail" className='text-sm font-medium'>Referral ID</label>
                                                <input id="gridEmail" type="email" placeholder="Enter Referral Id" className="w-full rounded-md border border-gray-300 p-2 text-sm font-light placeholder:font-thin placeholder:text-gray-500" />
                                            </div> */}
                                            {/* <div>
                                                <label htmlFor="gridPassword" className='text-sm font-medium'>Referral Name</label>
                                                <input id="gridPassword" type="Password" placeholder="Enter Referral Name" className="w-full rounded-md border border-gray-300 p-2 text-sm font-light placeholder:font-thin placeholder:text-gray-500" />
                                            </div> */}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <HookFormInputField
                                                label="First Name"
                                                name="firstName"
                                                control={control}
                                                placeholder="Enter First Name"
                                                error={errors.firstName?.message}
                                                required
                                            />
                                            {/* <div>
                                                <label htmlFor="gridEmail" className='text-sm font-medium'>First Name</label>
                                                <input id="gridEmail" type="email" placeholder="Enter First Name" className="w-full rounded-md border border-gray-300 p-2 text-sm font-light placeholder:font-thin placeholder:text-gray-500" />
                                            </div> */}
                                            <HookFormInputField
                                                label="Last Name"
                                                name="lastName"
                                                control={control}
                                                placeholder="Enter Last Name"
                                                error={errors.lastName?.message}
                                                required
                                            />
                                            {/* <div>
                                                <label htmlFor="gridPassword" className='text-sm font-medium'>Last Name</label>
                                                <input id="gridPassword" type="Password" placeholder="Enter Last Name" className="w-full rounded-md border border-gray-300 p-2 text-sm font-light placeholder:font-thin placeholder:text-gray-500" />
                                            </div> */}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <HookFormSelectField
                                                label="Gender"
                                                name="gender"
                                                control={control}
                                                placeholder="Select Gender"
                                                options={[
                                                    // { value: "", label: "S" },
                                                    { value: "male", label: "Male" },
                                                    { value: "female", label: "Female" },
                                                ]}
                                                error={errors.gender?.message}
                                                required
                                            // searchable
                                            />

                                            <HookFormInputField
                                                label="D.O.B"
                                                name="dob"
                                                type="date"
                                                control={control}
                                                placeholder="Enter Date of Birth"
                                                error={errors.dob?.message}
                                                required />



                                            <HookFormInputField
                                                label="Mobile No."
                                                name="mobileNumber"
                                                control={control}
                                                placeholder="Enter Mobile No."
                                                error={errors.mobileNumber?.message}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <HookFormInputField
                                                label="Email"
                                                name="email"
                                                type="email"
                                                control={control}
                                                placeholder="Enter Email"
                                                error={errors.email?.message}
                                                required
                                            />
                                            <HookFormSelectField
                                                label="Country"
                                                name="country"
                                                control={control}
                                                placeholder="Select Country"
                                                options={country.map((c) => ({
                                                    value: c,
                                                    label: c,
                                                }))}

                                                error={errors.country?.message}
                                                required
                                            // searchable
                                            />
                                        </div>




                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <HookFormInputField
                                                label="Password"
                                                name="password"
                                                type="password"
                                                control={control}
                                                placeholder="Enter Password"
                                                error={errors.password?.message}
                                                required
                                            />
                                            <HookFormInputField
                                                label="Confirm Password"
                                                name="confirmPassword"
                                                type="password"
                                                control={control}
                                                placeholder="Enter Confirm Password"
                                                error={errors.confirmPassword?.message}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                            <HookFormCheckboxField
                                                name="terms"
                                                id="terms"
                                                control={control}
                                                required
                                                error={errors?.terms?.message}
                                                label={
                                                    <>
                                                        I agree to the {" "}
                                                        <Link
                                                            href="/terms-and-conditions"
                                                            className="text-blue-300 underline hover:text-blue-400" style={{ color: "blue" }}
                                                        >
                                                            Terms & Conditions
                                                        </Link>
                                                    </>
                                                }
                                            />
                                            {/* <div>
                                                <Captcha
                                                    onChange={(token: any) => setValue("captcha", token, { shouldValidate: true })}
                                                    onExpired={() => setValue("captcha", "", { shouldValidate: true })}
                                                />
                                                {errors.captcha?.message &&
                                                    <span className="text-red-500 text-xs inline block leading-none" style={{ color: "red" }}>{errors.captcha?.message}</span>
                                                }</div> */}
                                            {/* <div className="">
                                                <HookFormInputField
                                                    name="captcha"
                                                    control={control}
                                                    type="hidden"
                                                // error={errors.captcha?.message}
                                                />

                                            </div> */}


                                        </div>
                                        <div className='flex justify-end'>
                                            <button type="submit" disabled={loading} className="btn btn-primary btn-md ">
                                                {loading ?
                                                    <> <IconLoader className="inline-block shrink-0 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2" />Loading...</> :
                                                    "Submit"
                                                }
                                            </button>
                                        </div>
                                    </form>
                                    
                                    <div className="p-5 border-t border-[#ebe9f1] dark:border-white/10">
                                        {page ?  
                                        <p className="text-sm text-center text-white-dark dark:text-white-dark/70">
                                            Already
                                           <Link href="/auth/login">
                                           <button type="button"
                                                className="text-[#515365] hover:underline dark:text-white-dark ltr:ml-1 rtl:mr-1">
                                                have an account?
                                            </button>
                                            </Link> 
                                        </p>
                                        : 
                                        <p className="text-sm text-center text-white-dark dark:text-white-dark/70">
                                            Already
                                            <button type="button"
                                                onClick={() => {
                                                    onClose();
                                                    setTimeout(onSwitchToLogin, 300);
                                                }}
                                                className="text-[#515365] hover:underline dark:text-white-dark ltr:ml-1 rtl:mr-1">
                                                have an account?
                                            </button>
                                        </p>}
                                    </div>

                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
})
export default Signup;

