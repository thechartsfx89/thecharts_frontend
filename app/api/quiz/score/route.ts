import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("quizId");

    if (!quizId) {
      return NextResponse.json({ error: "quizId is required" }, { status: 400 });
    }

    // Authenticate user
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.user.id;

    // Fetch latest quiz result for this user
    const response = await apiService.get(
      `/quiz-scores?filters[quiz][id][$eq]=${quizId}&filters[user][id][$eq]=${userId}&sort[0]=id:desc&pagination[pageSize]=1`
    );

    const results = response.data.data;

    if (!results.length) {
      return NextResponse.json({
        taken: false,
        message: "No quiz attempt found",
      });
    }

    const result = results[0];

    return NextResponse.json({
      taken: true,
      score: result.attributes.score,
      total: result.attributes.total,
      percentage: result.attributes.percentage,
      passed: result.attributes.passed,
      createdAt: result.attributes.createdAt,
    });
  } catch (err: any) {
    console.log("Quiz result fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch quiz result" },
      { status: 500 }
    );
  }
}
