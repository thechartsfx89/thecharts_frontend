import { API_ENDPOINTS } from "@/api-constant";
import apiService from "@/lib/axios";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 🔐 Auth
    const token: any = await getToken({ req });
    if (!token || !token.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Read JSON body (NOT FormData)
    const body = await req.json();

    // 🔍 Check existing KYC
    const existing = await apiService.get(
      `${API_ENDPOINTS.kyc}?filters[user][id][$eq]=${body?.user}`,
      {
        headers: {
          Authorization: `Bearer ${token.jwt}`,
        },
      }
    );

    const existingKyc = existing.data?.data?.[0];
    console.log(existing.data?.data , ">>>>>>")
    let response:any;
  console.log({body})
const payload = {
  data: {
    user: Number(body.user),

    pan_card: body.pan_card ?? null,
    aadhar_card: body.aadhar_card ?? null,
    account_number: body.account_number ?? null,
    ifsc_code: body.ifsc_code ?? null,
    bank_name: body.bank_name ?? null,

    // media fields → ONLY IDs or null
    pan_doc: body.pan_doc ?? null,
    aadhar_doc: body.aadhar_doc ?? null,
    address_proof_doc: body.address_proof_doc ?? null,
    passbook_doc: body.passbook_doc ?? null,
    upi_id: body.upi_id ?? null
  },
};

const buildUpdateData = (body: any) => {
  const data: any = {};

  const allowedFields = [
    "pan_card",
    "aadhar_card",
    "account_number",
    "bank_name",
    "ifsc_code",
    "pan_doc",
    "aadhar_doc",
    "address_proof_doc",
    "passbook_doc",
    "upi_id"
  ];

  allowedFields.forEach((key) => {
    if (body[key] !== undefined && body[key] !== null && body[key] !== "") {
      data[key] = body[key];
    }
  });

  return data;
};

    // 🔁 UPDATE
    if (existingKyc) {
         const updateData = buildUpdateData(body);
    console.log({updateData})
  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { message: "No fields to update" },
      { status: 400 }
    );
  }

      response = await apiService.put(
        `${API_ENDPOINTS.kyc}/${existingKyc.documentId}`,
        {data:updateData},
        {
          headers: {
            Authorization: `Bearer ${token.jwt}`,
          },
        }
      );
    }
    // ➕ CREATE
    else {
      response = await apiService.post(API_ENDPOINTS.kyc, payload, {
        headers: {
          Authorization: `Bearer ${token.jwt}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      kycId: response.data.data.id,
      mode: existingKyc ? "updated" : "created",
    });
  } catch (error: any) {
    console.error("KYC API Error:", error?.response?.data || error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}




export async function GET(req: NextRequest) {
  try {
    // 🔐 Auth
    const token: any = await getToken({ req });
    if (!token || !token.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = token.sub;

    // 🔍 Fetch KYC for logged-in user
    const response = await apiService.get(
      `${API_ENDPOINTS.kyc}?filters[user][id][$eq]=${userId}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token.jwt}`,
        },
      }
    );

    const kyc = response.data?.data?.[0] ?? null;

    return NextResponse.json({
      success: true,
      data: kyc,
    });
  } catch (error: any) {
    console.error("GET KYC Error:", error?.response?.data || error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

