import { NextResponse } from "next/server";

// Replace these with your values
const ORG_NAME = "Zoho"; // X-ZSOURCE
const ZSOID = "60053833816";     // Zoho Organization ID

export async function POST() {
  try {
    // 1️⃣ Get Zoho access token
    const tokenRes = await fetch("http://localhost:3000/api/zoho/token");
    if (!tokenRes.ok) throw new Error("Failed to fetch Zoho token");
    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;
    const orgName = "Zoho"; // replace with your org name
    // const userRes = await fetch("https://meeting.zoho.com/api/v2/user.json", {
    //   headers: {
    //     Authorization: `Zoho-oauthtoken ${token}`,
    //     "X-ZSOURCE": orgName,
    //   },
    // });

    // if (!userRes.ok) {
    //   const text = await userRes.text();
    //   throw new Error("Failed to get ZSOID: " + text);
    // }
    // const userData = await userRes.json();
    // console.log("Zoho User Data:", userData);
    // const zsoid = userData.users?.[0]?.zsoid;
    // if (!zsoid) throw new Error("ZSOID not found in user data");
    // console.log("Zoho User Response:", userRes.json());
    // 2️⃣ Prepare meeting payload
    const payload = {
      session: {
        topic: "Next.js Zoho Meeting Demo",
        agenda: "Testing Zoho Meeting integration",
        presenter: 60053833816,          // Replace with your Zoho user ID
        startTime: "Oct 22, 2025 07:00 PM", // IST format YYYY-MM-DD HH:MM
        duration: 3600000,
        timezone: "Asia/Calcutta",
        participants: [
            {
                "email": "dummy@email.com"
            }
        ]                    // in minutes
      }
    };

    // 3️⃣ Make POST request to Zoho Meeting API
    const res = await fetch(`https://meeting.zoho.in/api/v2/60053833816/sessions.json`, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "X-ZSOURCE": ORG_NAME,
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(payload),
    });

    // 4️⃣ Handle non-JSON response
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Zoho returned non-JSON response:", text);
      return NextResponse.json({ error: "Zoho returned non-JSON response", details: text }, { status: 500 });
    }

    return NextResponse.json({ success: true, meeting: data });
  } catch (err) {
    console.error("Meeting create error:", err);
    return NextResponse.json({ error: "Internal server error", details: err }, { status: 500 });
  }
}
