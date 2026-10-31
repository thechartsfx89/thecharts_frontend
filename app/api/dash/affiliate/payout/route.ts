import { API_ENDPOINTS } from "@/api-constant";
import apiService from "@/lib/axios";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // 🔐 Auth
        const token: any = await getToken({ req });

        if (!token || !token.jwt) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { withdraw_amount, remark, tds_charges, admin_charges, net_payable_amount } = body;

        // ✅ Validation
        if (!withdraw_amount || Number(withdraw_amount) <= 0) {
            return NextResponse.json(
                { success: false, message: "Valid withdrawal amount is required" },
                { status: 400 }
            );
        }

        // 🔍 KYC Check
        // const kycRes = await apiService.get(API_ENDPOINTS.kyc, {
        //     headers: {
        //         Authorization: `Bearer ${token.jwt}`,
        //     },
        // });
        const kycRes = await apiService.get(
      `${API_ENDPOINTS.kyc}?filters[user][id][$eq]=${token.sub}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token.jwt}`,
        },
      }
    );
       console.log({},kycRes.data.data)
        if (!kycRes?.data?.data || kycRes?.data?.data[0]?.kyc_status !== "APPROVED") {
            return NextResponse.json(
                {
                    success: false,
                    message: "KYC not complete.",
                },
                { status: 400 }
            );
        }

        // 💰 Current balance (replace with DB/API value)
        // const currentBalance = 287500;
        const currentBalanceRes = await apiService.get(`${API_ENDPOINTS.myWalletSummary}/${token.sub}`, {
            headers: {
                Authorization: `Bearer ${token.jwt}`,
            },
        });

           console.log({d:currentBalanceRes.data})
        if (Number(withdraw_amount) > currentBalanceRes.data.data.grand_total.wallet_balance) {
            return NextResponse.json(
                { success: false, message: "Insufficient balance" },
                { status: 400 }
            );
        }

        // 📝 Create payout
        const payoutRes = await apiService.post(
            API_ENDPOINTS.payout,
            {data:{
                withdraw_amount,
                remark,
                kyc_document: kycRes.data.data[0].id,
                user: token.sub,
                total_amount: currentBalanceRes.data.data.grand_total.wallet_balance,
                available_amount: currentBalanceRes.data.data.grand_total.wallet_balance - withdraw_amount,
                payout_status: "REQUESTED",
                transaction_type: "WITHDRAW",
                request_date: new Date().toISOString(),
                tds_charges: tds_charges ?? 0,
                admin_charges: admin_charges ?? 0,
                net_payable_amount: net_payable_amount ?? 0,
            }},
            {
                headers: {
                    Authorization: `Bearer ${token.jwt}`,
                },
            }
        );
    //   if(!payoutRes.ok){
    //     //  console.log({payoutRes})
    //   }
        return NextResponse.json({
            success: true,
            message: "Payout request submitted successfully",
            data: payoutRes.data,
        });
    } catch (error: any) {
        console.error("PAYOUT_POST_ERROR:", error?.response?.data || error);

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}


export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token?.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(token.sub);

   const payoutRes = await apiService.get(
  `${API_ENDPOINTS.payout}?filters[user][id][$eq]=${userId}` +
  `&filters[transaction_type][$eq]=WITHDRAW` +
  `&populate=*` +
  `&sort=createdAt:desc`,
  {
    headers: {
      Authorization: `Bearer ${token.jwt}`,
    },
  }
);


    return NextResponse.json({
      success: true,
      data: payoutRes.data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
