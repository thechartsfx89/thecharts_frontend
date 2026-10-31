import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string; level: string } }
) {
  try {
    /* -------------------- Auth -------------------- */
    const token: any = await getToken({ req });

    if (!token || !token.jwt) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId, level } = params;

    if (!userId || !level) {
      return NextResponse.json(
        { message: "Invalid parameters" },
        { status: 400 }
      );
    }

    /* -------------------- Backend API Call -------------------- */
    const response = await apiService.get(
      `${API_ENDPOINTS.genealogy}/${userId}/${level}`,
      {
        headers: {
          Authorization: `Bearer ${token.jwt}`,
        },
      }
    );

    /* -------------------- Response -------------------- */
    return NextResponse.json(
      {
        success: true,
        data: response.data,
        status: response.status,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Referral tree API error:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: err?.response?.data || err.message,
      },
      { status: err?.response?.status || 500 }
    );
  }
}
