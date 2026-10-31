import { NextResponse } from "next/server";

export async function GET() {
  try {
    const params = new URLSearchParams({
      refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
      client_id: process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      grant_type: "refresh_token",
    });

    // ✅ correct Zoho token endpoint:
    const res = await fetch(`https://accounts.zoho.in/oauth/v2/token?${params}`, {
      method: "POST",
    });

    const text = await res.text(); // get raw body
    console.log("Zoho Token Response Text:",res, text);
    try {
      const data = JSON.parse(text);
      console.log("Zoho Token Response Data:", data);
      return NextResponse.json(data);
    } catch {
      console.error("Zoho Token Error Response:", text);
      return NextResponse.json({ error: "Invalid JSON", html: text }, { status: 500 });
    }
  } catch (error) {
    console.error("Token route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
