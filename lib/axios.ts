// lib/axios.ts
import axios from "axios";
import { getSession } from "next-auth/react";
import { startLoading, stopLoading } from "@/lib/loader";
console.log('Base URL:', process.env.NEXT_PUBLIC_API_URL);

const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  // timeout: 6000, // ⏱️ Terminate requests after 6 seconds
});

// --- Request Interceptor ---
apiService.interceptors.request.use(
  async (config) => {
    startLoading();
    const session: any = await getSession();
    console.log({session})
    const token = session?.jwt;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    stopLoading();
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
apiService.interceptors.response.use(
  (response) => {
    stopLoading();
    return response;
  },
  (error) => {
    stopLoading();

    // Handle timeout errors clearly
    if (error.code === "ECONNABORTED") {
      console.error("⏰ Request timed out after 6 seconds");
      return Promise.reject(new Error("Request timed out. Please try again."));
    }

    // console.error("API Error:>>>>", error?.response?.data)
      // console.log("Status:", error.message)
    
    return Promise.reject(error?.response?.data);
  }
);

export default apiService;
