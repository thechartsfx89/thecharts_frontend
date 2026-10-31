
import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";
import { getToken } from "next-auth/jwt";



export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Auth
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.user?.id || !token?.jwt) {
      return NextResponse.json(
        { error: "Unauthorized access. Please login." },
        { status: 401 }
      );
    }

    // 2️⃣ Body
    const body = await req.json();
    const { course } = body;

    if (!course) {
      return NextResponse.json(
        { error: "Course is required" },
        { status: 400 }
      );
    }

    const userId = token.user.id;

   
    // const checkUrl =
    //   `${API_ENDPOINTS.purchasedCourses}` +
    //   `?filters[user][id][$eq]=${userId}` +
    //   `&filters[course][documentId][$eq]=${course}`;


    // const existing = await apiService.get(checkUrl, {
    //   headers: {
    //     Authorization: `Bearer ${token.jwt}`,
    //   },
    // });
    // console.log({ existing })
    // if (existing?.data?.data?.length > 0) {
    //   return NextResponse.json(
    //     { message: "proceed to payment" },
    //     { status: 200 } // Conflict
    //   );
    // }

    // 4️⃣ Create enrollment
    const payload = {
      data: {
        course,
        user: userId,
        purchased_date: new Date().toISOString(),
      },
    };

    const response = await apiService.post(
      API_ENDPOINTS.purchasedCourses,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token.jwt}`,
        },
      }
    );

    return NextResponse.json(
      {
        message: "Proceed Payment",
        data: response.data?.data,
      },
      { status: 201 }
    );

  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const message =
      err?.response?.data?.error?.message ??
      "Failed to enroll course";
    console.log({ err })
    return NextResponse.json({ error: message }, { status });
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

    
   const url =
  `${API_ENDPOINTS.purchasedCourses}` +
  `?filters[user][id][$eq]=${userId}` +
  `&filters[payment][payment_status][$eq]=SUCCESS` +
  `&populate[course][populate]=course_thumbnail` +
  `&populate=payment`;

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



