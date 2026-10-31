import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";
import { getToken } from "next-auth/jwt";


export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Authentication — Get user from JWT
      const { searchParams } = new URL(req.url);
    let id:any = searchParams.get("id");
    
    const token:any = await getToken({ req });
    console.log({token})
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = token?.user?.id as any; // your NextAuth stores ID here

    // 2️⃣ Fetch student library for ONLY this user
   
    const url =
      `${API_ENDPOINTS.studentLibraries}` +
      `?filters[user][id][$eq]=${id ?? userId}&populate=documents_file&sort=createdAt:desc`;

    const res = await apiService.get(url);
    // console.log('API Response:', res);
   
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    console.error("GET STUDENT LIBRARY ERROR:", error?.response?.data || error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}




export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); 
    const { user, documents_file } = body.data;

    if (!user || !documents_file) {
      return NextResponse.json(
        { error: "Missing user or documents_file" },
        { status: 400 }
      );
    }

    // Ensure array of IDs
    const formattedFileIds = Array.isArray(documents_file)
      ? documents_file
      : [documents_file];

    console.log("Final File IDs Sent to Strapi:", formattedFileIds);

    const createRes = await apiService.post(API_ENDPOINTS.studentLibraries, {
      data: {
        user: Number(user),
        documents_file: formattedFileIds, // MUST be [122]
      },
    });

    return NextResponse.json(createRes.data, { status: 200 });
  } catch (error: any) {
    console.error("STUDENT LIBRARY CREATE ERROR:", error?.response?.data || error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}




// -----------------------------------------------------------
// DELETE
// -----------------------------------------------------------
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

  await apiService.delete(`${API_ENDPOINTS.studentLibraries}/${id}`);
  return NextResponse.json({ deleted: true });
}
