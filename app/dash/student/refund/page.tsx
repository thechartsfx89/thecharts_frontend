"use client";

import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import IconBell from "@/components/icon/icon-bell";
import RefundForm from "./refundForm";

export default function RefundPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [purchases, setPurchases] = useState<any[]>([]);
  const [isToggle, setIsToggle] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClose = () => setIsToggle(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/course-refund", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const { data } = await res.json();

        const updated = data.map((item: any) => {
          const purchaseDate = new Date(item.purchased_date);
          const today = new Date();

          const diffMs = today.getTime() - purchaseDate.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

          const remainingDays = 15 - diffDays;

          return {
            ...item,
            remainingDays,
            canRefund: remainingDays > 0,
          };
        });

        setPurchases(updated);
        setLoading(false)

      } catch (error) {
        setLoading(false)
        console.log("Fetch course error:", error);
      }
    };

    fetchCourses();
  }, [isToggle]);

  // ---------------------------------------------------
  // OPEN REFUND MODAL
  // ---------------------------------------------------
  const handleRefund = ({ name, id }: any) => {
    // console.log({course})
    setSelectedCourse({ name, id });
    setIsToggle(true);
  };

  return (
    <div className="p-6 pt-1 max-w-full mx-auto">
      <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary mb-3">
        <div className="rounded-full bg-primary p-1.5 text-white ring-2 ring-primary/30 ltr:mr-3 rtl:ml-3">
          <IconBell />
        </div>
        <span className="ltr:mr-3 rtl:ml-3 font-bold">Refund Request</span>

      </div>

      <div className="overflow-x-auto panel rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 border-b">
            <tr>
              <th className="py-3 px-4 text-left font-bold">Course Name</th>
              <th className="py-3 px-4 text-left font-bold">Price</th>
              <th className="py-3 px-4 text-left font-bold">Days Left</th>
              <th className="py-3 px-4 text-left font-bold">Status</th>
               <th className="py-3 px-4 text-left font-bold">Remarks</th>
              <th className="py-3 px-4 text-left font-bold">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b animate-pulse">
                  <td className="py-3 px-4">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="h-8 w-28 bg-gray-200 rounded"></div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-8 w-28 bg-gray-200 rounded"></div>
                  </td>
                </tr>
              ))
            ) : (
              Array.isArray(purchases) && purchases?.length > 0 && purchases?.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-primary font-semibold ">{p.course.course_title}</td>
                  <td className="py-3 px-4 text-gray-800">₹{p.course.course_price}</td>

                  <td className="py-3 px-4 text-gray-800">
                    {p.canRefund ? (
                      <span className="text-green-600 font-medium">{p.remainingDays} days</span>
                    ) : (
                      <span className="text-red-600 font-medium">Expired</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-800"><span className={`badge ${p?.refunds[0]?.refund_status == "pending" ? "bg-warning" : p?.refunds[0]?.refund_status == "rejected" ? "bg-danger" : p?.refunds[0]?.refund_status == "approved" ? "bg-success" : ""}`}>{p?.refunds[0]?.refund_status ?? ""}</span></td>
                  
                    <td className="py-3 px-4 text-gray-800">
                      {p?.refunds[0]?.admin_comment &&<span>{p?.refunds[0]?.admin_comment ?? ""}</span>}
                    </td>
                  
                  <td className="py-3 px-4">
                    {!p?.refunds[0]?.refund_status ? <button
                      disabled={!p.canRefund}
                      onClick={() => handleRefund({ name: p?.course?.course_title, id: p?.documentId })}
                      className={`px-4 py-2 rounded-lg font-medium transition ${p.canRefund
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                    >
                      {p.canRefund ? "Apply Refund" : "Expired"}
                    </button>: 
                    <span className="font-bold text-success">Applied</span>}
                  </td>
                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>

      {/* ---------------------------------------------------  
          MODAL
      --------------------------------------------------- */}
      <Transition appear show={isToggle} as={Fragment}>
        <Dialog as="div" open={isToggle} onClose={handleClose}>
          <div className="fixed inset-0 bg-black/60 z-[999] overflow-y-auto">
            <div className="flex items-start justify-center min-h-screen px-4">
              <DialogPanel className="panel border-0 py-4 px-6 rounded-lg bg-white w-full max-w-lg my-8">
                {/* <h3 className="text-xl font-bold mb-4 text-center">
                  Refund Request
                </h3>

                <p className="text-center mb-4">
                  Course: {selectedCourse?.course?.course_title}
                </p>

                <button
                  onClick={handleClose}
                  className="w-full bg-gray-300 py-2 rounded-lg mt-4"
                >
                  Close
                </button> */}
                <RefundForm courseName={selectedCourse?.name} courseId={selectedCourse?.id} handleClose={handleClose} />
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
