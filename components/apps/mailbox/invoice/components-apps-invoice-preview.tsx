'use client';
import IconDownload from '@/components/icon/icon-download';
import IconEdit from '@/components/icon/icon-edit';
import IconPlus from '@/components/icon/icon-plus';
import IconPrinter from '@/components/icon/icon-printer';
import IconSend from '@/components/icon/icon-send';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import downloadInvoice from './downloadInvoice';
import InvoiceSkeleton from './invoiceSkeleton';
import { useSession } from 'next-auth/react';

const ComponentsAppsInvoicePreview = () => {
     const { data: session, status } = useSession();
    const exportTable = () => {
        const printElement = document.getElementById("invoice-root");

        if (!printElement) return;

        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printElement.innerHTML;
        window.print();
        document.body.innerHTML = originalContent;

        // Needed to reattach React events
        window.location.reload();
    };

    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [loading, setLoading] = useState(true);
    const [invoiceData, setInvoiceData] = useState<any>(null);

    const fetchPayoutReport = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/dash/student/billingHistory?id=${id}`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await res.json();
            setInvoiceData(data?.data || []);
            setLoading(false);
            // console.log(data?.data?.members?.users , ">>>>>>")
        } catch (err) {
            console.error("Data fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayoutReport()
    }, [])
    const items = [
        {
            id: 1,
            title: 'Calendar App Customization',
            quantity: 1,
            price: '120',
            amount: '120',
        },
        {
            id: 2,
            title: 'Chat App Customization',
            quantity: 1,
            price: '230',
            amount: '230',
        },
        {
            id: 3,
            title: 'Laravel Integration',
            quantity: 1,
            price: '405',
            amount: '405',
        },
        {
            id: 4,
            title: 'Backend UI Design',
            quantity: 1,
            price: '2500',
            amount: '2500',
        },
    ];

    const columns = [
        {
            key: 'id',
            label: 'S.NO',
        },
        {
            key: 'title',
            label: 'ITEMS',
        },
        {
            key: 'quantity',
            label: 'QTY',
        },
        {
            key: 'price',
            label: 'PRICE',
            class: 'ltr:text-right rtl:text-left',
        },
        {
            key: 'amount',
            label: 'AMOUNT',
            class: 'ltr:text-right rtl:text-left',
        },
    ];
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // usage
    // formatDate("2024-08-17T00:00:00.000Z"); // 17 Aug 2024

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-center justify-center gap-4 lg:justify-end">
                {/* <button type="button" className="btn btn-info gap-2">
                    <IconSend />
                    Send Invoice
                </button> */}

                <button type="button" className="btn btn-primary gap-2" onClick={() => exportTable()}>
                    <IconPrinter />
                    Print
                </button>

                <button type="button" className="btn btn-success gap-2" onClick={downloadInvoice}>
                    <IconDownload />
                    Download
                </button>

                {/* <Link href="/apps/invoice/add" className="btn btn-secondary gap-2">
                    <IconPlus />
                    Create
                </Link>

                <Link href="/apps/invoice/edit" className="btn btn-warning gap-2">
                    <IconEdit />
                    Edit
                </Link> */}
            </div>
            {loading ? <InvoiceSkeleton /> :
            <div className="panel" id="invoice-root">
                <div className="flex flex-wrap justify-between gap-4 px-4">
                    <div className="text-2xl font-semibold uppercase">Invoice</div>
                    <div className="shrink-0">
                        <img src="/favicon.png" alt="img" className="w-14 ltr:ml-auto rtl:mr-auto" />
                    </div>
                </div>

                <div className="px-4 ltr:text-right rtl:text-left">
                    <div className="mt-6 space-y-1 text-white-dark">
                        <div>8244+XJF, Shakti Enclave, Kaonli, Dehradun, Uttarakhand 248171</div>
                        <div>thechartsfx89@gmail.com</div>
                        <div>+91 98775 94203</div>
                    </div>
                </div>

                <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                <div className="flex flex-col flex-wrap justify-between gap-6 lg:flex-row">
                    <div className="flex-1">
                        <div className="space-y-1 text-white-dark">
                            <div>Issue For:</div>
                            <div className="font-semibold text-black dark:text-white">{invoiceData?.name ?? invoiceData?.user?.fullName ?? ""}</div>
                            <div>{invoiceData?.address ?? ""} {invoiceData?.district ?? ""} {invoiceData?.city ?? ""} {invoiceData?.pincode ?? ""}</div>
                            <div>{invoiceData?.email ?? invoiceData?.user?.email ?? ""}</div>
                            <div>{invoiceData?.phone ?? invoiceData?.user?.mobileNumber ?? ""}</div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between gap-6 sm:flex-row lg:w-2/3">
                        <div className="xl:1/3 sm:w-1/2 lg:w-2/5">
                            <div className="mb-2 flex w-full items-center justify-between">
                                <div className="text-white-dark">Invoice :</div>
                                <div>{invoiceData?.invoice_no ?? ""}</div>
                            </div>
                            <div className="mb-2 flex w-full items-center justify-between">
                                <div className="text-white-dark">Issue Date :</div>
                                <div>{formatDate(invoiceData?.payment_date ?? "")}</div>
                            </div>
                            <div className="mb-2 flex w-full items-center justify-between">
                                <div className="text-white-dark">Order ID :</div>
                                <div>{invoiceData?.order_no ?? invoiceData?.purchased_course?.id ?? ""}</div>
                            </div>
                        </div>


                        <div className="xl:1/3 sm:w-1/2 lg:w-2/5">
                            <div className="mb-2 flex w-full items-center justify-between">
                                <div className="text-white-dark">Bank Holder Name:</div>
                                <div className="whitespace-nowrap">The Charts</div>
                            </div>
                            <div className="mb-2 flex w-full items-center justify-between">
                                <div className="text-white-dark">Account Number:</div>
                                <div>178111010000206</div>
                            </div>
                            <div className="mb-2 flex w-full items-center justify-between">
                                <div className="text-white-dark">IFSC Code:</div>
                                <div>UBIN0817813</div>
                            </div>
                            <div className="mb-2 flex w-full items-center justify-between">
                                <div className="text-white-dark">ADD:</div>
                                <div>Haryana</div>
                            </div>
                            <div className="mb-2 flex w-full items-center justify-between">
                                <div className="text-white-dark">Country:</div>
                                <div>India</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="table-responsive mt-6">
                    <table className="table-striped">
                        <thead>
                            <tr>
                                {columns.map((column) => {
                                    return (
                                        <th key={column.key} className={column?.class}>
                                            {column.label}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>{invoiceData?.purchased_course?.course?.course_title}</td>
                                <td>1</td>
                                <td className="ltr:text-right rtl:text-left">Rs {invoiceData?.base_price ?? invoiceData?.purchased_course?.course?.mrp}</td>
                                <td className="ltr:text-right rtl:text-left">Rs {invoiceData?.base_price ?? invoiceData?.purchased_course?.course?.mrp}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 grid grid-cols-1 px-4 sm:grid-cols-2">
                    <div></div>
                    <div className="space-y-2 ltr:text-right rtl:text-left">
                        <div className="flex items-center">
                            <div className="flex-1">Subtotal</div>
                            <div className="w-[37%]">Rs {invoiceData?.base_price ?? invoiceData?.purchased_course?.course?.gst ? invoiceData?.purchased_course?.course?.mrp:invoiceData?.purchased_course?.course?.course_price}</div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-1">GST</div>
                            <div className="w-[37%]">Rs {invoiceData?.gst ?? invoiceData?.purchased_course?.course?.gst ?? "0"}</div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-1">Discount</div>
                            <div className="w-[37%]">Rs {invoiceData?.discount ?? "0"}</div>
                        </div>
                        <div className="flex items-center text-lg font-semibold">
                            <div className="flex-1">Grand Total</div>
                            <div className="w-[37%]">Rs {invoiceData?.total_amount ?? invoiceData?.purchased_course?.course?.course_price}</div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default ComponentsAppsInvoicePreview;