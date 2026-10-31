// File: app/api/auth/register/route.ts
import { NextResponse, NextRequest } from "next/server";
import apiService from "@/lib/axios";
import { UserLoginRes } from "@/types/user";
import { API_ENDPOINTS } from "@/api-constant";

const generateReferralCode = () => {
  return "EC" + Math.floor(100000 + Math.random() * 900000);
};

async function generateUniqueReferralCode() {
  let code = "";
  let exists = true;
  let attempts = 0;

  while (exists && attempts < 5) {
    attempts++;
    code = generateReferralCode();

    // 🔍 check if code exists in Strapi
    const res = await apiService.get(API_ENDPOINTS.filterUser, {
      params: {
        filters: { ownReferralCode: code },
        pagination: { pageSize: 1 },
      },
    });

    exists = res.data?.length > 0;
  }

  if (exists) {
    throw new Error("Unable to generate unique referral code");
  }

  return code;
}
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const uniqueCode = await generateUniqueReferralCode();
    // console.log({d})
     data.ownReferralCode = uniqueCode;
     data.username = uniqueCode;
     data.referredBy = data?.referralBy || null; // Handle case where referralBy might be undefined
    const response = await apiService.post<UserLoginRes>(
      API_ENDPOINTS.register,
     data
    );
  //  console.log( response.data)
   
    // Build NextResponse
    const nextRes = NextResponse.json({status:response?.status, statusText: response?.statusText, data: response.data }, { status: 200 });

    // Fix: handle string[] cookies
    if (response.headers["set-cookie"]) {
      const cookies = (response.headers["set-cookie"] as string[]).join("; ");
      nextRes.headers.set("Set-Cookie", cookies);
    }

    return nextRes;
  } catch (err: any) {
    console.log({err})
    const message = err?.error?.message ||
      err.response?.data?.error?.message || "Something went wrong.";
    return NextResponse.json(
      { error: message, status: err.response?.status || 400 },
      { status: err.response?.status || 400 }
    );
  }
}
