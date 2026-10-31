// File: src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Fetch all files
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Optional Strapi relational metadata
    const ref = formData.get("ref");
    const refId = formData.get("refId");
    const field = formData.get("field");

    const uploadFormData = new FormData();
    files.forEach((file) => uploadFormData.append("files", file));
    if (ref) uploadFormData.append("ref", ref);
    if (refId) uploadFormData.append("refId", refId);
    if (field) uploadFormData.append("field", field);

    const res = await apiService.post(API_ENDPOINTS.upload, uploadFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    console.error("❌ Upload failed:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Upload failed" },
      { status: error.response?.status || 500 }
    );
  }
}
