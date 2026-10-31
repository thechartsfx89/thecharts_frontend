// app/api/blogs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import apiService from '@/lib/axios';
import { API_ENDPOINTS } from '@/api-constant';
import { getToken } from 'next-auth/jwt';

// Optional: define your endpoint key as API_ENDPOINTS.blogs
// e.g. API_ENDPOINTS.blogs = '/blogs'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
  // const token:any = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET }));

  // if (!token?.user?.id) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }



    const response = await apiService.get(`${API_ENDPOINTS.courses}?populate=course_thumbnail&populate=course_category`, {
    //   params,
      // headers: cookie ? { cookie } : undefined,
    });
    const { data, meta } = response.data ?? {};

    return NextResponse.json(
      { data, meta },
      {
        status: response.status,
        headers: {
          'Cache-Control': 'no-store',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err: any) {
    const status  = err?.response?.status ?? 500;
    const message = err?.response?.data?.error?.message ?? 'Failed to fetch course';
    return NextResponse.json({ error: message, status }, { status });
  }
}
