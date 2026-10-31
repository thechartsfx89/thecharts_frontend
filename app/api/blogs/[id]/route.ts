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
 

    // Forward cookies if authentication/session needed
    const cookie = req.headers.get("cookie") ?? "";

    // Fetch blog details from Strapi (populate to get relations like image, author, etc.)
    const response = await apiService.get(`${API_ENDPOINTS.blogdetails}/${id}?populate=*`, {
      headers: cookie ? { cookie } : undefined,
    });

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
      err?.response?.data?.error?.message ?? "Failed to fetch blog details";

    return NextResponse.json({ error: message, status }, { status });
  }
}
