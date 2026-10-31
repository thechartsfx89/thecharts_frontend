import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  const url = new URL(req.url);
  let code = url.searchParams.get("code");
    code = '1000.5e2af33352a9af4a49193bbfe9bfb79e.c05a3bea567d8f7aae80f383a961043b'

  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }

  try {
    const res = await axios.post("https://accounts.zoho.in/oauth/v2/token", null, {
      params: {
        code,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: "authorization_code",
      },
    });

    const data = res.data;
    console.log("Zoho Auth Success:", data);

    // Normally you'd store this securely (e.g. DB or env)
    return NextResponse.json({
      message: "OAuth success!",
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
  } catch (error: any) {
    console.error("OAuth callback error:", error.response?.data || error.message);
    return NextResponse.json({ error: "OAuth failed" }, { status: 500 });
  }
}
