// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      username?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      profileImage?: string | null;
      fullName?: string | null;
      profile_img_path?: string | null;
    };
    jwt?: string | null;
    confirm_affiliate_payment?: boolean | null;
    affiliate_expiredAt?: string | null;
    affiliate_expired?: boolean | null;
    level_5_commission_window_expired?: boolean | null;
    level_5_commission_window_expiredAt?: string | null;
    level_10_commission_window_expired?: boolean | null;
    level_10_commission_window_expiredAt?: string | null;
  }

  interface User {
    id?: string;
    username?: string;
    role?: string | null;
  }
}
