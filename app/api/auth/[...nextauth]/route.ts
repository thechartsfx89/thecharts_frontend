// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";
import { getClientIp } from "@/utils/getDeviceIp";
import { normalizeIp } from "@/utils/normalizeIp";
import { getImageUrl } from "@/utils/common/common";



const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Identifier", type: "text" },
                password: { label: "Password", type: "password" },
                rememberMe: { label: "Remember Me", type: "boolean" },
            },
            async authorize(credentials: any, req: any) {
                try {
                    // ✅ Use deviceId sent from frontend
                    // const deviceId = credentials.deviceId;
                    // if (!deviceId) throw new Error("Device ID is missing");

                    // Combine with user agent
                    const deviceInfo = req.headers['user-agent'] || 'unknown';
                    // const deviceInfo = `${deviceId}_${userAgent}`;

                    // Get normalized IP
                    const ip = normalizeIp(getClientIp(req));
                    // Call Strapi login API
                    const loginRes = await apiService.post(API_ENDPOINTS.login, {
                        identifier: credentials.identifier,
                        password: credentials.password,
                    });
                    const data = loginRes.data;
                    if (!data?.jwt) throw new Error("Invalid credentials");

                    // Get user info including role
                    const userRes = await apiService.get(`${API_ENDPOINTS.me}?populate=*`, {
                        headers: { Authorization: `Bearer ${data.jwt}` },
                    });
                    const user = userRes.data;

                    const profileImageUrl =
                        user?.profile_image?.url ||
                        user?.profile_image?.formats?.thumbnail?.url ||
                        null;

                    // If Strapi returns relative URLs ("/uploads/..."), fix with base URL
                    const fullImageUrl = profileImageUrl
                        ? profileImageUrl
                        : null;

                    // Check active sessions
                    const sessionsRes = await apiService.get(
                        `${API_ENDPOINTS.userSessions}?filters[user][$eq]=${user.id}`,
                        { headers: { Authorization: `Bearer ${data.jwt}` } }
                    );
                    const activeSessions = sessionsRes.data.data;

                    // Check if current device/IP is already registered
                    const isCurrentDeviceRegistered = activeSessions.some(
                        (s: any) =>
                            normalizeIp(s.ip_address) === ip &&
                            s.device_info === deviceInfo
                    );

                    if (!isCurrentDeviceRegistered && activeSessions.length >= 2) {
                        throw new Error("Maximum 2 devices are allowed.");
                    }

                    // Record new session if device/IP is new
                    let sessionId: any;
                    if (!isCurrentDeviceRegistered) {
                        const sessionCreateRes = await apiService.post(
                            API_ENDPOINTS.userSessions,
                            {
                                data: {
                                    user: String(user.id),
                                    token: data.jwt,
                                    ip_address: ip,
                                    device_info: deviceInfo,
                                },
                            },
                            { headers: { Authorization: `Bearer ${data.jwt}` } }
                        );
                        sessionId = sessionCreateRes.data.data.id;
                    } else {
                        sessionId = activeSessions.find(
                            (s: any) =>
                                normalizeIp(s.ip_address) === ip &&
                                s.device_info === deviceInfo
                        )?.id;
                    }

                    // Return user info for NextAuth
                    // console.log({ user }, ">>>>>>>>>~");
                    return {
                        id: user.id,
                        email: user?.email ?? "",
                        username: user?.username ?? "",
                        role: user.role?.name,
                        jwt: data?.jwt,
                        rememberMe: credentials.rememberMe ?? false,
                        sessionId,
                        profileImage: fullImageUrl,
                        fullName: user?.fullName,
                        profile_img_path: user?.profile_img_path,

                    };
                } catch (err: any) {
                    console.error("Login error:", err);

                    // Case 1: Custom thrown errors like "Maximum 2 devices are allowed."
                    if (err instanceof Error && err.message) {
                        throw new Error(err.message);
                    }

                    // Case 2: Strapi-style API error
                    if (err?.error?.message) {
                        throw new Error(err.error.message);
                    }

                    if (err?.response?.data?.error?.message) {
                        throw new Error(err.response.data.error.message);
                    }

                    // Case 3: Strapi field errors
                    if (err?.response?.data?.error) {
                        throw new Error(err.response.data.error);
                    }

                    // Fallback
                    throw new Error("Login failed. Please try again.");
                }

            }

        }),
    ],

    callbacks: {
        async jwt({ token, user, trigger, session }: any) {
            console.log({ user })
            if (user) {
                token.jwt = user.jwt;
                token.user = {
                    id: user.id,
                    email: user.email,
                    username: user?.username ?? "",
                    role: user.role,
                    profileImage: user.profileImage ?? user.profile_image ?? null,
                    fullName: user?.fullName,
                    profile_img_path: user?.profile_img_path,


                };
                token.sessionId = user.sessionId;
                // ⏱️ Set token expiry based on rememberMe
                // if (user.rememberMe) {
                //     token.exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days
                // } else {
                //     token.exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24 hours
                // }
                token.exp = Math.floor(Date.now() / 1000) + (20 * 365 * 24 * 60 * 60);


            }
            if (trigger === "update" && session) {
                const newProfile =
                    session?.user?.profile_image ??
                    session?.profile_image ??
                    session?.user?.profileImage ??
                    null;

                if (newProfile) {
                    // keep both snake_case and camelCase on the token
                    token.profile_image = newProfile;
                    token.user = {
                        ...(token.user ?? {}),
                        profileImage: newProfile,
                    }
                }
            }
            return token;
        },

        async session({ session, token }: any) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${token.sub}`, {
                headers: {
                    Authorization: `Bearer ${token.jwt}`,
                },
            });

            const freshUserData = await res.json();
            // console.log({ freshUserData }, ">>>>>>>>>~");
            session.jwt = token.jwt;
            session.user = token.user;
            session.sessionId = token.sessionId;
            // session.expires = new Date(token.exp * 1000).toISOString(); // pass expiry to client
            session.user.id = token.sub;
            session.fullName = token.fullName;
            session.profile_img_path = token?.profile_img_path,
            session.confirm_affiliate_payment = freshUserData?.confirm_affiliate_payment ?? null,
            session.affiliate_expired = freshUserData?.affiliate_expired ?? null,
            session.affiliate_expiredAt = freshUserData?.affiliate_expiredAt ?? null,
            session.level_5_commission_window_expired = freshUserData?.level_5_commission_window_expired ?? null,
            session.level_5_commission_window_expiredAt = freshUserData?.level_5_commission_window_expiredAt ?? null,
            session.level_10_commission_window_expired = freshUserData?.level_10_commission_window_expired ?? null,
            session.level_10_commission_window_expiredAt = freshUserData?.level_10_commission_window_expiredAt ?? null

            const profileFromToken =
                token.user?.profileImage ?? token.profile_image ?? null;

            if (profileFromToken) {
                session.user.profileImage = profileFromToken;    // camelCase for UI
                session.user.profile_image = profileFromToken;  // snake_case for other usages
            }

            
            return session;
        },
    },
    events: {
        async signOut({ token }: any) {
            if (token?.sessionId && token?.jwt) {
                try {
                    // Use the user's actual JWT to delete their own session
                    await apiService.delete(`${API_ENDPOINTS.userSessions}/${token.sessionId}`, {
                        headers: {
                            Authorization: `Bearer ${token.jwt}`,
                            "Content-Type": "application/json",
                        },
                    });
                    console.log("Strapi session record deleted successfully");
                } catch (err) {
                    console.error("Failed to delete Strapi session on logout:", err);
                }
            }
        },
    },
    // events: {
    //     async signOut({ token }: any) {
    //         console.log({ token })
    //         try {
    //             // Call Strapi API to delete the session record
    //             const res = await apiService.delete(`${API_ENDPOINTS.userSessions}/${token.sessionId}`, {
    //                 headers: { Authorization: `Bearer 9f1145aea73282627ca900e7e3153140bb1a18f4528ccfa13b0b00ecca14187f951db5494dd564463e91957c59347455d90f818120702da144109356e7022afea0c4e09bfd7378f910bf671a5c1136eadc86ac4f131aa7c53773516af7f635fd36dfd2fef339507dee96a4692ad01bafc66f500e8317d6eed8868a30bcd04313`, "Content-Type": "application/json", },
    //             });
    //             console.log({ res })
    //             console.log("Deleted:", res);
    //             console.log("User session deleted successfully on logout");
    //         } catch (err) {
    //             console.error("Failed to delete session on logout:", err);
    //         }
    //     },
    // },

    secret: process.env.NEXTAUTH_SECRET,
    pages: { signIn: "/login" },
    // session: { strategy: "jwt" },
    session: { 
        strategy: "jwt",
        maxAge: 20 * 365 * 24 * 60 * 60, // 20 Years
        updateAge: 24 * 60 * 60,         // Update once a day
    },
};

// ✅ Proper handler export for App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
