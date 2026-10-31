import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.referralBy || !body?.referrals) {
      return NextResponse.json(
        { error: "referralBy and referrals required" },
        { status: 400 }
      );
    }

    // ✅ Wrap inside `data`
    const res = await apiService.post(
      API_ENDPOINTS.referral,
      {
        data: {
          referralBy: body.referralBy,
          referrals: body.referrals,
        },
      }
    );

    return NextResponse.json(
      { success: true, referralId: res.data?.id },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Referral API error:", err?.response?.data || err);
    return NextResponse.json(
      { error: "Failed to add referral code" },
      { status: 500 }
    );
  }
}
