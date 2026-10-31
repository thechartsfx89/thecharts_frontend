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
//     console.log("documentId", documentId);
//     const cookie = req.headers.get('cookie') ?? '';

//     const response = await apiService.get(
//       `/recorderd-lectures/${documentId}?populate[course_modules][populate]=thumbnail&populate[course_modules][populate]=thumbnail&populate[course_modules][populate]=quiz&populate[course_modules][populate]=quiz_score`);

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


// import { NextRequest, NextResponse } from 'next/server';
// import apiService from '@/lib/axios';
// import { API_ENDPOINTS } from '@/api-constant';
// import { getToken } from 'next-auth/jwt';

// // 1. Force the route to be dynamic to prevent production build caching
// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const token: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//     if (!token?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = token.user.id;
//     const documentId = searchParams.get('id');

//     if (!documentId) {
//       return NextResponse.json({ error: 'Missing documentId parameter' }, { status: 400 });
//     }

//     // 2. Fetch with no-cache headers and filter quiz_score by the specific user
//     const response = await apiService.get(
//       `/recorderd-lectures/${documentId}?` + 
//       `populate[course_modules][populate][0]=thumbnail` +
//       `&populate[course_modules][populate][1]=quiz` +
//       `&populate[course_modules][populate][quiz_score][filters][user][id][$eq]=${userId}`,
//       {
//         headers: {
//             'Cache-Control': 'no-cache, no-store, must-revalidate',
//             'Pragma': 'no-cache',
//             'Expires': '0',
//         }
//       }
//     );

//     const { data, meta } = response.data ?? {};

//     return NextResponse.json(
//       { data, meta },
//       {
//         status: response.status,
//         headers: {
//           'Cache-Control': 'no-store, max-age=0',
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

import { NextRequest, NextResponse } from 'next/server';
import apiService from '@/lib/axios';
import { getToken } from 'next-auth/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('id');
    const userId = token.user.id;

    // Filter quiz_score by userId directly in the populate string
    // const response = await apiService.get(
    //   `/recorderd-lectures/${documentId}?` +
    //   `populate[course_modules][populate][0]=thumbnail` +
    //   `&populate[course_modules][populate][1]=quiz` +
    //   `&populate[course_modules][populate][quiz_score][filters][user][id][$eq]=${userId}`
    // );
    //  const response = await apiService.get(`/recorderd-lectures/${documentId}`, {
    //   params: {
    //     // Populate thumbnail inside course_modules
    //     'populate[course_modules][populate][thumbnail]': true,

    //     // Populate quiz inside course_modules
    //     'populate[course_modules][populate][quiz]': true,

    //     // Populate quiz_score inside course_modules, filtered by userId
    //     'populate[course_modules][populate][quiz_score][filters][user][id][$eq]': userId,

    //     // Populate video_progresses inside course_modules, filtered by userId
    //     'populate[course_modules][populate][video_progresses][filters][user][id][$eq]': userId,
    //   }
    // });

    const response = await apiService.get(`/recorderd-lectures/${documentId}`, {
  params: {
    populate: {
      course_modules: {
        populate: {
          thumbnail: true,
          quiz: true,
          // Filter quiz scores to only show the logged-in user's score
          quiz_score: {
            filters: {
              user: { id: { $eq: userId } }
            }
          },
          // Filter progress to only show the logged-in user's progress
          video_progresses: {
            filters: {
              user: { id: { $eq: userId } }
            }
          }
        }
      }
    }
  }
});

    return NextResponse.json(
      { data: response.data?.data },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err: any) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}