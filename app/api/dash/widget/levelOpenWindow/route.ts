import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function GET(req: NextRequest) {
  try {
    // Read JWT token from cookies (NextAuth)
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If user is not logged in
    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.user.id;

    // Fetch user from Strapi using your axios instance
    const response = await apiService.get(
      `${API_ENDPOINTS.levelOpenWindow}?filters[user][id]=${userId}&populate=bonusRule`,
      {
        headers: {
            Authorization: `Bearer ${token.jwt}`,
        }
      }

    );

    return NextResponse.json({ user: response.data }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Level Open Window API Error:", error);

    return NextResponse.json(
      { error: "Something went wrong fetching Level Open Window" },
      { status: 500 }
    );
  }
}


