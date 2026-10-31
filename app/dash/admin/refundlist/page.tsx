"use client";

import { useState } from "react";

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
    alert(`Refund applied for purchase ID: ${id}`);
  };

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
    </div>
  );
}
