import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
    try {
         const token: any = await getToken({ req });

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // 🔹 Parallel API calls
        const [
            studentsRes,
            // teachersRes,
            // coursesRes,
            // enrolledRes,
        ] = await Promise.all([
            apiService.get(`${API_ENDPOINTS.studentDash}`,
             {  headers: {
                Authorization: `Bearer ${token.jwt}`,
            },}
            ),
            // apiService.get(`${API_ENDPOINTS.teachers}?pagination[pageSize]=1`),
            // apiService.get(`${API_ENDPOINTS.courses}?pagination[pageSize]=1`),
            // apiService.get(
            //     `${API_ENDPOINTS.enrollments}?filters[user][id][$eq]=${userId}&pagination[pageSize]=1`
            // ),
        ]);

        // const total_students =
        //     studentsRes?.data?.meta?.pagination?.total ?? 0;

        // const total_teachers =
        //     teachersRes?.data?.meta?.pagination?.total ?? 0;

        // const total_courses =
        //     coursesRes?.data?.meta?.pagination?.total ?? 0;

        // const enrolled_courses =
        //     enrolledRes?.data?.meta?.pagination?.total ?? 0;

        return NextResponse.json(
            {
                status: true,
                data: {
                    data:studentsRes?.data,
                    // total_teachers,
                    // total_courses,
                    // enrolled_courses,
                },
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store",
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (err: any) {
        console.error("Student dashboard API error:", err);

        const status = err?.response?.status ?? 500;
        const message =
            err?.response?.data?.error?.message ??
            "Failed to fetch dashboard data";

        return NextResponse.json(
            { status: false, error: message },
            { status }
        );
    }
}
