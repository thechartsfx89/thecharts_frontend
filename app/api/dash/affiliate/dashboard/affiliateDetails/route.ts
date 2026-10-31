import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function GET(req: NextRequest) {
    try {
        const token: any = await getToken({ req });

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // ✅ Check nested role: token.user.role
        const isAdmin = token?.user?.role === "admin";

        /* LOGIC: 
           - Admin: Hits the full list endpoint (e.g., /affiliate-dash-details)
           - User: Hits their specific ID endpoint (e.g., /affiliate-dash-details/123)
        */
        const url = isAdmin 
            ? `${API_ENDPOINTS.affiliateDashDetails}` 
            : `${API_ENDPOINTS.affiliateDashDetails}/${token.sub}`;

        const response = await apiService.get(url, {
            headers: {
                Authorization: `Bearer ${token.jwt}`,
            },
        });

        return NextResponse.json(
            { data: response.data.data, status: response.status },
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