import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 🔥 FIX HERE
    const { name, email, phone, course_type, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = {
      data: {
        name,
        email,
        phone,
        course_type, // 🔥 FIX
        message,
      },
    };

    const response = await apiService.post(
      API_ENDPOINTS.enquiry,
      payload
    );

    return NextResponse.json(
      {
        message: "Enquiry submitted successfully",
        data: response.data,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("CONTACT ERROR:", error?.response?.data || error);

    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
