'use client';

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
const ComponentsaffiliateAccountSettingsTabs = () => {
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


    const normalizeDateForInput = (dateStr?: string) => {
        if (!dateStr) return "";

        // Already in YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return dateStr;
        }

        // DD-MM-YYYY
        if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
            const [day, month, year] = dateStr.split("-");
            return `${year}-${month}-${day}`;
        }

        // "19 jan 2002"
        const parts = dateStr.toLowerCase().split(" ");
        if (parts.length === 3) {
            const [day, mon, year] = parts;
            const months: any = {
                jan: "01", feb: "02", mar: "03", apr: "04",
                may: "05", jun: "06", jul: "07", aug: "08",
                sep: "09", oct: "10", nov: "11", dec: "12",
            };
            if (months[mon]) {
                return `${year}-${months[mon]}-${day.padStart(2, "0")}`;
            }
        }

        return "";
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
            dob: "",
            country: "",

            father_husband_name: "",

            nominee_name: "",
            nominee_dob: "",
            nominee_relation: "",



            address: "",

            pincode: "",
        },
    });
    useEffect(() => {
        if (!profileData) return;

        setValue("firstName", profileData.firstName);
        setValue("lastName", profileData.lastName);
        setValue("email", profileData.email);
        setValue("mobileNumber", profileData.mobileNumber);
        setValue("gender", profileData.gender);
        setValue("dob", profileData.dob);
        setValue("country", profileData.country);

        setValue("father_husband_name", profileData?.father_husband_name || profileData?.member_master?.father_husband_name);

        setValue("nominee_name", profileData?.nominee_name);
        setValue(
            "nominee_dob",
            normalizeDateForInput(profileData?.nominee_dob)
        );



        setValue("nominee_relation", profileData?.nominee_relation);



        setValue(
            "address",
            profileData?.address || profileData?.member_master?.address || ""
        );

        setValue(
            "pincode",
            profileData?.pincode || profileData?.member_master?.pincode || ""
        );

    }, [profileData]);
    // 👈 required

    // const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const formatDateOnly = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };



    const onSubmit = async (values: any) => {
        console.log({ values })
        console.log(values.dob, typeof values.dob);

        try {
            setLoading(true);

            // 1. Send data to our server route
            const payload = {
                ...values,
                dob:
                    values.dob instanceof Date
                        ? formatDateOnly(values.dob)
                        : values.dob,


                nominee_dob:
                    values.nominee_dob instanceof Date
                        ? formatDateOnly(values.nominee_dob)
                        : values.nominee_dob,


            };



            const res = await fetch("/api/student/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
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
            router.push("/dash/affiliate/profile");

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
                                <HookFormInputField
                                    label="Father / Husband Name"
                                    name="father_husband_name"
                                    control={control}
                                    placeholder="Enter Name"
                                />
                                <HookFormInputField label="Nominee Name" name="nominee_name" control={control} />
                                <HookFormInputField label="Nominee DOB" name="nominee_dob" type="date" control={control} />
                                <HookFormInputField label="Nominee Relation" name="nominee_relation" control={control} />


                                <HookFormInputField label="Address" name="address" control={control} />

                                <HookFormInputField label="Pin Code" name="pincode" control={control} />



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

                </div>
            ) : (
                ''
            )}

        </div>
    );
};

export default ComponentsaffiliateAccountSettingsTabs;
