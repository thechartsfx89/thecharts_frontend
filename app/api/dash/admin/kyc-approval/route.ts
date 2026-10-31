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
       

        // ✅ NEW: Search param
        const search = searchParams.get("search")?.trim() || "";

        // ✅ Date filters
        // const sort = searchParams.get("sort") || "updatedAt:asc";
        const sort = "updatedAt:desc";


        // 1. Extract Date Filters from Query (Matches your sketch)
        const fromDate = searchParams.get("from");
        const toDate = searchParams.get("to");

        // ✅ Search Filters (Strapi)
        const searchFilters = search
            ? {
                  "filters[$or][0][user][username][$containsi]": search,
                  "filters[$or][1][user][fullName][$containsi]": search,
                  "filters[$or][2][pan_card][$containsi]": search,
              }
            : {};

        // ✅ Date Filters
        const dateFilters =
            fromDate && toDate
                ? {
                      "filters[createdAt][$gte]": `${fromDate}T00:00:00.000Z`,
                      "filters[createdAt][$lte]": `${toDate}T23:59:59.999Z`,
                  }
                : {};

        // ✅ API Call
        const response = await apiService.get(
            `${API_ENDPOINTS.kycApproval}`,
            {
                params: {
                    "pagination[page]": page,
                    "pagination[pageSize]": pageSize,
                    sort,

                    // 🔥 Merge filters
                    ...searchFilters,
                    ...dateFilters,

                   
                    "populate[address_proof_doc][fields][0]": "url",
                    "populate[pan_doc][fields][0]": "url",
                    "populate[aadhar_doc][fields][0]": "url",
                    "populate[passbook_doc][fields][0]": "url",
                    "populate[user][fields][0]": "username",
                    "populate[user][fields][1]": "fullName",
                },
            }
        );

        // 3. Flatten the data for the Mantine DataTable
        // Strapi returns data in { id, attributes: { ... } } format.
        // We map it to { id, ...attributes } so your table columns work.
        // const flattenedData = response.data.data.map((item: any) => {
        //     const attrs = item.attributes || item; // Handle both Strapi v4 and flattened formats
        //     return {
        //         id: item.id,
        //         ...attrs,
        //         // Ensure 'user' accessor in your table gets the username
        //         user: attrs.user?.data?.attributes?.username || attrs.user?.username || "N/A",
        //     };
        // });

        return NextResponse.json(
            {
                data: response.data.data,
                meta: response.data.meta,
            },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("Route Error:", err);

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
        const { documentId, kyc_status, admin_remarks } = body;
        
        console.log("Processing update for:", documentId);

        const token: any = await getToken({ req });
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // STRAPI FIX: Wrap the attributes inside a 'data' object
        const updateRes = await apiService.put(
            `${API_ENDPOINTS.kycApproval}/${documentId}`,
            {
                data: {
                    kyc_status,
                    admin_remarks,
                    // Optional: If you want to sync the DB timestamps manually 
                    // since we saw they were [null] earlier:
                    // updatedAt: new Date().toISOString(), 
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token.jwt}`,
                },
            }
        );

        return NextResponse.json({
            status: 200,
            message: "KYC Status Updated",
            user: updateRes.data,
        });
    } catch (error: any) {
        // Detailed logging to help you see exactly what Strapi didn't like
        console.error("❌ Strapi Error Details:", error?.response?.data || error);
        
        return NextResponse.json(
            { 
                message: "Server error", 
                error: error?.response?.data?.error?.message || error.message 
            },
            { status: 500 }
        );
    }
}