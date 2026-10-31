// import { NextRequest, NextResponse } from "next/server";
// import apiService from "@/lib/axios";
// import { API_ENDPOINTS } from "@/api-constant";
// import { getToken } from "next-auth/jwt";

// export async function GET(req: NextRequest) {
//   try {
//     const token: any = await getToken({
//       req,
//       secret: process.env.NEXTAUTH_SECRET,
//     });

//     if (!token?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const userId = token.user.id;

//     // ---- Read videoId from query ----
//     const searchParams = req.nextUrl.searchParams;
//     // const moduleId = searchParams.get("moduleId");

//     // if (!moduleId) {
//     //   return NextResponse.json(
//     //     { error: "Missing moduleId" },
//     //     { status: 400 }
//     //   );
//     // }

//     // ---- Fetch progress from Strapi ----
//     const response: any = await apiService.get(
//       `${API_ENDPOINTS.videoProgress}?filters[user][id][$eq]=${userId}&populate=module`
//     );

//     const data = response?.data?.data ?? null;

//     return NextResponse.json(
//       { success: true, data },
//       { status: 200 }
//     );
//   } catch (err: any) {
//     console.error("❌ Error fetching video progress:", err?.response?.data || err);

//     const status = err?.response?.status ?? 500;
//     const message =
//       err?.response?.data?.error?.message ?? "Failed to fetch progress";

//     return NextResponse.json({ error: message }, { status });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = token.user.id;
    
    // Fetch all video progress records for this user that relate to this course's modules
    const response = await apiService.get(
      `${API_ENDPOINTS.videoProgress}?` +
      `filters[user][id][$eq]=${userId}` +
      `&populate=module` +
      `&pagination[limit]=100`
    );

    return NextResponse.json(
      { success: true, data: response?.data?.data ?? [] },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}
