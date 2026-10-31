"use client";

import { useState } from "react";

export function CourseForm() {
  const [formData, setFormData] = useState<any>({
   
    name: "",
    surname: "",
    email: "",
    message: "",
  });

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border rounded-xl shadow-md bg-white space-y-4"
    > <label  >Name</label>
      <input
      
        type="text"
        name="name"
        placeholder="value"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
      />
       <label >Surname</label>
      <input
        type="text"
        name="surname"
        placeholder="value"
        value={formData.surname}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
      />
       <label >Email</label>
      <input
        type="email"
        name="email"
        placeholder="value"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
      />
       <label >Message</label>
      <textarea
        name="message"
        placeholder="value"
        rows={4}
        value={formData.message}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
      />
      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
      >
        Submit
      </button>
    </form>
  );
}
