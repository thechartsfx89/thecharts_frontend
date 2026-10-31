import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    console.log("🔹 Fetching student data...", { id });

    let url: string;

    if (id) {

      url = `${API_ENDPOINTS.filterUser}/${id}?populate=*`;
    } else {
      const query =
        "populate=*&filters[$or][0][role][name][$eq]=student&filters[$or][1][role][id][$eq]=3";
      url = `${API_ENDPOINTS.filterUser}?${query}`;
    }

    const response = await apiService.get(url);

    console.log("✅ Student data fetched:", response.data);

    if (id && !response.data) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: response.data },
      { status: response.status || 200 }
    );
  } catch (err: any) {
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.error?.message ||
      "Something went wrong while fetching student data!";
    console.error("❌ Error fetching student data:", message);

    return NextResponse.json({ error: message }, { status });
  }
}
