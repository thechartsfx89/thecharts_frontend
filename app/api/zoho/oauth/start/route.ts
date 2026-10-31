import { NextResponse } from "next/server";

export async function GET() {
  const authUrl = new URL("https://accounts.zoho.com/oauth/v2/auth");

  authUrl.searchParams.set("scope", process.env.ZOHO_SCOPES!);
  authUrl.searchParams.set("client_id", process.env.ZOHO_CLIENT_ID!);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", process.env.ZOHO_REDIRECT_URI!);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", "nextjsdemo");

  return NextResponse.redirect(authUrl.toString());
}
