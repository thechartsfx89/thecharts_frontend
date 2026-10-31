import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sender = searchParams.get("sender");
    const receiver = searchParams.get("receiver");

    if (!sender || !receiver) {
      return NextResponse.json(
        { error: "Missing sender or receiver" },
        { status: 400 }
      );
    }

    // Fetch from Strapi backend
  const res = await apiService.get(
  `/messages?filters[$or][0][sender][$eq]=${sender}&filters[$or][0][receiver][$eq]=${receiver}&filters[$or][1][sender][$eq]=${receiver}&filters[$or][1][receiver][$eq]=${sender}&populate=*&sort[0]=createdAt:asc&pagination[pageSize]=1000`
);


    return NextResponse.json({ data: res.data.data });
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

