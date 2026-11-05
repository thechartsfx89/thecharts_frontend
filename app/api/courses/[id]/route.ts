import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";
import { entryForSlug } from "@/utils/course-catalogue";

const POPULATE = "populate=course_modules&populate=course_thumbnail";

// Accepts a Strapi documentId or a catalogue slug such as "premium"
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const cookie = req.headers.get("cookie") ?? "";
    const headers = cookie ? { cookie } : undefined;
    const entry = entryForSlug(id);

    let course: any;
    if (entry) {
      const response = await apiService.get(`${API_ENDPOINTS.coursedetails}?filters[catalogue_key][$eq]=${entry.key}&${POPULATE}`, { headers });
      course = response.data?.data?.[0] ?? null;
    } else {
      const response = await apiService.get(`${API_ENDPOINTS.coursedetails}/${id}?${POPULATE}`, { headers });
      course = response.data?.data ?? null;
    }

    // Premium includes all Advanced videos, which stay attached to the Advanced course
    if (course?.catalogue_key === "premium") {
      const advanced = await apiService.get(`${API_ENDPOINTS.coursedetails}?filters[catalogue_key][$eq]=advanced&populate=course_modules`, { headers });
      course.course_modules = [...(advanced.data?.data?.[0]?.course_modules ?? []), ...(course.course_modules ?? [])];
    }

    return NextResponse.json(
      { data: course },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const message = err?.response?.data?.error?.message ?? "Failed to fetch course details";

    return NextResponse.json({ error: message, status }, { status });
  }
}
