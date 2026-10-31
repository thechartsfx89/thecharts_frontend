import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({ req });
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const isAdmin = token?.user?.role === "admin";

    // ✅ If Admin + no ID: /commissions/wallet/summary
    // ✅ If User: /commissions/wallet/summary/123
    const endpoint = isAdmin
      ? API_ENDPOINTS.globalWalletSummary
      : `${API_ENDPOINTS.myWalletSummary}/${token.sub}`;
  //  console.log(">>", endpoint)
    const response = await apiService.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token.jwt}`, // Ensure this is sent!
      },
    });

    return NextResponse.json({ data: response.data.data }, { status: 200 });
  } catch (err: any) {
    // This will help you see if it's still a 404 or a 500 (Knex error)
    console.error("Strapi Error:", err.response?.status, err.response?.data);
    
    return NextResponse.json(
      { message: "Backend Error", error: err.response?.data || err.message },
      { status: err.response?.status || 500 }
    );
  }
}