'use client';
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function SessionGuard() {
    const { status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    // useEffect(() => {
    //     // If the API returns null (unauthenticated), boot them to login
    //     if (status === "unauthenticated") {
    //         const loginUrl = `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`;
    //         router.push(loginUrl);
    //     }
    // }, [status, router, pathname]);
    useEffect(() => {
    if (status === "unauthenticated") {
        router.push(`/?callbackUrl=${encodeURIComponent(pathname)}`);
    }
}, [status, pathname, router]);

    return null; 
}

// 'use client';
// import { useSession } from "next-auth/react";
// import { useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";

// export default function SessionGuard() {
//     const { status } = useSession();
//     const router = useRouter();
//     const pathname = usePathname();

//     useEffect(() => {
//         // 1. Check if the user is unauthenticated
//         // 2. Ensure we aren't already on the root path (to avoid infinite loops)
//         // 3. Ensure we aren't on the login page (if you want them to stay there)
//         if (status === "unauthenticated" && pathname !== "/") {
//             console.log("Session expired or logged out. Redirecting to root...");
//             router.push("/");
//         }
//     }, [status, router, pathname]);

//     return null; 
// }