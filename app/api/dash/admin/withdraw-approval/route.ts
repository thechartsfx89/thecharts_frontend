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

    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";
    const sort = searchParams.get("sort") || "createdAt:desc";

    const search = searchParams.get("search")?.trim() || "";
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");

    // ✅ Search Filters
    const searchFilters = search
      ? {
        "filters[$or][0][user][username][$containsi]": search,
        "filters[$or][1][user][fullName][$containsi]": search,
        "filters[$or][2][remark][$containsi]": search,
        "filters[$or][3][admin_remarks][$containsi]": search,
        "filters[$or][4][withdraw_amount][$containsi]": search,
        "filters[$or][5][payout_status][$containsi]": search,
      }
      : {};

    // ✅ Date Filters
    const dateFilters =
      fromDate && toDate
        ? {
          "filters[request_date][$gte]": `${fromDate}T00:00:00.000Z`,
          "filters[request_date][$lte]": `${toDate}T23:59:59.999Z`,
        }
        : {};

    const response = await apiService.get(
      `${API_ENDPOINTS.withdrawApproval}`,
      {
        params: {
          "pagination[page]": page,
          "pagination[pageSize]": pageSize,
          sort,
          ...searchFilters,
          ...dateFilters,
          "populate[user][fields][0]": "username",
          "populate[user][fields][1]": "fullName",
          "populate[kyc_document][fields][0]": "ifsc_code",
          "populate[kyc_document][fields][1]": "account_number",
          "populate[kyc_document][fields][2]": "bank_name",
          "populate[kyc_document][fields][3]": "upi_id",

         
        },
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


export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { documentId, payout_status, admin_remarks } = body;

    const token: any = await getToken({ req });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 1. Conditional: Only set paid_date if the status is specifically 'PAID'
    const updateData: any = {
      payout_status,
      admin_remarks,
    };

    if (payout_status === 'PAID') {
      updateData.paid_date = new Date().toISOString();
    }

    const updateRes = await apiService.put(
      `${API_ENDPOINTS.withdrawApproval}/${documentId}`,
      {
        data: updateData // Pass the filtered object here
      },
      {
        headers: {
          Authorization: `Bearer ${token.jwt}`,
        },
      }
    );

    return NextResponse.json({
      status: 200,
      message: "Payout Status Updated",
      data: updateRes.data,
    });
  } catch (error: any) {
    console.error("❌ Strapi Error:", error?.response?.data || error);
    return NextResponse.json(
      {
        message: "Server error",
        error: error?.response?.data?.error?.message || error.message
      },
      { status: 500 }
    );
  }
}