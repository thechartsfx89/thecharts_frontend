'use client';
import IconDollarSignCircle from '@/components/icon/icon-dollar-sign-circle';
import IconFacebook from '@/components/icon/icon-facebook';
import IconGithub from '@/components/icon/icon-github';
import IconHome from '@/components/icon/icon-home';
import IconLinkedin from '@/components/icon/icon-linkedin';
import IconPhone from '@/components/icon/icon-phone';
import IconTwitter from '@/components/icon/icon-twitter';
import IconUser from '@/components/icon/icon-user';
import { getImageUrl } from '@/utils/common/common';
import React, { useEffect, useRef, useState } from 'react';
import { Upload } from "lucide-react";
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import HookFormInputField from '@/hooks/hookFormInput';
import HookFormSelectField from '@/hooks/hookFormSelect';
import { country } from '@/utils/constant/countryName';
import { ProfileForm, profileSchema, registerSchema } from '@/utils/formValidation';
import { showToast } from '@/utils/toast';
import IconLoader from '@/components/icon/icon-loader';
import { useRouter } from 'next/navigation';
// import { redirect } from 'next/navigation';
// import { useRouter } from 'next/router';
const ComponentsUsersAccountSettingsTabs = () => {
    const [tabs, setTabs] = useState<string>('home');
    const [profileData, setProfileData] = useState<any>(null);
    const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
    const { data: session, update } = useSession();
    const router = useRouter();
    const toggleTabs = (name: string) => {
        setTabs(name);
    };
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current?.click();   // trigger hidden file input
    };

    const handleFileChange = async (e: any) => {
        try {
            setIsProfileLoading(true);

            const file = e.target.files?.[0];
            if (!file) {
                showToast("error", "No file selected");
                return;
            }

            console.log("Selected file:", file);

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/auth/profile", {
                method: "POST",
                body: formData,
            });

            if (res?.status !== 200) {
                const errorData = await res.json().catch(() => null);
                throw new Error(errorData?.message || "Upload failed");

            }


            // Success
            showToast("success", "Profile Image Updated!");
            // router.push("/dash/student/profile");

        } catch (error: any) {
            console.error("Upload error:", error);
            showToast("error", error.message || "Something went wrong");
        } finally {
            setIsProfileLoading(false);
        }
    };


    const getProfile = async () => {
        try {
            const res = await fetch("/api/student/profile", {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch profile");
            }

            const data = await res.json();
            console.log({ data: data?.data })
            if (data?.status == 200) {
                setProfileData(data?.data)
                await update({
                    user: {
                        ...session?.user,
                        profileImage: data?.data?.profile_image?.url,   // 👈 your new image URL from response
                    },
                });
            }
            // return data.email; // only email
        } catch (err) {
            console.error("Profile fetch failed:", err);
            return null;
        }
    };

    useEffect(() => {
        getProfile()
    }, [isProfileLoading])


    // const { data: session } = useSession();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        setValue,
    } = useForm<ProfileForm>({
        resolver: yupResolver(profileSchema) as any,
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            mobileNumber: undefined,
            gender: "",
            dob: undefined,
            country: "",
        },
    });
    useEffect(() => {
        if (!profileData) return;

        setValue("firstName", profileData?.firstName ? profileData?.firstName : (profileData?.member_master?.fname ? profileData?.member_master?.fname : ""));
        setValue("lastName", profileData?.lastName ? profileData?.lastName : (profileData?.member_master?.lname ? profileData?.member_master?.lname : ""));
        setValue("email", profileData?.email ? profileData?.email : (profileData?.member_master?.emailid ? profileData?.member_master?.emailid : ""));
        setValue("mobileNumber", profileData?.mobileNumber ? profileData?.mobileNumber : (profileData?.member_master?.mobile ? profileData?.member_master?.mobile : ""));
        setValue("gender", profileData?.gender ? profileData?.gender : (profileData?.member_master?.gender == "0"? "male" : "female"));
        setValue("dob", profileData?.dob ? profileData?.dob : (profileData?.member_master?.dob ? profileData?.member_master?.dob : ""));
        setValue("country", profileData?.country ? profileData?.country : (profileData?.member_master?.country ? profileData?.member_master?.country : ""));

    }, [profileData]);   // 👈 required

    // const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: any) => {
        console.log({ values })
        try {
            setLoading(true);

            // 1. Send data to our server route
            const res = await fetch("/api/student/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const result = await res.json();

            if (!res.ok) {
                showToast("error", result.message || "Update failed");
                setLoading(false);
                return;
            }

            showToast("success", "Profile updated!");
            setLoading(false);
            // redirect("/dash/student/profile")
            router.push("/dash/student/profile");

        } catch (err) {
            console.log(err);
            showToast("error", "Something went wrong");
            setLoading(false);
        }
    };

    const onError = (e: any) => {
        console.log({ e })
        showToast("error", "Validation Error");
    }
    return (
        <div className="pt-5">

            <div>

            </div>
            {tabs === 'home' ? (
                <div>
                    <form onSubmit={handleSubmit(onSubmit, onError)} className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                        <h6 className="mb-5 text-lg font-bold">General Information</h6>
                        <div className="flex flex-col sm:flex-row">
                            <div className="mb-5 w-full sm:w-2/12 ltr:sm:mr-4 rtl:sm:ml-4 
                               flex flex-col justify-start items-center gap-2">

                                <img
                                    // src={`${getImageUrl(profileData?.profile_image?.url)}?t=${Date.now()}`}
                                    src={
                                        profileData?.profile_image?.url
                                            ? `${getImageUrl(profileData?.profile_image?.url)}?t=${Date.now()}`
                                            : profileData?.member_master?.profileimage ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/${profileData?.member_master?.profileimage}` : "/assets/images/fallback-profile.png"
                                    }
                                    alt="img"
                                    className="h-20 w-20 md:h-32 md:w-32 rounded-full object-cover border-2"
                                />
                                <button
                                    type="button"
                                    className="btn btn-secondary flex items-center"
                                    onClick={handleClick}
                                    disabled={isProfileLoading}   // disable during upload
                                >
                                    {isProfileLoading ? (
                                        <>
                                            <IconLoader className="inline-block shrink-0 animate-[spin_2s_linear_infinite] align-middle mr-2" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4.5 h-4.5 mr-2" />
                                            Upload
                                        </>
                                    )}

                                    {/* Hidden file input */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </button>


                            </div>
                            {/* <form onSubmit={handleSubmit(onSubmit, onError)}> */}

                            <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">


                                <HookFormInputField
                                    label="First Name"
                                    name="firstName"
                                    control={control}
                                    placeholder="Enter First Name"
                                    error={errors.firstName?.message}
                                    className='form-input'
                                    required
                                />
                                <HookFormInputField
                                    label="Last Name"
                                    name="lastName"
                                    control={control}
                                    placeholder="Enter Last Name"
                                    error={errors.lastName?.message}
                                    required
                                />
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
                                <HookFormInputField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    control={control}
                                    placeholder="Enter Email"
                                    // error={errors.email?.message}
                                    required
                                    disabled
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

                                <div className="mt-3 sm:col-span-2">
                                    <button type="submit" className="btn btn-primary">
                                        {loading ?
                                            <> <IconLoader className="inline-block shrink-0 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2" />updating...</> :
                                            "Save"
                                        }</button>
                                </div>
                            </div>
                            {/* </form> */}
                        </div>
                    </form>
                    {/* <form className="rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                        <h6 className="mb-5 text-lg font-bold">Social</h6>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="flex">
                                <div className="flex items-center justify-center rounded bg-[#eee] px-3 font-semibold ltr:mr-2 rtl:ml-2 dark:bg-[#1b2e4b]">
                                    <IconLinkedin className="h-5 w-5" />
                                </div>
                                <input type="text" placeholder="jimmy_turner" className="form-input" />
                            </div>
                            <div className="flex">
                                <div className="flex items-center justify-center rounded bg-[#eee] px-3 font-semibold ltr:mr-2 rtl:ml-2 dark:bg-[#1b2e4b]">
                                    <IconTwitter className="h-5 w-5" />
                                </div>
                                <input type="text" placeholder="jimmy_turner" className="form-input" />
                            </div>
                            <div className="flex">
                                <div className="flex items-center justify-center rounded bg-[#eee] px-3 font-semibold ltr:mr-2 rtl:ml-2 dark:bg-[#1b2e4b]">
                                    <IconFacebook className="h-5 w-5" />
                                </div>
                                <input type="text" placeholder="jimmy_turner" className="form-input" />
                            </div>
                            <div className="flex">
                                <div className="flex items-center justify-center rounded bg-[#eee] px-3 font-semibold ltr:mr-2 rtl:ml-2 dark:bg-[#1b2e4b]">
                                    <IconGithub />
                                </div>
                                <input type="text" placeholder="jimmy_turner" className="form-input" />
                            </div>
                        </div>
                    </form> */}
                </div>
            ) : (
                ''
            )}
            {tabs === 'payment-details' ? (
                <div>
                    <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <div className="panel">
                            <div className="mb-5">
                                <h5 className="mb-4 text-lg font-semibold">Billing Address</h5>
                                <p>
                                    Changes to your <span className="text-primary">Billing</span> information will take effect starting with scheduled payment and will be refelected on your next
                                    invoice.
                                </p>
                            </div>
                            <div className="mb-5">
                                <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                    <div className="flex items-start justify-between py-3">
                                        <h6 className="text-[15px] font-bold text-[#515365] dark:text-white-dark">
                                            Address #1
                                            <span className="mt-1 block text-xs font-normal text-white-dark dark:text-white-light">2249 Caynor Circle, New Brunswick, New Jersey</span>
                                        </h6>
                                        <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                            <button className="btn btn-dark">Edit</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                    <div className="flex items-start justify-between py-3">
                                        <h6 className="text-[15px] font-bold text-[#515365] dark:text-white-dark">
                                            Address #2
                                            <span className="mt-1 block text-xs font-normal text-white-dark dark:text-white-light">4262 Leverton Cove Road, Springfield, Massachusetts</span>
                                        </h6>
                                        <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                            <button className="btn btn-dark">Edit</button>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-start justify-between py-3">
                                        <h6 className="text-[15px] font-bold text-[#515365] dark:text-white-dark">
                                            Address #3
                                            <span className="mt-1 block text-xs font-normal text-white-dark dark:text-white-light">2692 Berkshire Circle, Knoxville, Tennessee</span>
                                        </h6>
                                        <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                            <button className="btn btn-dark">Edit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-primary">Add Address</button>
                        </div>
                        <div className="panel">
                            <div className="mb-5">
                                <h5 className="mb-4 text-lg font-semibold">Payment History</h5>
                                <p>
                                    Changes to your <span className="text-primary">Payment Method</span> information will take effect starting with scheduled payment and will be refelected on your
                                    next invoice.
                                </p>
                            </div>
                            <div className="mb-5">
                                <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                    <div className="flex items-start justify-between py-3">
                                        <div className="flex-none ltr:mr-4 rtl:ml-4">
                                            <img src="/assets/images/card-americanexpress.svg" alt="img" />
                                        </div>
                                        <h6 className="text-[15px] font-bold text-[#515365] dark:text-white-dark">
                                            Mastercard
                                            <span className="mt-1 block text-xs font-normal text-white-dark dark:text-white-light">XXXX XXXX XXXX 9704</span>
                                        </h6>
                                        <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                            <button className="btn btn-dark">Edit</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                    <div className="flex items-start justify-between py-3">
                                        <div className="flex-none ltr:mr-4 rtl:ml-4">
                                            <img src="/assets/images/card-mastercard.svg" alt="img" />
                                        </div>
                                        <h6 className="text-[15px] font-bold text-[#515365] dark:text-white-dark">
                                            American Express
                                            <span className="mt-1 block text-xs font-normal text-white-dark dark:text-white-light">XXXX XXXX XXXX 310</span>
                                        </h6>
                                        <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                            <button className="btn btn-dark">Edit</button>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-start justify-between py-3">
                                        <div className="flex-none ltr:mr-4 rtl:ml-4">
                                            <img src="/assets/images/card-visa.svg" alt="img" />
                                        </div>
                                        <h6 className="text-[15px] font-bold text-[#515365] dark:text-white-dark">
                                            Visa
                                            <span className="mt-1 block text-xs font-normal text-white-dark dark:text-white-light">XXXX XXXX XXXX 5264</span>
                                        </h6>
                                        <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                            <button className="btn btn-dark">Edit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-primary">Add Payment Method</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <div className="panel">
                            <div className="mb-5">
                                <h5 className="mb-4 text-lg font-semibold">Add Billing Address</h5>
                                <p>
                                    Changes your New <span className="text-primary">Billing</span> Information.
                                </p>
                            </div>
                            <div className="mb-5">
                                <form>
                                    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="billingName">Name</label>
                                            <input id="billingName" type="text" placeholder="Enter Name" className="form-input" />
                                        </div>
                                        <div>
                                            <label htmlFor="billingEmail">Email</label>
                                            <input id="billingEmail" type="email" placeholder="Enter Email" className="form-input" />
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="billingAddress">Address</label>
                                        <input id="billingAddress" type="text" placeholder="Enter Address" className="form-input" />
                                    </div>
                                    <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                        <div className="md:col-span-2">
                                            <label htmlFor="billingCity">City</label>
                                            <input id="billingCity" type="text" placeholder="Enter City" className="form-input" />
                                        </div>
                                        <div>
                                            <label htmlFor="billingState">State</label>
                                            <select id="billingState" className="form-select text-white-dark">
                                                <option>Choose...</option>
                                                <option>...</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="billingZip">Zip</label>
                                            <input id="billingZip" type="text" placeholder="Enter Zip" className="form-input" />
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-primary">
                                        Add
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="panel">
                            <div className="mb-5">
                                <h5 className="mb-4 text-lg font-semibold">Add Payment Method</h5>
                                <p>
                                    Changes your New <span className="text-primary">Payment Method </span>
                                    Information.
                                </p>
                            </div>
                            <div className="mb-5">
                                <form>
                                    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="payBrand">Card Brand</label>
                                            <select id="payBrand" className="form-select text-white-dark">
                                                <option value="Mastercard">Mastercard</option>
                                                <option value="American Express">American Express</option>
                                                <option value="Visa">Visa</option>
                                                <option value="Discover">Discover</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="payNumber">Card Number</label>
                                            <input id="payNumber" type="text" placeholder="Card Number" className="form-input" />
                                        </div>
                                    </div>
                                    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="payHolder">Holder Name</label>
                                            <input id="payHolder" type="text" placeholder="Holder Name" className="form-input" />
                                        </div>
                                        <div>
                                            <label htmlFor="payCvv">CVV/CVV2</label>
                                            <input id="payCvv" type="text" placeholder="CVV" className="form-input" />
                                        </div>
                                    </div>
                                    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="payExp">Card Expiry</label>
                                            <input id="payExp" type="text" placeholder="Card Expiry" className="form-input" />
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-primary">
                                        Add
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ''
            )}
            {tabs === 'preferences' ? (
                <div className="switch">
                    <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <div className="panel space-y-5">
                            <h5 className="mb-4 text-lg font-semibold">Choose Theme</h5>
                            <div className="flex justify-around">
                                <div className="flex">
                                    <label className="inline-flex cursor-pointer">
                                        <input className="form-radio cursor-pointer ltr:mr-4 rtl:ml-4" type="radio" name="flexRadioDefault" defaultChecked />
                                        <span>
                                            <img className="ms-3" width="100" height="68" alt="settings-dark" src="/assets/images/settings-light.svg" />
                                        </span>
                                    </label>
                                </div>

                                <label className="inline-flex cursor-pointer">
                                    <input className="form-radio cursor-pointer ltr:mr-4 rtl:ml-4" type="radio" name="flexRadioDefault" />
                                    <span>
                                        <img className="ms-3" width="100" height="68" alt="settings-light" src="/assets/images/settings-dark.svg" />
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="panel space-y-5">
                            <h5 className="mb-4 text-lg font-semibold">Activity data</h5>
                            <p>Download your Summary, Task and Payment History Data</p>
                            <button type="button" className="btn btn-primary">
                                Download Data
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        <div className="panel space-y-5">
                            <h5 className="mb-4 text-lg font-semibold">Public Profile</h5>
                            <p>
                                Your <span className="text-primary">Profile</span> will be visible to anyone on the network.
                            </p>
                            <label className="relative h-6 w-12">
                                <input type="checkbox" className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0" id="custom_switch_checkbox1" />
                                <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                            </label>
                        </div>
                        <div className="panel space-y-5">
                            <h5 className="mb-4 text-lg font-semibold">Show my email</h5>
                            <p>
                                Your <span className="text-primary">Email</span> will be visible to anyone on the network.
                            </p>
                            <label className="relative h-6 w-12">
                                <input type="checkbox" className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0" id="custom_switch_checkbox2" />
                                <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4  before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                            </label>
                        </div>
                        <div className="panel space-y-5">
                            <h5 className="mb-4 text-lg font-semibold">Enable keyboard shortcuts</h5>
                            <p>
                                When enabled, press <span className="text-primary">ctrl</span> for help
                            </p>
                            <label className="relative h-6 w-12">
                                <input type="checkbox" className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0" id="custom_switch_checkbox3" />
                                <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4  before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                            </label>
                        </div>
                        <div className="panel space-y-5">
                            <h5 className="mb-4 text-lg font-semibold">Hide left navigation</h5>
                            <p>
                                Sidebar will be <span className="text-primary">hidden</span> by default
                            </p>
                            <label className="relative h-6 w-12">
                                <input type="checkbox" className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0" id="custom_switch_checkbox4" />
                                <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4  before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                            </label>
                        </div>
                        <div className="panel space-y-5">
                            <h5 className="mb-4 text-lg font-semibold">Advertisements</h5>
                            <p>
                                Display <span className="text-primary">Ads</span> on your dashboard
                            </p>
                            <label className="relative h-6 w-12">
                                <input type="checkbox" className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0" id="custom_switch_checkbox5" />
                                <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4  before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                            </label>
                        </div>
                        <div className="panel space-y-5">
                            <h5 className="mb-4 text-lg font-semibold">Social Profile</h5>
                            <p>
                                Enable your <span className="text-primary">social</span> profiles on this network
                            </p>
                            <label className="relative h-6 w-12">
                                <input type="checkbox" className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0" id="custom_switch_checkbox6" />
                                <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4  before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                            </label>
                        </div>
                    </div>
                </div>
            ) : (
                ''
            )}
            {tabs === 'danger-zone' ? (
                <div className="switch">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        <div className="panel space-y-5">
                            <h5 className="mb-4 text-lg font-semibold">Purge Cache</h5>
                            <p>Remove the active resource from the cache without waiting for the predetermined cache expiry time.</p>
                            <button className="btn btn-secondary">Clear</button>
                        </div>
                        <div className="panel space-y-5">
                            <h5 className="mb-4 text-lg font-semibold">Deactivate Account</h5>
                            <p>You will not be able to receive messages, notifications for up to 24 hours.</p>
                            <label className="relative h-6 w-12">
                                <input type="checkbox" className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0" id="custom_switch_checkbox7" />
                                <span className="block h-full rounded-full bg-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 dark:bg-dark dark:before:bg-white-dark dark:peer-checked:before:bg-white"></span>
                            </label>
                        </div>
                        <div className="panel space-y-5">
                            <h5 className="mb-4 text-lg font-semibold">Delete Account</h5>
                            <p>Once you delete the account, there is no going back. Please be certain.</p>
                            <button className="btn btn-danger btn-delete-account">Delete my account</button>
                        </div>
                    </div>
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default ComponentsUsersAccountSettingsTabs;
