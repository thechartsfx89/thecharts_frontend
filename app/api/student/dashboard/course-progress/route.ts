import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.user.id;
    console.log("Authenticated userId:", userId);

    // ✅ Fetch all video-progress entries for this user
    const response = await apiService.get(
      `${API_ENDPOINTS.videoProgress}?filters[user][id][$eq]=${userId}&populate=*`,
    );

    const { data } = response.data ?? {};
    // console.log("Fetched video progress data:", data);  
    if (!data || data.length === 0) {
      return NextResponse.json({ totalTime: 0 }, { status: 200 });
    }

    // ✅ Sum up all current_time fields
    const totalTime = data.reduce((sum: number, item: any) => {
      return sum + (item?.current_time || 0);
    }, 0);

    return NextResponse.json(
      { totalTime },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    console.error("Error fetching course progress:", err);
    const status = err?.response?.status ?? 500;
    const message =
      err?.response?.data?.error?.message ?? "Failed to fetch course progress";
    return NextResponse.json({ error: message, status }, { status });
  }
}
