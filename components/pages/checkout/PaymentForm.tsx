"use client";
import IconCalendar from "@/components/icon/icon-calendar";
import IconCashBanknotes from "@/components/icon/icon-cash-banknotes";
import IconCreditCard from "@/components/icon/icon-credit-card";
import IconLoader from "@/components/icon/icon-loader";
import HookFormInputField from "@/hooks/hookFormInput";
import HookFormSelectField from "@/hooks/hookFormSelect";
import { startLoading } from "@/lib/loader";
// import { PaymentMode } from "@/types/Common";
import { LoginForm, PaymentForm, paymentSchema } from "@/utils/formValidation";
import { showToast } from "@/utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { getSession, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState, ChangeEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import PaymentSkeleton from "./skeleton";
import Link from "next/link";
import PaymentSuccess from "@/app/payment-successful/page";
import { sendPaymentSubmittedEmail } from "@/app/api/auth/email/services";

type Mode = "" | "BANK_DEPOSIT" | "DIGITAL_PAYMENT" | "CASH";

export default function PaymentPage(props: { course: any }) {
    const [mode, setMode] = useState<Mode>("");
    const { data: session, status } = useSession();
    
    const params = useParams();
   

    const courseId = (params as any)?.id as string | undefined;
    //    console.log({status})
    const { course } = props
     console.log({course})
    const [enrollData, setEnrollData] = useState<any>();
    console.log({ enrollData })
    // const documentId = props.documentId;
    const [loadingPay, setLoadingPay] = useState(false);
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);


    const checkEnrollment = async (courseId: string): Promise<boolean> => {
        try {
            setLoadingPay(true)
            const res = await fetch(`/api/payment?course=${courseId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await res.json();
            if (!res.ok) {
                throw new Error(result?.error || "Failed to check enrollment");
            }
            setEnrollData(result?.data[0])

        } catch (error) {
            console.error("Check enrollment error:", error);
            return false; // safe fallback

        } finally {
            setLoadingPay(false)

            // Optional: useful for loaders / logging
            // setChecking(false);
        }
    };

    useEffect(() => {
        if (courseId) {
            checkEnrollment(courseId)

        }
    }, [])
    const handleMode = (val: any) => {
        setMode(val as Mode);
    };
    const [loading, setLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    // const router = useRouter();
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        setValue,
    } = useForm<PaymentForm>({
        resolver: yupResolver(paymentSchema) as any,
        defaultValues: {
            bank_name: "",
            transaction_id: "",
            payment_mode: undefined,
            payment_status: undefined,
            course: "",
            user: "",
            purchased_course: ""
        },
    });

    const onSubmit = async (data: PaymentForm) => {
        setLoading(true);

        try {
            const res = await fetch("/api/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    purchased_course: enrollData?.documentId,
                    course: course?.documentId,
                    payment_mode: mode
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Payment failed");
            }

            
            
            await sendPaymentSubmittedEmail({
                email: session?.user?.email || "",
                fullName: session?.user?.fullName ?? session?.user?.name ?? "NA",
                courseName: course?.course_title || "NA",
                amount: course?.course_price ?? 0,
                transactionId: result?.data?.transaction_id || "",
                payment_mode: result?.data?.payment_mode || "",
            });
        showToast("success", "Payment Submitted");
         await setIsPaymentSuccess(true)
        reset();
        } catch (error: any) {
            console.error(error);
            showToast("error", error.message || "Something went wrong");

        } finally {
            setLoading(false); // ✅ only loading cleanup
        }
    };



    const onError = (errors: any) => {
        showToast("info", "Please fill required field");
        console.log("❌ Validation Errors:", errors);
    };



    return (
        <>{loadingPay ? <PaymentSkeleton /> :
            <>{isPaymentSuccess ? <PaymentSuccess /> :
             (status === 'unauthenticated' ? (
          <div className="flex flex-col h-full items-center justify-center rounded-lg border border-dashed border-gray-300 p-10 text-center">
            <h3 className="mb-2 text-lg font-semibold text-gray-700">
              Session Expired
            </h3>
            <p className="text-sm text-gray-500">
              Please login to make Payment.
            </p>
          </div>
        ):
            <div className="">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div className=" md:col-span-2 panel">

                        <h2 className="text-2xl font-bold text-dark mb-6 text-center">Payment Details</h2>
                        <form onSubmit={handleSubmit(onSubmit, onError)}
                            className="space-y-5 ">
                            <div className="mb-6">
                                {/* <HookFormSelectField
                                    label="Payment Mode"
                                    name="payment_mode"
                                    control={control}
                                    placeholder="Select Payment Mode"
                                    onChange={handleMode}
                                    options={[
                                        { value: "BANK_DEPOSIT", label: "🏦 Bank Deposit" },
                                        { value: "DIGITAL_PAYMENT", label: "📱 Digital Payment" },
                                        { value: "CASH", label: "💵 Cash" },
                                    ]}
                                    value={mode}
                                    //   error={errors.refund_reason?.message}
                                    required
                                /> */}
                                <HookFormSelectField
                                    label="Payment Mode"
                                    name="payment_mode"
                                    control={control}
                                    placeholder="Select Payment Mode"

                                    options={[
                                        { value: "BANK_DEPOSIT", label: "🏦 Bank Deposit" },
                                        { value: "DIGITAL_PAYMENT", label: "📱 Digital Payment" },
                                        { value: "CASH", label: "💵 Cash" },
                                    ]}
                                    // value={mode}
                                    callback={handleMode as any}
                                    // onChange={handleMode}
                                    // defaultValue={"BANK_DEPOSIT"}
                                    // error={errors.country?.message}
                                    required
                                    searchable
                                />
                            </div>

                            {/* ---------------- BANK ---------------- */}
                            {mode === "BANK_DEPOSIT" && (
                                <div className="space-y-4 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="text-sm text-gray-800">
                                        <h3 className="font-semibold mb-3 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Bank Icon">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            Bank Details
                                        </h3>
                                        <div className="space-y-1">
                                            <p><strong>Account Holder:</strong> Educandle</p>
                                            <p><strong>Account No:</strong> 78111010002006</p>
                                            <p><strong>IFSC:</strong> UBIN0817813</p>
                                            <p><strong>Branch:</strong> Yamuna Nagar</p>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <HookFormInputField
                                            label="Bank Name"
                                            name="bank_name"
                                            control={control}
                                            placeholder="Enter Bank Name"
                                            // error={errors.identifier?.message}
                                            icon={<IconCashBanknotes className='color-[#000]' />}
                                            // required
                                            className="form-input ltr:pl-10 rtl:pr-10  "
                                        />
                                    </div>

                                    <div className="relative">
                                        <HookFormInputField
                                            label="UTR / Transaction ID"
                                            name="transaction_id"
                                            control={control}
                                            placeholder="Enter UTR / Transaction ID"
                                            // error={errors.identifier?.message}
                                            icon={<IconCreditCard className='color-[#000]' />}
                                            // required
                                            className="form-input ltr:pl-10 rtl:pr-10  "
                                        />
                                    </div>
                                    <div>
                                        <div className="relative">
                                            <HookFormInputField
                                                label="Payment Date"
                                                name="payment_date"
                                                control={control}
                                                placeholder="Select Payment Date"
                                                type='date'
                                                // error={errors.identifier?.message}
                                                icon={<IconCalendar className='color-[#000]' />}
                                                required
                                                className="form-input ltr:pl-10 rtl:pr-10  "
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ---------------- DIGITAL ---------------- */}
                            {mode === "DIGITAL_PAYMENT" && (
                                <div className="space-y-4 mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                                    <h3 className="font-semibold mb-3 flex items-center justify-center text-gray-800">
                                        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="QR Icon">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 15h4.01M12 21h4.01M12 12h4.01M12 15h4.01M12 21h4.01M12 12h4.01M12 15h4.01M12 21h4.01" />
                                        </svg>
                                        Scan QR Code
                                    </h3>
                                    <div className="bg-white p-1 rounded-lg shadow-md inline-block mb-2">
                                        <img
                                            src="/assets/images/qr_payment.jpeg"
                                            alt="QR Code for Payment"
                                            className="w-60 h-full mx-auto"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-600 mb-4">Scan with any UPI App</p>

                                    <div className="text-left space-y-4">
                                        <div className="relative">
                                            <HookFormInputField
                                                label="UTR / Transaction ID"
                                                name="transaction_id"
                                                control={control}
                                                placeholder="Enter UTR / Transaction ID"
                                                // error={errors.identifier?.message}
                                                icon={<IconCreditCard className='color-[#000]' />}
                                                // required
                                                className="form-input ltr:pl-10 rtl:pr-10  "
                                            />
                                        </div>
                                        <div>
                                            <div className="relative">
                                                <HookFormInputField
                                                    label="Payment Date"
                                                    name="payment_date"
                                                    control={control}
                                                    placeholder="Select Payment Date"
                                                    type='date'
                                                    error={errors.payment_date?.message}
                                                    icon={<IconCalendar className='color-[#000]' />}
                                                    required
                                                    className="form-input ltr:pl-10 rtl:pr-10  "
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ---------------- CASH ---------------- */}
                            {mode === "CASH" && (
                                <div className="space-y-4 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="text-sm text-gray-800 flex items-center mb-4">
                                        <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Cash Icon">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                        </svg>
                                        Pay cash at the office or upon delivery.
                                    </div>

                                    <div>
                                        <div className="relative">
                                            <HookFormInputField
                                                label="Payment Date"
                                                name="payment_date"
                                                control={control}
                                                placeholder="Enter Payment Date"
                                                type='date'
                                                // error={errors.identifier?.message}
                                                icon={<IconCalendar className='color-[#000]' />}
                                                required
                                                className="form-input ltr:pl-10 rtl:pr-10  "
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 mt-6">
                                {/* <Link href="/payment-successful">
                                    <button className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition duration-200 shadow-md w-full">
                                        Cancel
                                    </button>
                                </Link> */}
                                <button type="submit" disabled={(mode && !loading) ? false : true} className="btn btn-gradient disabled py-3  w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">

                                    {loading ?
                                        <> <IconLoader className="inline-block  shrink-0 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2" />Loading...</> :
                                        "Submit"
                                    }

                                </button>

                            </div>
                        </form>
                    </div>

                    {/* ---------------- RIGHT : ORDER SUMMARY ---------------- */}
                    <div className="panel">
                        <h3 className="text-blue-600 font-semibold text-lg border-b-2 border-blue-500 pb-2">
                            Order Summary
                        </h3>

                        <div className="mt-6 space-y-4 text-gray-800 bg-gray-50 p-4 rounded-lg border">
                            <p className="font-semibold text-lg">Your Items</p>

                            <div className="flex justify-between">
                                <span>Course Name:</span>
                                <span>{course?.course_title}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Price:</span>
                                <span>Rs. {course?.gst ? course?.mrp : course?.course_price}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>GST:</span>
                                <span>Rs. {course?.gst ?? 0}</span>
                            </div>
                            {/* <div className="flex justify-between">
                            <span>Discount:</span>
                            <span>Rs. 0</span>
                        </div> */}

                            <div className="flex justify-between font-bold text-lg">
                                <span>Total Amount:</span>
                                <span className="text-green-600">Rs. {course?.course_price}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>)}</>
        }</>
    );
}
