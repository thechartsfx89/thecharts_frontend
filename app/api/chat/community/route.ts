// import { NextRequest, NextResponse } from "next/server";
// import apiService from "@/lib/axios";

// export async function GET(req: NextRequest) {
//   try {
   
//     // Fetch from Strapi backend
//  const res = await apiService.get(
//   `/messages?filters[is_community][$eq]=true&populate=*&sort[0]=createdAt:asc&pagination[pageSize]=1000`
// );



//     return NextResponse.json({ data: res.data.data });
//   } catch (err) {
//     console.error("❌ Error fetching messages:", err);
//     return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";

// Force Next.js to fetch fresh data every time
export const dynamic = "force-dynamic"; 

export async function GET(req: NextRequest) {
  try {
    const res = await apiService.get(
      `/messages?filters[is_community][$eq]=true&populate=*&sort[0]=createdAt:asc&pagination[pageSize]=1000`
    );

    return NextResponse.json({ data: res.data.data });
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}