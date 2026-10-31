// File: app/api/blogs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log("Video ID:", id);

    // Example: Adjust this based on your Strapi model field name
    //  const url = `${API_ENDPOINTS.purchasedCoursesDetail}?filters[vdo_id][$eq]=${id}&populate[course_resources_download]=*&populate[course_thumbnail]=*&populate[teacher][populate][teacher_image][populate]=*`;
    const url = `${API_ENDPOINTS.enrollCoursesDetail}?filters[vdo_id][$eq]=${id}&populate=course_resources_download&populate=course_thumbnail&populate=teacher.teacher_image&populate=quiz`;


    // Fetch from Strapi
    const response = await apiService.get(url);

    if (!response.data || !response.data.data?.length) {
      return NextResponse.json(
        { error: "No course found for the provided video ID" },
        { status: 404 }
      );
    }

    const { data, meta } = response.data;

    return NextResponse.json(
      { data, meta },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    // console.error("API Error:", err?.response?.data || err);
    const status = err?.response?.status ?? 500;
    const message =
      err?.response?.data?.error?.message ??
      "Failed to fetch course details from Strapi";

    return NextResponse.json({ error: message, status }, { status });
  }
}
