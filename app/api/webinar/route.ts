import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({ req });

    if (!token?.jwt) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userRes = await apiService.get("/users/me", {
      headers: { Authorization: `Bearer ${token.jwt}` },
    });

    const userData = userRes.data;
    // console.log({userData})
    if (!userData?.confirm_affiliate_payment && !userData?.affiliateJoinedAt) {
      return NextResponse.json({ error: "User data not found" }, { status: 404 });
    }

    // 2. Calculate Expiry (Registration Date + 30 Days)
    const registrationDate = new Date(userData.affiliateJoinedAt);
    const expiryDate = new Date(registrationDate);
    expiryDate.setDate(registrationDate.getDate() + 40);

    const now = new Date();

    // 3. Logic: If current date is past the 30-day window, block access
    if (now > expiryDate) {
      return NextResponse.json({
        error: "Access Expired",
        isExpired: true,
        message: "Your 30-day webinar access period has ended.",
        expiredAt: expiryDate.toISOString()
      }, { status: 200 });
    }
    const userId = token?.user?.id || token?.sub;

    const quizRes = await apiService.get(`/quiz-scores`, {
      headers: { Authorization: `Bearer ${token.jwt}` },
      params: {
        "filters[user][id][$eq]": userId,
        "filters[score][$gte]": 60,
        "populate[quiz][populate][course_categories][fields][0]": "category_name",
      },
    });
    const quizScores = quizRes.data?.data || [];

    const categories = new Set<string>();

    quizScores.forEach((score: any) => {
      const courseCategories = score?.quiz?.course_categories;

      if (Array.isArray(courseCategories)) {
        courseCategories.forEach((cat: any) => {
          if (cat.category_name) {
            categories.add(cat.category_name);
          }
        });
      }
    });

    const categoryList = Array.from(categories);

    console.log("Extracted Categories:", categoryList);


    const webinarParams: any = {
      populate: "*",
    };

    if (categoryList.length > 0) {
      webinarParams["filters[$or][0][course_categories][category_name][$in]"] = categoryList;
      webinarParams["filters[$or][1][course_categories][category_name][$eq]"] = "OPEN_TO_ALL";
    } else {
      webinarParams["filters[course_categories][category_name][$eq]"] = "OPEN_TO_ALL";
    }

    const webinarRes = await apiService.get(`/webinars`, {
      headers: { Authorization: `Bearer ${token.jwt}` },
      params: webinarParams,
    });

    return NextResponse.json({
      data: webinarRes.data?.data || [],
    });

  } catch (error: any) {
    console.error("WEBINAR ERROR:", error.response?.data || error);
    return NextResponse.json({ error: "Failed to fetch webinars" }, { status: 500 });
  }
}