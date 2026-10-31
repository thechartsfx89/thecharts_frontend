"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import IconCalendar from "@/components/icon/icon-calendar";
import IconCoffee from "@/components/icon/icon-coffee";
import IconMail from "@/components/icon/icon-mail";
import IconMapPin from "@/components/icon/icon-map-pin";
import IconPencilPaper from "@/components/icon/icon-pencil-paper";
import IconPhone from "@/components/icon/icon-phone";
import UploadedStudentDocumentsPage from "@/components/users/profile/uploaded-documents";

const Profile = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (status === "loading") return;

            if (!session) {
                setLoading(false);
                return;
            }

            try {
                // Get the logged-in user's ID from session
                const userId = session.user?.id;
                if (!userId) {
                    console.error("No user ID found in session");
                    setLoading(false);
                    return;
                }


                const res = await fetch("/api/auth/profile");
                const { user } = await res.json();

                setUser(user);

                const data = await res.json();

                if (data) {
                    setUser(data); // set user data dynamically
                } else {
                    console.error("User not found");
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }

            setLoading(false);
        };

        fetchUser();
    }, [session, status]);

    if (status === "loading" || loading) return <p>Loading profile...</p>;
    if (!session) return <p>Please log in to view your profile.</p>;
    if (!user) return <p>No user found.</p>;

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="#" className="text-primary hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Profile</span>
                </li>
            </ul>

            <div className="pt-5">
                <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                    {/* LEFT USER PROFILE CARD */}
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Profile</h5>
                            <Link
                                href="/dash/users/user-account-settings"
                                className="btn btn-primary rounded-full p-2 ltr:ml-auto rtl:mr-auto"
                            >
                                <IconPencilPaper />
                            </Link>
                        </div>

                        <div className="mb-5 flex flex-col items-center justify-center">
                            <img
                                src={
                                    user.profile_image
                                        ? `${process.env.NEXT_PUBLIC_URL}${user.profile_image.url}`
                                        : "/assets/images/profile-34.jpeg"
                                }
                                alt="profile"
                                className="mb-5 h-24 w-24 rounded-full object-cover"
                            />
                            <p className="text-xl font-semibold text-primary">
                                {`${user.firstName ?? ""} ${user.lastName ?? ""}` || session.user.name || "User"}
                            </p>
                        </div>

                        <ul className="m-auto mt-5 flex max-w-[160px] flex-col space-y-4 font-semibold text-white-dark">
                            <li className="flex items-center gap-2">
                                <IconCoffee className="shrink-0" />
                                {user.role.name || "Not Provided"}
                            </li>

                            <li className="flex items-center gap-2">
                                <IconCalendar className="shrink-0" />
                                {user.dob || "No DOB"}
                            </li>

                            <li className="flex items-center gap-2">
                                <IconMapPin className="shrink-0" />
                                {user.country || "No Location"}
                            </li>

                            <li className="flex items-center gap-2">
                                <IconMail />
                                <span className="truncate text-primary">{user.email}</span>
                            </li>

                            <li className="flex items-center gap-2">
                                <IconPhone />
                                <span dir="ltr">{user.mobileNumber || "No Phone"}</span>
                            </li>
                        </ul>
                    </div>


                    <div className="panel lg:col-span-2 xl:col-span-3">
                        <UploadedStudentDocumentsPage userId={session?.user?.id} isAction={true}/>
                    </div>


                </div>




            </div>
        </div>
    );
};

export default Profile;
