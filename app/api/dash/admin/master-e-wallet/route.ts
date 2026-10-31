import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";


export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({ req });
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId")?.trim();
    const isAdmin = token?.user?.role === "admin";
    const normalizedUserId = userId?.toUpperCase();

    let endpoint = "";
    
    // 1. Determine Endpoint
    if (isAdmin) {
      endpoint = normalizedUserId
  ? `${API_ENDPOINTS.myWalletSummary}/${normalizedUserId}`
  : API_ENDPOINTS.globalWalletSummary;
    } else {
      endpoint = `${API_ENDPOINTS.myWalletSummary}/${token.sub}`;
    }

    // 2. Conditional Header Logic
    // If we have a searchUserId, we omit the header. 
    // Otherwise, we include it.
    const config = (isAdmin && userId) 
      ? {} // No headers if admin is searching for a specific user
      : { 
          headers: { 
            Authorization: `Bearer ${token.jwt}` 
          } 
        };

    const response = await apiService.get(endpoint, config);

    return NextResponse.json({ data: response.data.data }, { status: 200 });
  } catch (err: any) {
    console.error("Strapi Error:",err, err.response?.status, err.response?.data);
    return NextResponse.json(
      { message: "Backend Error", error: err.response?.data || err.message },
      { status: err.response?.status || 500 }
    );
  }
}