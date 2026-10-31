import { API_ENDPOINTS } from "@/api-constant";
import apiService from "@/lib/axios";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, itemsId } = body;
    console.log(body, ">>>>>> checkout body");

    if (!userId || !itemsId?.length) {
      return NextResponse.json({ message: "Missing userId or itemsId" }, { status: 400 });
    }

    const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

    // ✅ Correct Axios syntax
    const updateRes = await apiService.put(
      `/users/${userId}`, // Example endpoint → make sure this matches your Strapi route
      {
        recorderd_lectures: itemsId, // your custom field
      },
      
    //   {
    //     headers: {
    //       Authorization: `Bearer ${STRAPI_TOKEN}`,
    //     },
    //   }
    );

    const updatedUser = updateRes.data;

    return NextResponse.json({
      message: "✅ Payment successful and user updated",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("❌ Checkout API Error:", error?.response?.data || error);
    return NextResponse.json(
      { message: "Server error", error: error?.response?.data || error.message },
      { status: 500 }
    );
  }
}
