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
      `${API_ENDPOINTS.profile}/${userId}?populate=*`,

    );

    return NextResponse.json({ user: response.data }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Profile API Error:", error);

    return NextResponse.json(
      { error: "Something went wrong fetching profile" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    // Validate user
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log({ token })
    const userId = token.user.id;

    // Receive file from FE
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1️⃣ Upload file to Strapi
    const uploadForm = new FormData();
    uploadForm.append("files", file);
    uploadForm.append("ref", "api::users-permissions.user");
    // formData.append("refId", userId.toString()); // must be a stringified integer
    uploadForm.append("field", "profile_image");

    const uploaded = await apiService.post("/upload", uploadForm, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const fileData = uploaded.data[0]; // important
    // console.log({ uploaded, fileData })

    // 2️⃣ Update profile image field in Strapi user
    const updateRes = await apiService.put(`${API_ENDPOINTS.profile}/${userId}`, {
      profile_image: fileData?.id,
    });
    console.log({ updateRes })
    return NextResponse.json(
      { message: "Profile image updated", status:updateRes.status,  },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PROFILE IMAGE UPDATE ERROR:", error?.response?.data || error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
