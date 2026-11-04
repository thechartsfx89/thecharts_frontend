import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

// Commission from verified admissions still inside the 7-day refund hold, for the logged-in user only
export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({ req });

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await apiService.get(API_ENDPOINTS.transactionHistory, {
      params: {
        "filters[earner][id][$eq]": token.sub,
        "filters[transaction_for][$eq]": "LEVEL_INCOME",
        "filters[transaction_status][$eq]": "PENDING",
        "filters[estimated_credit_at][$notNull]": true,
        "pagination[pageSize]": 100,
        sort: "estimated_credit_at:asc",
        "populate[sourceUser][fields][0]": "username",
        "populate[sourceUser][fields][1]": "fullName",
      },
      headers: {
        Authorization: `Bearer ${token.jwt}`,
      },
    });

    return NextResponse.json({ data: response.data.data }, { status: 200 });
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
