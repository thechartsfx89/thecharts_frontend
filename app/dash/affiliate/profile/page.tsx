'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { formatDateTime } from '@/utils/dateFormatter';
import { getImageUrl } from '@/utils/common/common';
import { capitalizeAllLetters, capitalizeFirstWord, capitalizeSubstring } from '@/utils/helpers/capitalize';

const STRAPI_URL = process.env.NEXT_PUBLIC_URL;

export default function AffiliateProfilePage() {
    const { data: session, status } = useSession();

    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [kycData, setKycData] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false); // For staggered animations

    /* ================= FETCH KYC ================= */
    useEffect(() => {
        const fetchKyc = async () => {
            try {
                const res = await fetch('/api/dash/affiliate/kyc');
                const json = await res.json();
                if (json?.success) setKycData(json.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchKyc();
    }, []);

    /* ================= FETCH PROFILE ================= */
    useEffect(() => {
        if (status !== 'authenticated') {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/auth/profile');
                const data = await res.json();
                const profile = data?.user || data;
                setUser(profile);
                setFormData(profile);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
                setTimeout(() => setIsLoaded(true), 100); // Trigger animations after load
            }
        };

        fetchProfile();
    }, [status]);

    if (loading || status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center px-4">
                <div className="text-center space-y-4 max-w-sm">
                    <div className="animate-pulse">
                        <div className="w-16 h-16 bg-indigo-200 rounded-full mx-auto mb-4"></div>
                        <div className="h-4 bg-indigo-200 rounded w-32 mx-auto mb-2"></div>
                        <div className="h-3 bg-indigo-200 rounded w-24 mx-auto"></div>
                    </div>
                    <p className="text-indigo-600 font-medium text-sm sm:text-base">Loading your profile...</p>
                </div>
            </div>
        );
    }

    // if (!session) {
    //     return (
    //         <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center px-4">
    //             <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl text-center max-w-sm">
    //                 <div className="text-4xl sm:text-6xl mb-4">🔒</div>
    //                 <p className="text-lg sm:text-xl text-gray-700 font-semibold">Please login to access your profile</p>
    //                 <Link href="/">
    //                     <button className="mt-6 px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm sm:text-base hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
    //                         Login Now
    //                     </button>
    //                 </Link>
    //             </div>
    //         </div>
    //     );
    // }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center px-4">
                <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl text-center max-w-sm">
                    <div className="text-4xl sm:text-6xl mb-4">📄</div>
                    <p className="text-lg sm:text-xl text-gray-700 font-semibold">No profile data available</p>
                    <p className="text-gray-500 mt-2 text-sm sm:text-base">Please contact support if this persists.</p>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-indigo-300 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 sm:w-40 sm:h-40 bg-purple-300 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-pink-300 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-5xl mx-auto space-y-6 sm:space-y-10 relative z-10">
                {/* ================= PROFILE HEADER ================= */}
                <div
                    className={`bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    {/* Floating accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-bl from-indigo-300 to-purple-300 rounded-full opacity-30 -translate-y-12 sm:-translate-y-20 translate-x-12 sm:translate-x-20 animate-pulse"></div>

                    <div className="relative z-10 w-24 h-24 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden ring-4 ring-indigo-200/50">
                        {(user?.profile_image?.url || user?.member_master?.profileimage) ? (
                            <img
                                // src={`${STRAPI_URL}${user.profile_image.url}`}
                                src={
                                    user?.profile_image?.url
                                        ? `${getImageUrl(user?.profile_image?.url)}?t=${Date.now()}`
                                        : user?.member_master?.profileimage
                                            ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/${user?.member_master?.profileimage}`
                                            : '/assets/images/fallback-profile.png'
                                }

                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                alt="Profile"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl sm:text-5xl bg-gradient-to-br from-indigo-50 to-purple-50">👤</div>
                        )}
                    </div>

                    <div className="flex-1 text-center sm:text-left relative z-10">
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {capitalizeFirstWord(user?.fullName) ||
                                `${capitalizeFirstWord(user?.firstName)} ${capitalizeFirstWord(user?.lastName)}`.trim() ||
                                "Guest User"}
                        </h1>
                        <p className="text-indigo-600 font-semibold text-lg sm:text-xl mb-4 sm:mb-6 flex items-center justify-center sm:justify-start">
                            <span className="mr-2">⭐</span>
                            {'Affiliate Member'}
                        </p>

                        <Link href="/dash/affiliate/user-account-settings">
                            <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm sm:text-base hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1">
                                ✏️ Edit Profile
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ================= SECTIONS ================= */}
                <div className={`space-y-6 sm:space-y-10 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <ModernSection title="Personal Details" icon="👤" color="indigo">
                        <ModernField label="Full Name" value={`${capitalizeSubstring(user?.fullName) ||
                            `${capitalizeFirstWord(user?.firstName)} ${capitalizeFirstWord(user?.lastName)}`.trim() ||
                            "Guest User"}`} icon="📝" />
                        <ModernField label="Date of Birth" value={formatDateTime(user?.dob) || "N/A"} icon="🎂" />
                        <ModernField label="Gender" value={capitalizeFirstWord(user?.gender) || "N/A"} icon="⚧️" />
                        <ModernField label="Father / Husband" value={user?.member_master?.fat_husname ? capitalizeSubstring(user?.member_master?.fat_husname) : user?.fatherName ?? "N/A"} icon="👨" />
                        <ModernField label="Mobile" value={user?.mobileNumber || "N/A"} icon="📱" />
                        <ModernField label="Registration Date" value={user?.member_master?.regdate ? formatDateTime(user?.member_master?.regdate) : formatDateTime(user?.createdAt) ?? "N/A"} icon="📅" />
                    </ModernSection>

                    <ModernSection title="Nominee Details" icon="👥" color="indigo">
                        <ModernField label="Nominee Name" value={capitalizeSubstring(user?.nominee_name) || 'N/A'} icon="📝" />

                        <ModernField label="Nominee D.O.B" value={user?.nominee_dob || 'N/A'} icon="🎂" />

                        <ModernField label="Nominee Relation" value={capitalizeSubstring(user?.nominee_relation) || 'N/A'} icon="🔗" />
                    </ModernSection>

                    <ModernSection title="Login & Bank Details" icon="🏦" color="indigo">
                        <ModernField label="Username / User ID" value={user?.username || 'N/A'} icon="🔑" />
                        <ModernField
                            label="Bank Name"
                            value={user?.member_master?.bank_name ? capitalizeAllLetters(user?.member_master?.bank_name)  : 'N/A'}
                            icon="🏛️"
                        />
                        <ModernField
                            label="IFSC Code"
                            value={user?.member_master?.ifsccode ? capitalizeAllLetters(user?.member_master?.ifsccode) : 'N/A'}
                            icon="💳"
                        />
                        <ModernField label="Account Number" value={user?.member_master?.accountno ? user?.member_master?.accountno : 'N/A'} icon="💰" />
                        <ModernField
                            label="PAN Number"
                            value={user?.member_master?.mempan ? capitalizeAllLetters(user?.member_master?.mempan) : 'N/A'}
                            icon="🆔"
                        />
                        <ModernField label="Aadhar Number" value={user?.member_master?.aadhaarno ? user?.member_master?.aadhaarno : 'N/A' } icon="🪪" />
                    </ModernSection>

                    <ModernSection title="Address" icon="🏠" color="indigo">
                        <ModernField label="Address" value={user?.member_master ? `${user?.member_master?.address}, ${user?.member_master?.ocity}, ${user?.member_master?.ostate}` : user?.address ?? "N/A"} icon="📍" />
                        <ModernField label="Pin Code" value={user?.member_master?.pincode ? user?.member_master?.pincode : user?.pincode ?? "N/A"} icon="📮" />
                        <ModernField label="Country" value={user?.member_master?.country ? user?.member_master?.country : user?.country ?? "N/A"} icon="🌍" />
                    </ModernSection>
                </div>
            </div>
        </section>
    );
}

/* ================= MODERN UI COMPONENTS ================= */

const ModernSection = ({ title, children, icon, color }: { title: string; children: React.ReactNode; icon?: string; color: string }) => (
    <div className={`bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-10 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group`}>
        <div className="flex items-center mb-6 sm:mb-8">
            {icon && <span className="text-2xl sm:text-3xl mr-3 sm:mr-4 animate-bounce">{icon}</span>}
            <h3 className={`text-xl sm:text-2xl font-bold text-dark`}>{title}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">{children}</div>
    </div>
);

const ModernField = ({ label, value, icon }: { label: string; value: string; icon?: string }) => (
    <div className="space-y-2 sm:space-y-3 group">
        <label className="text-xs sm:text-sm font-bold text-gray-700 flex items-center uppercase tracking-wide">
            {icon && <span className="mr-2 sm:mr-3 text-base sm:text-lg">{icon}</span>}
            {label}
        </label>
        <div className="w-full rounded-xl sm:rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-900 shadow-sm group-hover:shadow-lg transition-all duration-300 hover:border-indigo-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12"></div>
            <span className="relative z-10">{value}</span>
        </div>
    </div>
);
