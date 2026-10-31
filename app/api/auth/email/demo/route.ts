import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, text, html, email } = await req.json();

    // Send email via Strapi email endpoint
    const response = await apiService.post(
      API_ENDPOINTS.bookDemoEmail, // e.g., '/api/email'
      // { to, subject, text, html, from:"anilchauhan.src@gmail.com" },
      {email },
      {
        headers: {
          "Content-Type": "application/json",
          // Optional: include token if your Strapi route requires auth
          // Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );

    // Return response in standard format
    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully",
        data: response.data,
      },
      { status: response.status || 200 }
    );
  } catch (err: any) {
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.error?.message ||
      err.message ||
      "Failed to send email";

    return NextResponse.json({ success: false, error: message }, { status });
  }
}
