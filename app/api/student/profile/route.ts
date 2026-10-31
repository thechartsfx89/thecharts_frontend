// app/api/student/profile/route.ts
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

        // Call Strapi /me endpoint
        const response = await apiService.get(`${API_ENDPOINTS.me}?populate=profile_image&populate=member_master`, {
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

export async function PATCH(req: NextRequest) {
    try {
        const token: any = await getToken({ req });
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Strapi user update route: /users/:id
        const response = await apiService.put(
            `${API_ENDPOINTS.profile}/${token.sub}`,
            { ...body, fullName: `${body.firstName || ""} ${body.lastName || ""}`.trim() },  // only send updated fields (ex: { email, username, profile_image })
            {
                headers: {
                    Authorization: `Bearer ${token.jwt}`,
                },
            }
        );

        return NextResponse.json(
            { message: "Updated successfully", data: response.data },
            { status: 200 }
        );
    } catch (err: any) {
        return NextResponse.json(
            { message: "Update failed", error: err?.response?.data || err.message },
            { status: 500 }
        );
    }
}
