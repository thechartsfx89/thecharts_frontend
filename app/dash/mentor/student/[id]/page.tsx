'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import IconCalendar from "@/components/icon/icon-calendar";
import IconCoffee from "@/components/icon/icon-coffee";
import IconMail from "@/components/icon/icon-mail";
import IconMapPin from "@/components/icon/icon-map-pin";
import IconPhone from "@/components/icon/icon-phone";
import UploadedStudentDocumentsPage from "@/components/users/profile/uploaded-documents";
import { getImageUrl } from "@/utils/common/common";

const StudentProfilePage = () => {
    const { id } = useParams(); // 👈 student id from URL
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchStudent = async () => {
            try {
                const res = await fetch(`/api/user/allUserList?id=${id}`);
                const data = await res.json();
                       console.log({data})
                if (!data) {
                    console.error("Student not found");
                    return;
                }

                setUser(data);
            } catch (error) {
                console.error("Error fetching student:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [id]);
     console.log( {id, user})
    if (loading) return <p>Loading student profile...</p>;
    if (!user) return <p>Student not found.</p>;

    return (
        <div>
            {/* Breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/dash/mentor/student" className="text-primary hover:underline">
                        Students
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Profile</span>
                </li>
            </ul>

            <div className="pt-5">
                <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">

                    {/* LEFT PROFILE CARD */}
                    <div className="panel">
                        <h5 className="mb-5 text-lg font-semibold">Student Profile</h5>

                        <div className="mb-5 flex flex-col items-center">
                            <img
                                src={
                                    user.profile_image?.url
                                        ? getImageUrl(user.profile_image.url)
                                        : "/assets/images/user-profile.jpeg"
                                }
                                alt="profile"
                                className="mb-4 h-24 w-24 rounded-full object-cover"
                            />

                            <p className="text-xl font-semibold text-primary">
                                {user.firstName} {user.lastName}
                            </p>
                        </div>

                        <ul className="space-y-4 font-semibold text-white-dark">
                            <li className="flex items-center gap-2">
                                <IconCoffee />
                                {user.role?.name || "Student"}
                            </li>

                            <li className="flex items-center gap-2">
                                <IconCalendar />
                                {user.dob || "N/A"}
                            </li>

                            <li className="flex items-center gap-2">
                                <IconMapPin />
                                {user.country || "N/A"}
                            </li>

                            <li className="flex items-center gap-2">
                                <IconMail />
                                <span className="text-primary truncate">{user.email}</span>
                            </li>

                            <li className="flex items-center gap-2">
                                <IconPhone />
                                {user.mobileNumber || "N/A"}
                            </li>
                        </ul>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="panel lg:col-span-2 xl:col-span-3">
                        <UploadedStudentDocumentsPage userId={user.id} isAction={true}/>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudentProfilePage;
