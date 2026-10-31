// app/api/auth/email-confirmation/route.ts
import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const confirmation = searchParams.get("confirmation");

    if (!confirmation) {
      return NextResponse.json(
        { error: "Confirmation token is required" },
        { status: 400 }
      );
    }

    // Call Strapi email confirmation endpoint
    const res = await apiService.get(
      `${API_ENDPOINTS.emailConfirmation}?confirmation=${confirmation}`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
        data: res.data,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Email confirmation error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error?.response?.data?.error?.message ||
          "Invalid or expired confirmation link",
      },
      { status: error?.response?.status || 400 }
    );
  }
}
