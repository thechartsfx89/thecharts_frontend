"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Refund() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Submitting...");

    if (!userEmail) {
      setMessage("❌ Please log in to submit a refund request.");
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/refunds`;

      const payload = {
        data: {
          title,
          description,
          email: userEmail, // ✅ use real logged-in email
          progress: "Pending",
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error?.message || "Failed to submit");

      setMessage("✅ Refund complaint submitted successfully!");
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setMessage(`❌ Something went wrong: ${err.message}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto  p-6 ">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Refund Request Form
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit Complaint
        </button>
      </form>

      {message && <p className="text-center mt-4">{message}</p>}
    </div>
  );
}
