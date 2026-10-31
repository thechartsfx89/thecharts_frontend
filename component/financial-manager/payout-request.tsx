"use client";

import IconBell from "@/components/icon/icon-bell";
import IconInfoTriangle from "@/components/icon/icon-info-triangle";
import { showToast } from "@/utils/toast";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type WithdrawFormValues = {
    withdraw_amount: number;
    tds_charges: number;
    admin_charges: number;
    net_payable_amount: number;
    remark?: string;
};

export default function PayoutForm() {
    const [loading, setLoading] = useState(false);
    const [kycData, setKycData] = useState<any>(null);
    const [walletData, setWalletData] = useState<any>(null);
    const [tds, setTds] = useState(0);
    const [adminCharges, setAdminCharges] = useState(0);
    const [netAmount, setNetAmount] = useState(0);
    const router = useRouter();

    const redirect =
        console.log({ walletData });
    const fetchKycAndWalletData = async () => {
        try {
            setLoading(true);

            const [kycRes, walletRes] = await Promise.all([
                fetch("/api/dash/affiliate/kyc"),
                fetch("/api/dash/affiliate/wallet/my-wallet"),
            ]);

            const [kycJson, walletJson] = await Promise.all([
                kycRes.json(),
                walletRes.json(),
            ]);

            if (kycJson?.success) {
                setKycData(kycJson?.data);
            }

            if (walletJson) {
                setWalletData(walletJson?.data);
            }
        } catch (error) {
            console.error("Failed to fetch KYC or Wallet Data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKycAndWalletData();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm<WithdrawFormValues>();

    const watchedAmount = watch("withdraw_amount");

    useEffect(() => {
        const amount = watchedAmount || 0;
        const calculatedTds = amount * 0.05;
        const calculatedAdmin = amount * 0.05;
        const calculatedNet = amount - calculatedTds - calculatedAdmin;
        setTds(calculatedTds);
        setAdminCharges(calculatedAdmin);
        setNetAmount(calculatedNet);
    }, [watchedAmount]);

    const onSubmit = async (data: WithdrawFormValues) => {
        try {
            const res = await fetch("/api/dash/affiliate/payout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                        tds_charges: tds,
                        admin_charges: adminCharges,
                        net_payable_amount: netAmount,
                }),
            });

            const json = await res.json(); // 👈 read response body

            if (!res.ok || !json.success) {
                showToast("error", json?.message || "Request failed");
                return;
            }

            reset();
            showToast("success", json.message || "Withdrawal Request Sent");
            setTimeout(() => {
                router.push("/dash/affiliate/payout-report");
            }, 2000);
        } catch (err: any) {
            console.error(err);
            showToast("error", err?.message || "Something went wrong");
        } finally {
        }
    };

    return (
        <div className="panel mt-2">
            {!loading && (!kycData || kycData?.kyc_status !== "APPROVED") &&
                <div className="px-0 lg:px-8 ">
                    <div
                        className={`relative mb-2 flex items-center p-3.5 rounded 
                          text-danger border-danger bg-danger-light
                            ltr:border-l-[64px] rtl:border-r-[64px]`}
                    >
                        <span className="absolute ltr:-left-11 rtl:-right-11 inset-y-0 text-white w-6 h-6 m-auto flex items-center justify-center">
                            <IconInfoTriangle />
                        </span>

                        <span className="ltr:pr-2 rtl:pl-2">
                            <Link href="/dash/affiliate/kyc-details">
                                <strong className="ltr:mr-1 rtl:ml-1 text-xs lg:text-sm  hover:underline cursor-pointer">
                                    {kycData?.kyc_status === "PENDING"
                                        ? "Your KYC is under review. Check status."
                                        : "It seems your KYC is not complete, Click here to submit."}
                                </strong>
                            </Link>
                            {/* <strong className="ltr:mr-1 rtl:ml-1 text-xs lg:text-sm">{kycData?.kyc_status == "APPROVED" ? "" : "It seems your KYC is not complete, Please check Status"}</strong> */}
                            {/* <span className="text-dark">No remarks available</span> */}
                        </span>
                    </div>
                </div>}
            {/* Header */}
            <div className="bg-indigo-900 text-white px-0 lg:px-6 py-4 rounded-t-xl flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span className="text-lg lg:text-xl text-black">💰 Payout Request</span>
                </h2>

            </div>

            {!loading ? (<form onSubmit={handleSubmit(onSubmit)}>
                {/* Form Body */}
                <div className="px-0 lg:px-8 py-4 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                    {/* Current Balance */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Current Balance</label>
                        <div className="flex">
                            <span className="px-3 bg-gray-100 border border-gray-300 rounded-l-lg flex items-center text-gray-600">
                                Rs.
                            </span>
                            <input
                                type="text"
                                readOnly
                                value={walletData?.grand_total?.wallet_balance}
                                className="w-full border border-gray-300 rounded-r-lg px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-600"
                            />
                        </div>
                    </div>

                    {/* First Name */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1 flex items-center gap-2">
                            First Name <span className="text-red-500 text-xl">!</span>
                        </label>
                        <input
                            type="text"
                            value={kycData?.user.firstName}
                            readOnly
                            className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1 flex items-center gap-2">
                            Last Name <span className="text-red-500 text-xl">!</span>
                        </label>
                        <input
                            type="text"
                            value={kycData?.user.lastName}
                            readOnly
                            className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* Account Number */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Account No.</label>
                        <input
                            type="text"
                            value={kycData?.account_number}
                            readOnly
                            className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* IFSC Code */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">IFSC Code</label>
                        <input
                            type="text"
                            value={kycData?.ifsc_code}
                            readOnly
                            className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Withdraw Amount<span className="text-danger">*</span></label>
                        <div className="flex w-full">
                            <span className="px-3 bg-gray-100 border border-gray-300 rounded-l-lg flex items-center text-gray-600">
                                Rs.
                            </span>
                            <input
                                type="number"
                                placeholder="Enter Amount"
                                className="w-full border border-gray-300 rounded-r-lg px-3 py-2"
                                {...register("withdraw_amount", {
                                    required: "Amount is required",
                                    min: { value: 1, message: "Amount must be greater than 0" },
                                })}
                            />
                        </div>
                        {errors.withdraw_amount && (
                            <span className="text-red-500 text-sm mt-1">
                                {errors.withdraw_amount.message}
                            </span>
                        )}
                    </div>

                    {/* TDS */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">TDS (5%)</label>
                        <div className="flex">
                            <span className="px-3 bg-gray-100 border border-gray-300 rounded-l-lg flex items-center text-gray-600">
                                Rs.
                            </span>
                            <input
                                type="text"
                                readOnly
                                value={tds.toFixed(2)}
                                {...register("tds_charges")}
                                className="w-full border border-gray-300 rounded-r-lg px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-600"
                            />
                        </div>
                    </div>

                    {/* Admin Charges */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Admin Charges (5%)</label>
                        <div className="flex">
                            <span className="px-3 bg-gray-100 border border-gray-300 rounded-l-lg flex items-center text-gray-600">
                                Rs.
                            </span>
                            <input
                                type="text"
                                readOnly
                                value={adminCharges.toFixed(2)}
                                {...register("admin_charges")}
                                className="w-full border border-gray-300 rounded-r-lg px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-600"
                            />
                        </div>
                    </div>

                    {/* Net Amount */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Net Payable Amount</label>
                        <div className="flex">
                            <span className="px-3 bg-gray-100 border border-gray-300 rounded-l-lg flex items-center text-gray-600">
                                Rs.
                            </span>
                            <input
                                type="text"
                                readOnly
                                value={netAmount.toFixed(2)}
                                {...register("net_payable_amount")}
                                className="w-full border border-gray-300 rounded-r-lg px-3 py-2 bg-gray-100 cursor-not-allowed text-gray-600"
                            />
                        </div>
                    </div>

                    {/* Remark */}
                    <div className="flex flex-col md:col-span-2">
                        <label className="text-gray-700 font-medium mb-1">Remark</label>
                        <textarea
                            rows={3}
                            placeholder="Enter any remark"
                            className="border border-gray-300 rounded-lg px-3 py-2"
                            {...register("remark", {
                                //   required: "Remark is required",
                                minLength: {
                                    value: 3,
                                    message: "Remark must be at least 3 characters",
                                },
                            })}
                        />
                        {/* {errors.remark && (
            <span className="text-red-500 text-sm mt-1">
              {errors.remark.message}
            </span>
          )} */}
                    </div>
                </div>

                {/* Buttons */}
                <div className="px-8 pb-8 flex gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg text-sm lg:text-base font-medium shadow disabled:opacity-60"
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>

                    <button
                        type="button"
                        onClick={() => reset()}
                        className="bg-dark hover:bg-gray-800 text-white px-8 py-2 rounded-lg text-sm lg:text-base font-medium shadow"
                    >
                        Cancel
                    </button>
                </div>
            </form>) : <div className="animate-pulse">
                {/* Form Body */}
                <div className="px-0 lg:px-8 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Current Balance */}
                    <div className="flex flex-col gap-2">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                    </div>

                    {/* First Name */}
                    <div className="flex flex-col gap-2">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col gap-2">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                    </div>

                    {/* Account Number */}
                    <div className="flex flex-col gap-2">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                    </div>

                    {/* IFSC Code */}
                    <div className="flex flex-col gap-2">
                        <div className="h-4 w-28 bg-gray-200 rounded"></div>
                        <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                    </div>

                    {/* Withdraw Amount */}
                    <div className="flex flex-col gap-2">
                        <div className="h-4 w-36 bg-gray-200 rounded"></div>
                        <div className="flex">
                            <div className="h-10 w-12 bg-gray-200 rounded-l-lg"></div>
                            <div className="h-10 flex-1 bg-gray-200 rounded-r-lg"></div>
                        </div>
                    </div>

                    {/* TDS */}
                    <div className="flex flex-col gap-2">
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <div className="flex">
                            <div className="h-10 w-12 bg-gray-200 rounded-l-lg"></div>
                            <div className="h-10 flex-1 bg-gray-200 rounded-r-lg"></div>
                        </div>
                    </div>

                    {/* Admin Charges */}
                    <div className="flex flex-col gap-2">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="flex">
                            <div className="h-10 w-12 bg-gray-200 rounded-l-lg"></div>
                            <div className="h-10 flex-1 bg-gray-200 rounded-r-lg"></div>
                        </div>
                    </div>

                    {/* Net Amount */}
                    <div className="flex flex-col gap-2">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="flex">
                            <div className="h-10 w-12 bg-gray-200 rounded-l-lg"></div>
                            <div className="h-10 flex-1 bg-gray-200 rounded-r-lg"></div>
                        </div>
                    </div>

                    {/* Remark */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-20 w-full bg-gray-200 rounded-lg"></div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="px-8 pb-8 flex gap-4">
                    <div className="h-12 w-40 bg-gray-300 rounded-lg"></div>
                    <div className="h-12 w-40 bg-gray-300 rounded-lg"></div>
                </div>
            </div>
            }



        </div>
    );
}