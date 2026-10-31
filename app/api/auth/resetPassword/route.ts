import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function POST(req: NextRequest) {
  try {
    const { code, password, passwordConfirmation } = await req.json();

    if (!code || !password || !passwordConfirmation) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Call Strapi reset-password API
    const response = await apiService.post(
      API_ENDPOINTS.resetPassword, // should be "/auth/reset-password"
      {
        code,
        password,
        passwordConfirmation,
      }
    );

    return NextResponse.json(
      {
        message: "Password reset successful",
        data: response.data,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Reset password error:", err.response?.data || err.message);

    const status = err.response?.status || 500;
    const message =
      err.response?.data?.error?.message || "Failed to reset password";

    return NextResponse.json({ error: message }, { status });
  }
}
