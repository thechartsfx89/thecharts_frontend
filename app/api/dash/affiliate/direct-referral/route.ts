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

        const response = await apiService.get(`${API_ENDPOINTS.directReferral}/${token.sub}/1`, {
            headers: {
                Authorization: `Bearer ${token.jwt}`,
            },
        });

        return NextResponse.json(
            { data: response.data, status:response.status },
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