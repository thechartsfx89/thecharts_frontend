
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({ req });
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId")?.trim(); // 1. Trim the whitespace
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";
    const sort = searchParams.get("sort") || "createdAt:desc";
    
    const isAdmin = token?.user?.role === "admin";

    // 2. Initialize Query Parameters
    const queryParams: any = {
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      sort,
      "populate[sourceUser][fields][0]": "username",
      "populate[earner][fields][0]": "username",
    };

    // 3. Logic: Determine who we are filtering for
    if (isAdmin) {
      if (userId) {
        // If Admin searches for a specific ID or Username
        const isUsername = userId.toUpperCase().startsWith('EC');
        if (isUsername) {
          queryParams["filters[earner][username][$eqi]"] = userId;
        } else {
          queryParams["filters[earner][id][$eqi]"] = userId;
        }
      }
      // If no userId and admin, it fetches everything (Global View)
    } else {
      // Regular users are locked to their own ID
      queryParams["filters[earner][id][$eqi]"] = token.sub;
    }

    // 4. Make the call to Transaction History
    const response = await apiService.get(API_ENDPOINTS.transactionHistory, {
      params: queryParams,
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
      { status: 500 }
    );
  }
}