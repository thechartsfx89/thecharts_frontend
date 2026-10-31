import { NextRequest, NextResponse } from "next/server";
import { BASE_VDOCIPHER_URL } from "@/api-constant";
import apiService from "@/lib/axios";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || "50";
    const sort = searchParams.get("sort") || "-upload_time";
    const vdo_ids = searchParams.get("limit") || "50";

    console.log("vdo_ids", vdo_ids, searchParams);


    const { vdo_id } = await req.json();
    console.log("vdo_sgdds", vdo_id);

    const response = await apiService.post(
      `${BASE_VDOCIPHER_URL}/${vdo_id}/otp`,
      {
        ttl: 300, // <-- request body (valid JSON)
      },
      {
        headers: {
          Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    // console.log("response", {response});


    const data = response.data ?? {};
    const meta = {
      total: data.length,
      fetched_at: new Date().toISOString(),
    };

    return NextResponse.json(
      { data, meta, status: response.status },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    console.error("❌ VdoCipher fetch error:", err?.message);
    const status = err?.response?.status ?? 500;
    const message =
      err?.response?.data?.error?.message ?? "Failed to fetch VdoCipher videos";

    return NextResponse.json({ error: message, status }, { status });
  }
}
