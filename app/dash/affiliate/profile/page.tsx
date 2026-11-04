'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { formatDateTime } from '@/utils/dateFormatter';
import { getImageUrl } from '@/utils/common/common';
import { FileText, Landmark, LucideIcon, MapPin, Pencil, Star, UserRound, Users } from 'lucide-react';
import { DashCard, DashEmpty } from '@/components/layouts/dash-ui';
import { AffiliatePageHeader } from '@/components/layouts/affiliate/affiliate-ui';
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
            <div className="space-y-6">
                <div className="h-44 animate-pulse rounded-2xl bg-slate-200/60" />
                <div className="h-64 animate-pulse rounded-2xl bg-slate-200/60" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white">
                <DashEmpty icon={FileText} title="No profile data available" sub="Please contact support if this persists." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AffiliatePageHeader title="View Profile" icon={UserRound} />

            {/* ================= PROFILE HEADER ================= */}
            <div className="tc-grid-bg relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl bg-[#0b1b33] p-6 text-white sm:flex-row sm:p-8">
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#16c75f]/20 blur-3xl" />
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white/20 bg-white/10">
                    {(user?.profile_image?.url || user?.member_master?.profileimage) ? (
                        <img
                            src={
                                user?.profile_image?.url
                                    ? `${getImageUrl(user?.profile_image?.url)}?t=${Date.now()}`
                                    : user?.member_master?.profileimage
                                        ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/${user?.member_master?.profileimage}`
                                        : '/assets/images/fallback-profile.png'
                            }
                            className="h-full w-full object-cover"
                            alt="Profile"
                        />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center text-white/60">
                            <UserRound className="h-10 w-10" />
                        </span>
                    )}
                </div>

                <div className="relative min-w-0 flex-1 text-center sm:text-left">
                    <h2 className="tc-serif text-2xl font-black sm:text-3xl">
                        {capitalizeFirstWord(user?.fullName) ||
                            `${capitalizeFirstWord(user?.firstName)} ${capitalizeFirstWord(user?.lastName)}`.trim() ||
                            "Guest User"}
                    </h2>
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#16c75f]/15 px-3 py-1 text-sm font-semibold text-[#16c75f]">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {'Affiliate Member'}
                    </p>
                </div>

                <Link href="/dash/affiliate/user-account-settings" className="relative inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#16c75f] px-6 py-3 font-semibold text-[#0b1b33] transition hover:bg-[#2fe079]">
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                </Link>
            </div>

            {/* ================= SECTIONS ================= */}
            <div className="grid gap-6 xl:grid-cols-2">
                <ModernSection title="Personal Details" icon={UserRound}>
                        <ModernField label="Full Name" value={`${capitalizeSubstring(user?.fullName) ||
                            `${capitalizeFirstWord(user?.firstName)} ${capitalizeFirstWord(user?.lastName)}`.trim() ||
                            "Guest User"}`} />
                        <ModernField label="Date of Birth" value={formatDateTime(user?.dob) || "N/A"} />
                        <ModernField label="Gender" value={capitalizeFirstWord(user?.gender) || "N/A"} />
                        <ModernField label="Father / Husband" value={user?.member_master?.fat_husname ? capitalizeSubstring(user?.member_master?.fat_husname) : user?.fatherName ?? "N/A"} />
                        <ModernField label="Mobile" value={user?.mobileNumber || "N/A"} />
                        <ModernField label="Registration Date" value={user?.member_master?.regdate ? formatDateTime(user?.member_master?.regdate) : formatDateTime(user?.createdAt) ?? "N/A"} />
                    </ModernSection>

                    <ModernSection title="Nominee Details" icon={Users}>
                        <ModernField label="Nominee Name" value={capitalizeSubstring(user?.nominee_name) || 'N/A'} />

                        <ModernField label="Nominee D.O.B" value={user?.nominee_dob || 'N/A'} />

                        <ModernField label="Nominee Relation" value={capitalizeSubstring(user?.nominee_relation) || 'N/A'} />
                    </ModernSection>

                    <ModernSection title="Login & Bank Details" icon={Landmark}>
                        <ModernField label="Username / User ID" value={user?.username || 'N/A'} />
                        <ModernField
                            label="Bank Name"
                            value={user?.member_master?.bank_name ? capitalizeAllLetters(user?.member_master?.bank_name)  : 'N/A'}
                        />
                        <ModernField
                            label="IFSC Code"
                            value={user?.member_master?.ifsccode ? capitalizeAllLetters(user?.member_master?.ifsccode) : 'N/A'}
                        />
                        <ModernField label="Account Number" value={user?.member_master?.accountno ? user?.member_master?.accountno : 'N/A'} />
                        <ModernField
                            label="PAN Number"
                            value={user?.member_master?.mempan ? capitalizeAllLetters(user?.member_master?.mempan) : 'N/A'}
                        />
                        <ModernField label="Aadhar Number" value={user?.member_master?.aadhaarno ? user?.member_master?.aadhaarno : 'N/A' } />
                    </ModernSection>

                    <ModernSection title="Address" icon={MapPin}>
                        <ModernField label="Address" value={user?.member_master ? `${user?.member_master?.address}, ${user?.member_master?.ocity}, ${user?.member_master?.ostate}` : user?.address ?? "N/A"} />
                        <ModernField label="Pin Code" value={user?.member_master?.pincode ? user?.member_master?.pincode : user?.pincode ?? "N/A"} />
                        <ModernField label="Country" value={user?.member_master?.country ? user?.member_master?.country : user?.country ?? "N/A"} />
                    </ModernSection>
            </div>
        </div>
    );
}

/* ================= SECTION COMPONENTS ================= */

const ModernSection = ({ title, children, icon }: { title: string; children: React.ReactNode; icon: LucideIcon }) => (
    <DashCard title={title} icon={icon}>
        <dl className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2">{children}</dl>
    </DashCard>
);

const ModernField = ({ label, value }: { label: string; value: string }) => (
    <div className="min-w-0">
        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
        <dd className="mt-1 break-words text-sm font-semibold text-[#0b1b33]">{value}</dd>
    </div>
);
