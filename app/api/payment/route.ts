import { API_ENDPOINTS } from "@/api-constant";
import apiService from "@/lib/axios";
import { paymentSchema } from "@/utils/formValidation";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const token: any = await getToken({
//       req,
//       secret: process.env.NEXTAUTH_SECRET,
//     });

//     if (!token?.jwt) {
//       return NextResponse.json(
//         { message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // 1️⃣ Validate request
//     const validatedData = await paymentSchema.validate(body, {
//       abortEarly: false,
//       stripUnknown: true,
//     });

//     // 2️⃣ Business rule check
//     if (
//       validatedData.payment_mode !== "CASH" &&
//       !validatedData.transaction_id
//     ) {
//       return NextResponse.json(
//         { message: "Transaction ID is required for non-cash payments" },
//         { status: 400 }
//       );
//     }
//     console.log({validatedData})
//     // 3️⃣ CREATE PAYMENT (POST, not GET)
//     const response = await apiService.post(
//       API_ENDPOINTS.payment,
//       {
//         data: {...validatedData, user: token?.user?.id},
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token.jwt}`,
//         },
//       }
//     );

//     // 4️⃣ Success response
//     // console.log({response})
//     return NextResponse.json(
//       {
//         message: "Payment created successfully",
//         data: response.data?.data,
//       },
//       { status: 201 }
//     );

//   } catch (error: any) {
//     if (error.name === "ValidationError") {
//       return NextResponse.json(
//         {
//           message: "Validation failed",
//           errors: error.errors,
//         },
//         { status: 422 }
//       );
//     }

//     console.error("Payment API Error:", error);

//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const token: any = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.jwt || !token?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 1️⃣ Validate request
    const validatedData = await paymentSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // 2️⃣ Business rule
    if (
      validatedData.payment_mode !== "CASH" &&
      !validatedData.transaction_id
    ) {
      return NextResponse.json(
        { message: "Transaction ID is required for non-cash payments" },
        { status: 400 }
      );
    }

    const userId = token.user.id;
    // const purchasedCourseId = validatedData.purchased_course;

    // 3️⃣ CHECK EXISTING PAYMENT (same user + purchased_course)
    // const checkUrl =
    //   `${API_ENDPOINTS.payment}` +
    //   `?filters[user][id][$eq]=${userId}` +
    //   `&filters[purchased_course][documentId][$eq]=${purchasedCourseId}`;

    // const existingRes = await apiService.get(checkUrl, {
    //   headers: {
    //     Authorization: `Bearer ${token.jwt}`,
    //   },
    // });

    // const existingPayment = existingRes.data?.data?.[0];

    let response:any;

    // 4️⃣ UPDATE if exists
    // if (existingPayment) {
    //   response = await apiService.put(
    //     `${API_ENDPOINTS.payment}/${existingPayment.documentId}`,
    //     {
    //       data: {
    //         ...validatedData,
    //         user: userId,
    //       },
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token.jwt}`,
    //       },
    //     }
    //   );

    //   return NextResponse.json(
    //     {
    //       message: "Payment updated successfully",
    //       data: response.data?.data,
    //     },
    //     { status: 200 }
    //   );
    // }

    // 5️⃣ CREATE if not exists
    const currentTimestamp = new Date().toISOString();
    response = await apiService.post(
      API_ENDPOINTS.payment,
      {
        data: {
          ...validatedData,
          user: userId,
          payment_date: currentTimestamp
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token.jwt}`,
        },
      }
    );

    return NextResponse.json(
      {
        message: "Payment created successfully",
        data: response.data?.data,
      },
      { status: 201 }
    );

  } catch (error: any) {
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.errors,
        },
        { status: 422 }
      );
    }

    console.error("Payment API Error:", error?.response?.data || error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}



export async function GET(req: NextRequest) {
    try {
        // 1️⃣ Auth
        const token: any = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token?.user?.id || !token?.jwt) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        // 2️⃣ Query params
        const { searchParams } = new URL(req.url);
        const course = searchParams.get("course");

        if (!course) {
            return NextResponse.json(
                { error: "Course is required" },
                { status: 400 }
            );
        }

        const userId = token.user.id;

        // 3️⃣ Duplicate check (Strapi-safe)
        const checkUrl =
            `${API_ENDPOINTS.purchasedCourses}` +
            `?filters[user][id][$eq]=${userId}` +
            `&filters[course][documentId][$eq]=${course}` +
            `&pagination[limit]=1`;

        const response = await apiService.get(checkUrl, {
            headers: {
                Authorization: `Bearer ${token.jwt}`,
            },
        });

        // const exists = response?.data?.data?.length > 0;

        // 4️⃣ Response
        return NextResponse.json(
            {
                data: response?.data?.data,
            },
            { status: 200 }
        );

    } catch (err: any) {
        const status = err?.response?.status ?? 500;
        const message =
            err?.response?.data?.error?.message ??
            "Failed to check enrollment";

        return NextResponse.json({ error: message }, { status });
    }
}

