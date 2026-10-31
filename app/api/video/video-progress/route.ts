import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";
import { getToken } from "next-auth/jwt";

// ... other imports

// 1. Force the route to be dynamic (Prevents build-time caching)
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  try {
    const token: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  //  console.log("🔐 User ID from token:", token);
    const userId = token.user.id;
    const { videoId, resumedFrom, currentTime, totalPlayed, totalCovered, module_id, purchased_course, recorderd_lecture } = await req.json();
    console.log(">>>>", videoId)
    if (!videoId) {
      return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
    }

    // ✅ 1. Check if progress already exists for this user + video
    const check = await apiService.get(
      `${API_ENDPOINTS.videoProgress}?filters[user][id][$eq]=${userId}&filters[video_id][$eq]=${videoId}&populate=*`
    );
    console.log("🔍 Existing progress check:", check?.data, check?.data?.data[0]?.documentId);
    const existingId = check?.data?.data[0]?.documentId;
    console.log("🆔 Existing progress ID:", existingId);
    const module = module_id
    // ✅ 2. Build payload
    const payload = {
      data: {
        user:userId,
        video_id:videoId,
        current_time:currentTime,
        total_played:totalPlayed,
        total_covered:totalCovered,
        module_id,
        purchased_course,
        recorderd_lecture,
        module
      },
    };

    // ✅ 3. Update (PUT) if exists, otherwise create (POST)
    let response:any;
      if (existingId && currentTime >= check?.data?.data[0]?.current_time   ) {
      response = await apiService.put(
        `${API_ENDPOINTS.videoProgress}/${existingId}`,
        payload
      );
    } else if (!existingId) {
      response = await apiService.post(API_ENDPOINTS.videoProgress, payload);
    }else {
  return NextResponse.json(
    {
      success: true,
      message: "No update needed",
      skipped: true,
    },
    { status: 200 }
  );
}


    return NextResponse.json({ success: true, data: response.data }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error saving video progress:", err?.response?.data || err);
    const status = err?.response?.status ?? 500;
    const message =
      err?.response?.data?.error?.message ?? "Failed to save video progress";
    return NextResponse.json({ error: message }, { status });
  }
}


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
//     const moduleId = searchParams.get("moduleId");

//     if (!moduleId) {
//       return NextResponse.json(
//         { error: "Missing moduleId" },
//         { status: 400 }
//       );
//     }

//     // ---- Fetch progress from Strapi ----
//     const response: any = await apiService.get(
//       `${API_ENDPOINTS.videoProgress}?filters[user][id][$eq]=${userId}&filters[module_id][$eq]=${moduleId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token.jwt}`,
//         },
//       }
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


// 2. Ensure the fetch doesn't cache the Strapi response
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.user.id;
    const searchParams = req.nextUrl.searchParams;
    const moduleId = searchParams.get("moduleId");

    if (!moduleId) {
      return NextResponse.json({ error: "Missing moduleId" }, { status: 400 });
    }

    // 3. Updated Strapi Fetch with cache: 'no-store'
    const response: any = await apiService.get(
      `${API_ENDPOINTS.videoProgress}?filters[user][id][$eq]=${userId}&filters[module_id][$eq]=${moduleId}`,
      {
        headers: {
          Authorization: `Bearer ${token.jwt}`,
        },
        // If your apiService supports fetch options, pass cache: 'no-store' here
      }
    );

    const data = response?.data?.data ?? [];

    return NextResponse.json(
      { success: true, data },
      { 
        status: 200,
        // 4. Set Headers to tell the browser not to cache
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );
  } catch (err: any) {
    // ... error handling
  }
}