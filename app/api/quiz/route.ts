// app/api/quiz/route.ts
import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    // Extract token
    // const token: any = await getToken({
    //   req,
    //   secret: process.env.NEXTAUTH_SECRET,
    // });

    // if (!token?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const userId = token.user.id;
    // console.log("Authenticated userId:", userId);

    // Extract query params if needed
    const { searchParams } = new URL(req.url);
    
    // Optional: If you want module filtering later
    const id = searchParams.get("moduleId") || "";

    // Build Strapi URL
    const url = `${API_ENDPOINTS.quiz}?filters[course_module][documentId]=${id}&populate[recorderd_lecture][fields][]=course_title&populate[questions][fields][]=id&populate[questions][fields][]=question&populate[questions][fields][]=option_1&populate[questions][fields][]=option_2&populate[questions][fields][]=option_3&populate[questions][fields][]=option_4`
     

    // Fetch from Strapi
    const response = await apiService.get(url);

    const { data, meta } = response.data ?? {};

    return NextResponse.json(
      { data, meta },
      {
        status: response.status,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const message =
      err?.response?.data?.error?.message ?? "Failed to fetch quiz";

    return NextResponse.json({ error: message, status }, { status });
  }
}
