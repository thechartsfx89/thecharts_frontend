// // app/api/blogs/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import apiService from '@/lib/axios';
// import { API_ENDPOINTS } from '@/api-constant';
// import { getToken } from 'next-auth/jwt';

// // Optional: define your endpoint key as API_ENDPOINTS.blogs
// // e.g. API_ENDPOINTS.blogs = '/blogs'

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const token: any = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET }));

//     if (!token?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = token.user.id;
//     console.log("Authenticated userId:", userId);
//     const documentId = searchParams.get('id');
//     if (!documentId) {
//       return NextResponse.json({ error: 'Missing documentId parameter' }, { status: 400 });
//     }

//     const cookie = req.headers.get('cookie') ?? '';

//     const response = await apiService.get(
//       `/course-modules/${documentId}?&populate=course_resources_download&populate=teacher.teacher_image&populate=quiz&populate=recorderd_lecture&populate=video_progresses&populate=quiz_score`);

//     const { data, meta } = response.data ?? {};

//     return NextResponse.json(
//       { data, meta },
//       {
//         status: response.status,
//         headers: {
//           'Cache-Control': 'no-store',
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//   } catch (err: any) {
//     const status = err?.response?.status ?? 500;
//     const message = err?.response?.data?.error?.message ?? 'Failed to fetch course';
//     return NextResponse.json({ error: message, status }, { status });
//   }
// }

// app/api/blogs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import apiService from '@/lib/axios';
import { API_ENDPOINTS } from '@/api-constant';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token: any = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET }));
    if (!token?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = token.user.id;
    console.log("Authenticated userId:", userId);

    const documentId = searchParams.get('id');
    if (!documentId) {
      return NextResponse.json({ error: 'Missing documentId parameter' }, { status: 400 });
    }

    const response = await apiService.get(
      `/course-modules/${documentId}`,
      {
        params: {
          'populate[course_resources_download]': true,
          'populate[teacher][populate]': 'teacher_image',
          'populate[quiz]': true,
          'populate[recorderd_lecture]': true,

          // Filter video_progresses by userId
          'populate[video_progresses][filters][user][id][$eq]': userId,

          // Filter quiz_score by userId
          'populate[quiz_score][filters][user][id][$eq]': userId,
        }
      }
    );

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
    const status = err?.response?.status ?? 500;
    const message = err?.response?.data?.error?.message ?? 'Failed to fetch course';
    return NextResponse.json({ error: message, status }, { status });
  }
}