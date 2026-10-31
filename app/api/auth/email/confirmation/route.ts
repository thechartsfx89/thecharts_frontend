import { API_ENDPOINTS } from "@/api-constant";
import apiService from "@/lib/axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

       const res = await apiService.post(API_ENDPOINTS.sendEmailConfirmation,
        { email },
      );

     return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully",
        data: res.data,
      },
      { status: res.status || 200 }
    );
  } catch (error: any) {
    console.error("Email confirmation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
