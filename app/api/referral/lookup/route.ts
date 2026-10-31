

import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Referral code required" }, { status: 400 });
  }

  try {
    // 1. Call Strapi with the new simplified controller logic
    const res = await apiService.get(
      API_ENDPOINTS.filterUser,
      {
        params: {
          filters: {
            username: { $eqi: code }
          },
          // Ensure we select fullName and id
          fields: ["id", "fullName"] 
        }
      }
    );

    // 2. Updated Data Access: res.data.data is the user object
    const user = res?.data?.data[0];
    // console.log({user})
    // 3. Handle 'not found'
    if (!user) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    // 4. Return clean data to the frontend
    return NextResponse.json({
      userId: user.id,
      name: `${user.fullName || ""}`.trim(),
    });

  } catch (err: any) {
    // Check if Strapi sent a 404 (ctx.notFound)
    if (err.response?.status === 404) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    console.error("❌ Referral Check Error:", err.message);
    return NextResponse.json({ error: "Failed to verify referral code" }, { status: 500 });
  }
}