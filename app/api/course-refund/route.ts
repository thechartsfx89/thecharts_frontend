// app/api/refund/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function POST(req: NextRequest) {
  try {
    const token: any = await getToken({ req });
    console.log({ token })
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Read request body
    const body = await req.json();
    const { refund_reason, description, course, payment } = body;

    if (!refund_reason || !course) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔥 Payload for Strapi
    const payload = {
      data: {
        refund_reason,
        description,
        refund_status: "pending",
        requested_at: new Date(),
        course,
        payment: payment ?? null,
        user: token.sub,
      }

    };

    // 🔥 API call to Strapi
    const response = await apiService.post(
      API_ENDPOINTS.refund, // <-- use correct endpoint
      payload,
      {
        headers: {
          Authorization: `Bearer ${token.jwt}`,
        },
      }
    );

    return NextResponse.json(
      {
        message: "Refund request submitted",
        data: response.data,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Refund API Error:", error?.response?.data || error);

    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}



export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized access. Please login." },
        { status: 401 }
      );
    }

    const userId = token.user.id;
    console.log("Authenticated userId:", userId);
    // const url = `${API_ENDPOINTS.purchasedCourses}?filters[user][id][$eq]=${userId}&populate[course][populate]=course_thumbnail&populate=payment`;
    // const url = `${API_ENDPOINTS.purchasedCourses}?filters[user][id][$eq]=${userId}&populate[course][populate]=course_thumbnail&populate[course][populate]=course_resources_download&populate[course][populate]=quiz&populate[course][populate][teacher][populate]=teacher_image`;
    const url =
      `${API_ENDPOINTS.purchasedCourses}` +
      `?filters[user][id][$eq]=${userId}` +
      `&filters[payment][payment_status][$eq]=SUCCESS` +
      `&populate[course][populate]=course_thumbnail` +
      `&populate=payment` +
      `&populate[refunds][filters][refund_status][$ne]=null` + // Only include purchased courses that have a refund request
      `&populate[refunds][filters][user][id][$eq]=${userId}`; // Only include refund requests made by the authenticated user

    const response = await apiService.get(url, {
      headers: {
        Authorization: `Bearer ${token.jwt}`,
      },
    });

    const { data, meta } = response.data ?? {};

    return NextResponse.json(
      { data, meta },
      {
        status: response.status,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const message =
      err?.response?.data?.error?.message ??
      "Failed to fetch purchased courses";

    return NextResponse.json({ error: message }, { status });
  }
}
