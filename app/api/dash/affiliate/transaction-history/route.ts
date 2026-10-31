
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({ req });

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Read pagination and sort params
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";
    const sort = searchParams.get("sort") || "createdAt:desc";

    // 1. Initialize base parameters
    const queryParams: any = {
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort,
      "populate[sourceUser][fields][0]": "username",
      "populate[earner][fields][0]": "username", // Added to see who earned what in Admin view
    };

    // 2. Logic: If NOT admin, apply the "earner" filter
    // Adjust 'admin' to whatever string your role uses (e.g., 'Admin', 'authenticated')
    if (token.user.role !== "admin") {
      queryParams["filters[earner][id][$eq]"] = token.sub;
    }

    const response = await apiService.get(
      `${API_ENDPOINTS.transactionHistory}`,
      {
        params: queryParams,
      }
    );

    return NextResponse.json(
      {
        data: response.data.data,
        meta: response.data.meta,
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