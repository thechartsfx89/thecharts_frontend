import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({ req });
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    
    // Extract parameters
    const search = searchParams.get("search")?.trim() || ""; 
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";
    const sort = searchParams.get("sort") || "createdAt:desc";

    // 1. Properly structure the params object
    const params = {
      page,
      pageSize,
      search,
      sort
    };

    // 2. Pass 'params' directly (do not wrap in another object)
    const response = await apiService.get(`${API_ENDPOINTS.globalUserSummary}`, {
      params, // Axios will now send: ?page=1&pageSize=10&search=...
      headers: {
        Authorization: `Bearer ${token.jwt}`,
      },
    });

    return NextResponse.json(
      {
        data: response.data.data,
        meta: response.data.meta,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Route Error:", err.response?.data || err.message);
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: err?.response?.data || err.message,
      },
      { status: err.response?.status || 500 }
    );
  }
}