// /app/api/auth/refresh/route.ts
import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

export async function POST(req: NextRequest) {
  try {
    // Get refresh token from cookies
    const refreshToken = getCookie("refreshToken", { req }) as string;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 }
      );
    }

    // Call backend API to refresh token
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {}, // body may be empty depending on backend
      {
        headers: { Cookie: `refreshToken=${refreshToken}` },
        withCredentials: true,
      }
    );

    const newAccessToken = response.data.accessToken;

    // Set the new access token as httpOnly cookie
    const res = NextResponse.json({ accessToken: newAccessToken });
    setCookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (err: any) {
    console.error("Refresh token error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 401 }
    );
  }
}

// Optional: block GET
export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
