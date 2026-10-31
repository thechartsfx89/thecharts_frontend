import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function GET(req: NextRequest) {
  try {
    // 🔐 Authenticate
    const token: any = await getToken({ req });

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🎯 Fetch wallet (ONE wallet per user)
    const response = await apiService.get(
      `${API_ENDPOINTS.wallet}`,
      {
        params: {
          "filters[user][id][$eq]": token.sub,
        },
        headers: {
          Authorization: `Bearer ${token.jwt}`,
        },
      }
    );

    const wallet = response.data?.data?.[0] || null;

    return NextResponse.json(
      {
        data: wallet,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: err?.response?.data || err.message,
      },
      { status: 500 }
    );
  }
}
