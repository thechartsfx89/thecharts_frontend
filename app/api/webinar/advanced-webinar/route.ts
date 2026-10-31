import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
    try {
        const token: any = await getToken({ req });

        if (!token?.jwt) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Use token.sub or token.user.id consistently
        const userId = token?.id || token?.sub || token?.user?.id;

        // 1. Fetch Quiz Scores with specific filters
        const quizRes = await apiService.get(`/quiz-scores`, {
            headers: { Authorization: `Bearer ${token.jwt}` },
            params: {
                "filters[user][id][$eq]": userId,
                "filters[score][$gte]": 60,
                "filters[course_modules][recorderd_lecture][documentId][$eq][0]": "yijrnm2mbfm4rxxm5mumf0gb",
               
            },
        });

        const quizScores = quizRes.data?.data || [];
        // console.log({ quizScores })
        // 2. Initialize the response variable to avoid undefined errors
        let webinars: any[] = [];

        // 3. Only fetch webinars if criteria is met (Exactly 5 successful quizzes)
        if (quizScores.length >= 5) {
            const webinarRes = await apiService.get(`/webinars`, {
                headers: { Authorization: `Bearer ${token.jwt}` },
                params: {
                    populate: "*", // Or specific fields if preferred
                    filters: {
                        type: "ADVANCED_WEBINAR"
                    }
                },

            });
            webinars = webinarRes.data?.data || [];
        }

        // 4. Return the data (will be empty array if scores < 5)
        return NextResponse.json({
            data: webinars,
            quizCount: quizScores.length // Useful for frontend to show progress
        });

    } catch (error: any) {
        console.error("Advanced Webinar Error:", error, error.response?.data || error.message);
        return NextResponse.json(
            { error: error.response?.data?.error?.message || "Failed to fetch webinars" },
            { status: error.response?.status || 500 }
        );
    }
}