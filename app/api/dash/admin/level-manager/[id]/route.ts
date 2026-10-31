import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

// ✅ The second argument 'context' contains the params
export async function GET(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const token: any = await getToken({ req });

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Access the userId from the URL segment
    const { id } = params; 

    if (!id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Now use the dynamic userId instead of the hardcoded '1198'
    const response = await apiService.get(`${API_ENDPOINTS.userLevelCommission}/${id}`, {
      headers: {
        Authorization: `Bearer ${token.jwt}`,
      },
    });

    return NextResponse.json(
      { data: response.data, status: response.status },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("Level Commission Route Error:", err.message);
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: err?.response?.data || err.message,
      },
      { status: 500 }
    );
  }
}