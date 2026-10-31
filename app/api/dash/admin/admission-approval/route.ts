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

    // ✅ Read pagination params from query
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";
    const sort = searchParams.get("sort") || "createdAt:desc";
    
    // 🔍 NEW: Read search param
    const search = searchParams.get("search") || "";

    // 🔍 NEW: Construct Strapi filters for searching
    const searchFilters = search ? {
      "filters[$or][0][user][username][$containsi]": search,
      "filters[$or][1][user][fullName][$containsi]": search,
      "filters[$or][2][transaction_id][$containsi]": search,
    } : {};

    const response = await apiService.get(
      `${API_ENDPOINTS.admissionApproval}`,
      {
        params: {
          "pagination[page]": page,
          "pagination[pageSize]": pageSize,
          sort,
          // 🔍 NEW: Spread search filters into params
          ...searchFilters,
          "populate[user][fields][0]": "username",
          "populate[user][fields][1]": "fullName",
           "populate[course][fields][0]": "course_title",        
       "populate[purchased_course][populate][course][fields][0]": "course_title",
       "populate[purchased_course][populate][course][fields][1]": "course_price",

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
        const { documentId, payment_status, admin_comment } = body;
        
        const token: any = await getToken({ req });
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // 1. Conditional: Only set paid_date if the status is specifically 'PAID'
        const updateData: any = {
            payment_status,
            admin_comment,
        };

        // if (payment_status === 'SUCCESS') {
        //     updateData.paid_date = new Date().toISOString();
        // }

        const updateRes = await apiService.put(
            `${API_ENDPOINTS.admissionApproval}/${documentId}`,
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
            message: "Payment Status Updated",
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