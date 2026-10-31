import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function GET(req: NextRequest) {
  try {
    // 🔐 Auth
    const token = await getToken({ req });

    if (!token?.jwt) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔎 Query params
    const id = req.nextUrl.searchParams.get("id");

    // 🔗 Common headers
    const headers = {
      Authorization: `Bearer ${token.jwt}`,
    };

    // 📦 Common populate string (single source of truth)
    const populateQuery =
      "populate[purchased_course][populate]=course&populate=user";

    // 📄 Fetch single document
    if (id) {
      const response = await apiService.get(
        `${API_ENDPOINTS.billingHistory}/${id}?${populateQuery}`,
        { headers }
      );

      return NextResponse.json(response.data, { status: 200 });
    }

    // 📑 Fetch user billing history
    const response = await apiService.get(
      `${API_ENDPOINTS.billingHistory}?filters[user][id][$eq]=${token.sub}&${populateQuery}`,
      { headers }
    );

    return NextResponse.json(response.data, { status: 200 });

  } catch (err: any) {
    console.error("Billing history error:", err);

    return NextResponse.json(
      {
        message: "Something went wrong",
        error: err?.response?.data || err.message,
      },
      { status: err?.response?.status || 500 }
    );
  }
}
