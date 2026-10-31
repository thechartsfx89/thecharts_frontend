import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { API_ENDPOINTS } from "@/api-constant";
import apiService from "@/lib/axios";
// import apiService from "@/utils/apiService"; // Adjust path to your apiService
// import { API_ENDPOINTS } from "@/utils/apiEndpoints";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.user.id;
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    /**
     * UPDATED FILTERS:
     * We use documentId for the course to match your frontend 'documentId' variable.
     * We use SUCCESS for the payment check.
     */
    const url = 
      `${API_ENDPOINTS.purchasedCourses}?` +
      `filters[user][id][$eq]=${userId}&` +
      `filters[course][documentId][$eq]=${courseId}&` + 
       `populate[payment][fields][0]=payment_status`;
      // `fields[0]=id`; // Minimal fields for speed

    const response = await apiService.get(url, {
      headers: {
        Authorization: `Bearer ${token.jwt}`,
      },
    });

    // Check if any data exists in the array
    const purchaseData = response.data?.data ?? [];
    const isPurchased = purchaseData[0]?.payment && purchaseData.length > 0;

    // console.log(`Purchase check for User ${userId}, Course ${courseId}:`, isPurchased, purchaseData);

    return NextResponse.json(
      { 
        success: true, 
        isPurchased, // This must be returned to the frontend
        count: purchaseData.length,
        payment: purchaseData[0].payment ? purchaseData[0].payment : null
      },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("❌ Error checking purchase status:", err?.response?.data || err.message);
    return NextResponse.json(
      { error: "Failed to verify purchase status", details: err?.message },
      { status: 500 }
    );
  }
}