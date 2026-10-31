import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({ req });
    if (!token?.jwt) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Fetch Messages
    const messageRes = await apiService.get("/messages", {
      headers: { Authorization: `Bearer ${token.jwt}` },
      params: {
        sort: "createdAt:desc",
        "pagination[limit]": 100, // Fetch a larger set so we have enough to find distinct users
        "filters[receiver][$eq]": token.sub,
        "filters[is_community][$eq]": false 
      }
    });

    const messages = messageRes.data?.data || [];
    if (messages.length === 0) return NextResponse.json({ data: [] });

    // 2. Extract Unique Sender IDs first
    const uniqueSenderIds = Array.from(new Set(
      messages.map((m: any) => m?.sender)?.filter((id: any) => id && !isNaN(Number(id)))
    ));
//    console.log({uniqueSenderIds})
    // 3. Fetch User Details (Strapi 5 usually returns { data: [...] } for /api/users)
    const usersRes = await apiService.get("/users", {
      params: {
        "filters[id][$in]": uniqueSenderIds,
        "populate[profile_image]": true,
        "pagination[pageSize]": 100,
      }
    });
  
    // Based on your previous logs, check if it's usersRes.data or usersRes.data.data
    const users = Array.isArray(usersRes.data.data) ? usersRes.data.data : []; 
    // console.log({users})
    // 4. Create the User Map
    const userMap = users.reduce((acc: any, user: any) => {
      acc[user.id] = {
        id: user.id,
        fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        profileImage: user.profile_image?.url || null,
        is_online: user.is_online,
        last_seen: user.last_seen
      };
      return acc;
    }, {});

    // 5. Reduce to DISTINCT messages (Most recent per sender)
    const latestMessagesMap = messages.reduce((acc: any, msg: any) => {
      // Since messages are sorted desc, the first time we see a sender is their latest message
      if (!acc[msg.sender]) {
        acc[msg.sender] = {
          ...msg,
          senderDetails: userMap[msg.sender] || { 
            id: Number(msg.sender), 
            fullName: `User ${msg.sender}`, 
            profileImage: null,
            firstName: "",
            lastName: "" 
          }
        };
      }
      return acc;
    }, {});

    const distinctMessages = Object.values(latestMessagesMap).sort((a: any, b: any) => {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
});

    return NextResponse.json({ data: distinctMessages });

  } catch (err: any) {
    console.error("❌ API Route Error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}