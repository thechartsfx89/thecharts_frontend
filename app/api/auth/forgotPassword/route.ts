import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";
import { ForgotRes, UserLoginRes } from "@/types/user";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // 🔍 Step 1: Check if user exists
    const users = await apiService.get(API_ENDPOINTS.filterUser, {
      params: { filters: { email: { $eq: email } } },
    });

    if (!users.data || users.data.length === 0) {
      return NextResponse.json(
        { error: "No user found with this email." },
        { status: 404 }
      );
    }

    // ✅ Step 2: Proceed with forgot password
    const response = await apiService.post<ForgotRes>(
      API_ENDPOINTS.forgotPassword,
      { email },
      {
        withCredentials: false,
      }
    );

    return NextResponse.json(
      { data: response.data, status: response.status },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Forgot password error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.error?.message || "Something went wrong!";
    return NextResponse.json({ error: message }, { status });
  }
}
