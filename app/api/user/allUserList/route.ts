// import { NextRequest, NextResponse } from "next/server";
// import apiService from "@/lib/axios";
// import { API_ENDPOINTS } from "@/api-constant";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");
//     const page = searchParams.get("page") || "1";
//     const pageSize = searchParams.get("pageSize") || "10";
//     const sort = searchParams.get("sort") || "createdAt:desc";

//     // 1. Initialize base parameters
//     const queryParams: any = {
//       "pagination[page]": page,
//       "pagination[pageSize]": pageSize,
//       sort
//     };

//     let url: string;

//     if (id) {
//       url = `${API_ENDPOINTS.filterUser}/${id}?populate=*`;
//     } else {
//       const query = "populate=profile_image&populate=role";
//       url = `${API_ENDPOINTS.filterUser}?${query}`;
//     }

//     const response = await apiService.get(url);

//     if (id && !response.data) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     /* ================== NEW CODE START ================== */
//     let data = response.data;

//     // If NOT fetching single user → return ONLY students
//     if (!id && Array.isArray(data)) {
//       data = data.filter(
//         (user: any) => user.role?.name?.toLowerCase() === "student"
//       );
//     }
//     /* ================== NEW CODE END ================== */

//     return NextResponse.json(
//       { data },
//       { status: response.status || 200 }
//     );
//   } catch (err: any) {
//     const status = err.response?.status || 500;
//     const message =
//       err.response?.data?.error?.message ||
//       "Something went wrong while fetching mentor data!";

//     console.error("❌ Error fetching mentor data:", message);

//     return NextResponse.json({ error: message }, { status });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";
    const sort = searchParams.get("sort") || "createdAt:desc";
    const search = searchParams.get("search");
    console.log({id})
    // Handle Single User Request
    if (id) {
      const url = `${API_ENDPOINTS.filterUser}/${id}?populate=*`;
      const response = await apiService.get(url);
      return NextResponse.json(response.data);
    }

    // --- MANUALLY CONSTRUCT QUERY STRING (Without qs) ---
    // 1. Basic Pagination and Sort
    let query = `pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

    // 2. Add Populates
    query += `&populate[0]=profile_image&populate[1]=role`;

    // 3. Add Role Filter (Filtering for 'student' at DB level)
    // Using $iEq for case-insensitive match in Strapi 5
    // query += `&filters[role][name][$iEq]=student`;

    // 4. Add Search Filter (if search param exists)
    if (search) {
      // Searches either username OR referral code
      query += `&filters[$or][0][username][$containsi]=${encodeURIComponent(search)}`;
      query += `&filters[$or][1][ownReferralCode][$containsi]=${encodeURIComponent(search)}`;
      query += `&filters[$or][2][fullName][$containsi]=${encodeURIComponent(search)}`;
    }

    const url = `${API_ENDPOINTS.filterUser}?${query}`;
    const response = await apiService.get(url);
    let data = response.data;
    if (!id && Array.isArray(data)) {
      data = data.filter(
        (user: any) => user.role?.name?.toLowerCase() === "student"
      );
    }
    // This returns the { data, meta } object from our Strapi override
    return NextResponse.json(
      {data},
      { status: response.status || 200 }
    );

  } catch (err: any) {
    console.error("❌ Error fetching user data:", err.message);
    return NextResponse.json(
      { error: err.response?.data?.error?.message || "Internal Server Error" },
      { status: err.response?.status || 500 }
    );
  }
}