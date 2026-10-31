"use client";

import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import Refund from "../refund/page";

export default function RefundPage() {
  const [purchases] = useState([
    {
      id: "1",
      courseName: "React for Beginners",
      price: 49.99,
      daysLeft: 10,
      canRefund: true,
    },
    {
      id: "2",
      courseName: "Advanced Next.js",
      price: 79.99,
      daysLeft: 0,
      canRefund: false,
    },
    {
      id: "3",
      courseName: "Tailwind CSS Mastery",
      price: 29.99,
      daysLeft: 5,
      canRefund: true,
    },
  ]);

  const handleRefund = (id: string) => {
    setIsToggle(true)
    // alert(`Refund applied for purchase ID: ${id}`);
  };
  const [isToggle, setIsToggle] = useState(false);
  const handleClose = () => setIsToggle(false);
//  useEffect(() => {
//     setActiveModal(openModal); // sync external trigger
//   }, [openModal]);
  return (
    <div className="p-6 max-w-full mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Refund Requests</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 border-b">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Course Name</th>
              <th className="py-3 px-4 text-left font-semibold">Price</th>
              <th className="py-3 px-4 text-left font-semibold">Days Left</th>
              <th className="py-3 px-4 text-left font-semibold">Refund</th>
            </tr>
          </thead>

          <tbody>
            {purchases.map((p) => (
              <tr
                key={p.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 text-gray-800">{p.courseName}</td>
                <td className="py-3 px-4 text-gray-800">${p.price}</td>
                <td className="py-3 px-4 text-gray-800">
                  {p.canRefund ? (
                    <span className="text-green-600 font-medium">
                      {p.daysLeft} days
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">Expired</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <button
                    disabled={!p.canRefund}
                    onClick={() => handleRefund(p.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      p.canRefund
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {p.canRefund ? "Apply Refund" : "Expired"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <Transition appear show={isToggle} as={Fragment}>
            <Dialog as="div" open={isToggle} onClose={handleClose}>
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 " />
              </TransitionChild>
      
               <div className="fixed inset-0  bg-[black]/60 z-[999] overflow-y-auto">
          <div className="flex items-start justify-center min-h-screen px-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark">
                {/* Header */}
                {/* <div className="flex items-center justify-between p-5 font-semibold text-lg dark:text-white">
                  <div className='flex gap-2'>
                    <img src="/assets/images/auth/logo-mob.png" alt="img" width={40} />
                    <h5 className='text-dark'>Forgot Password</h5>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white-dark hover:text-black transition"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div> */}

                {/* Form */}
                

                  {/* <span className="text-xs">Enter Your email so that we can send you password reset link</span> */}
                
                <Refund />

                {/* Footer */}
                <div className="p-5 border-t border-[#ebe9f1] dark:border-white/10">
                  {/* <p className="text-sm text-center text-white-dark dark:text-white-dark/70">
                    Back to
                    <button
                      type="button"
                      className="text-[#515365] hover:underline dark:text-white-dark ltr:ml-1 rtl:mr-1"
                    
                    >
                      Login?
                    </button>
                  </p> */}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
            </Dialog>
          </Transition>
    </div>
  );
}
