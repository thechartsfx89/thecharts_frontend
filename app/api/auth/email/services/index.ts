import apiService from "@/lib/axios";
import { API_ENDPOINTS } from "@/api-constant";

/* ===============================
   PAYMENT SUCCESS
================================= */

export interface PaymentSuccessPayload {
  email: string;
  fullName: string;
  courseName: string;
  amount: number;
  transactionId?: string;
  payment_mode?: string;
}

export const sendPaymentSubmittedEmail = async (
  payload: PaymentSuccessPayload,
//   token: string
) => {
  try {
    const response = await apiService.post(
      API_ENDPOINTS.enrollPaymentEmail,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        //   Authorization: `Bearer ${token}`, // 👈 REQUIRED
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Payment success email failed:",
      error?.response?.data || error.message
    );
    throw error;
  }
};


/* ===============================
   BOOK DEMO EMAIL
================================= */

export interface DemoEmailPayload {
  email: string;
  fullName: string;
  courseName: string;
  demoDate: string;
}

export const sendDemoEmail = async (payload: DemoEmailPayload) => {
  try {
    const response = await apiService.post(
      API_ENDPOINTS.bookDemoEmail,
      payload
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Demo email failed:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

/* ===============================
   WELCOME AFFILIATE EMAIL
================================= */

// export interface WelcomeAffiliatePayload {
//   email: string;
//   fullName: string;
//   referralCode: string;
// }

// export const sendWelcomeAffiliateEmail = async (
//   payload: WelcomeAffiliatePayload
// ) => {
//   try {
//     const response = await apiService.post(
//       API_ENDPOINTS.welcomeAffiliateEmail,
//       payload
//     );

//     return response.data;
//   } catch (error: any) {
//     console.error(
//       "Affiliate welcome email failed:",
//       error?.response?.data || error.message
//     );
//     throw error;
//   }
// };

/* ===============================
   WELCOME CLUB EMAIL
================================= */

// export interface WelcomeClubPayload {
//   email: string;
//   fullName: string;
//   membershipName: string;
// }

// export const sendWelcomeClubEmail = async (
//   payload: WelcomeClubPayload
// ) => {
//   try {
//     const response = await apiService.post(
//       API_ENDPOINTS.welcomeClubEmail,
//       payload
//     );

//     return response.data;
//   } catch (error: any) {
//     console.error(
//       "Club welcome email failed:",
//       error?.response?.data || error.message
//     );
//     throw error;
//   }
// };
