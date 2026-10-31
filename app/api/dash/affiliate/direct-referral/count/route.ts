import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import apiService from "@/lib/axios";

export async function GET(req: NextRequest) {
    try {
        const token: any = await getToken({ req });

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Strapi's /api/users returns a plain array — no meta.pagination support.
        // We fetch only the fields we need to keep the payload light.
        const query = new URLSearchParams({
            "filters[referredBy][id][$eq]": token.sub,
            "filters[confirm_affiliate_payment][$eq]": "true",
            "fields[0]": "id",          // fetch only IDs — minimises payload
        }).toString();

        const response = await apiService.get(`/users?${query}`, {
            headers: {
                Authorization: `Bearer ${token.jwt}`,  // required for /api/users
            },
        });

        // /api/users always returns a plain array — derive count from .length
        const data = response.data;
        const totalCount = Array.isArray(data) ? data.length : 0;

        return NextResponse.json(
            { count: totalCount },
            { status: 200 }
        );

    }  catch (err: any) {
    return NextResponse.json(
        {
            message: "Something went wrong",
            error: err?.response?.data || err.message,
            status: err?.response?.status,   // ← add this
        },
        { status: 500 }
    );
}
}