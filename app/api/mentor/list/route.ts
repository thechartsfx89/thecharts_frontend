import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    console.log("🔹 Fetching mentor data...", { id });

    let url: string;

    if (id) {

      url = `${API_ENDPOINTS.filterUser}/${id}?populate=*`;
    } else {
      const query =
        "filters[$or][0][role][name][$eq]=mentor&filters[$or][1][role][id][$eq]=4&populate[0]=profile_image";
      url = `${API_ENDPOINTS.filterUser}?${query}`;
    }

    const response = await apiService.get(url);

    // console.log("✅ Mentor data fetched:", response.data);

    if (id && !response.data) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: response.data },
      { status: response.status || 200 }
    );
  } catch (err: any) {
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.error?.message ||
      "Something went wrong while fetching mentor data!";
    console.error("❌ Error fetching mentor data:", message);

    return NextResponse.json({ error: message }, { status });
  }
}
