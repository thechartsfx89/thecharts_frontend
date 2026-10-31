// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// const secret = process.env.NEXTAUTH_SECRET!;

// export async function middleware(req: NextRequest) {
//   // 🔹 Try to get JWT from NextAuth
//   const token:any = await getToken({ req, secret });
//   // if (!token) {
//   //   return NextResponse.redirect(new URL("/", req.url));
//   // }
//   if (!token) {
//     // Create a new URL object for the /login page
//     const loginUrl = new URL("/auth/login", req.url);
//     // Optional: Add a callbackUrl to return the user to their destination after logging in
//     loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
//     return NextResponse.redirect(loginUrl);
//   }
//   console.log({token})
//   const { pathname } = req.nextUrl;
//   const role:any = token?.user?.role;
//   console.log({role})
//   // 🔹 Role-based route protection
//   if (pathname.startsWith("/dash/mentor") && role !== "mentor") {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   if (pathname.startsWith("/dash/student") && role !== "student") {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   // if (pathname.startsWith("/admin") && role !== "admin") {
//   //   return NextResponse.redirect(new URL("/", req.url));
//   // }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/student/:path*", "/admin/:path*"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // 1. Fetch the token
  const token: any = await getToken({ req, secret });

  // 2. Handle Session Expiry / No Token
  if (!token) {
    const loginUrl = new URL("/auth/login", req.url);
    // Securely redirect back to the page they were trying to access
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = token?.user?.role;

  // 3. Role-Based Access Control (RBAC)
  // Ensure the pathname matches your actual folder structure
  if (pathname.startsWith("/dash/mentor") && role !== "mentor") {
    return NextResponse.redirect(new URL("/unauthorized", req.url)); 
  }

  if (pathname.startsWith("/dash/student") && role !== "student") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

// 4. Critical: The Matcher must include all protected routes
export const config = {
  matcher: [
    "/dash/:path*", 
    "/admin/:path*",
    // Add any other routes that require a session
  ],
};