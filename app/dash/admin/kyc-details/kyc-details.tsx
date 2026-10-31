"use client";

import { useEffect, useState } from "react";
import IconEye from "@/components/icon/icon-eye";
import { useSession } from "next-auth/react";
import IconLoader from "@/components/icon/icon-loader";
import { getImageUrl } from "@/utils/common/common";
import { KycTableSkeleton } from "./kycPulse";
import { showToast } from "@/utils/toast";
import IconInfoTriangle from "@/components/icon/icon-info-triangle";
import IconChecks from "@/components/icon/icon-checks";
import IconClock from "@/components/icon/icon-clock";
import IconX from "@/components/icon/icon-x";
import IconCircleCheck from "@/components/icon/icon-circle-check";

export default function KYCUploadDocument() {
  // 🔹 Loading
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  // 🔹 Text fields
  const [panNumber, setPanNumber] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");

  // 🔹 Files
  const [panDoc, setPanDoc] = useState<File | null>(null);
  const [aadharDoc, setAadharDoc] = useState<File | null>(null);
  const [addressDoc, setAddressDoc] = useState<File | null>(null);
  const [passbookDoc, setPassbookDoc] = useState<File | null>(null);
  

  const [panDocPreview, setPanDocPreview] = useState<any>(null);
  const [aadharDocPreview, setAadharDocPreview] = useState<any>(null);
  const [addressDocPreview, setAddressDocPreview] = useState<any>(null);
  const [passbookDocpreview, setPassbookDocPreview] = useState<any>(null);
  const [kycData, setKycData] = useState<any>(null);
  const [reloadPage, setReload] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);



  const fetchKyc = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/dash/affiliate/kyc");
      const json = await res.json();

      if (!json.success || !json.data) return;

      const kyc = json?.data;
      setKycData(kyc)
      setPanNumber(kyc.pan_card ?? "");
      setAadharNumber(kyc.aadhar_card ?? "");
      setAccountNumber(kyc.account_number ?? "");
      setIfscCode(kyc.ifsc_code ?? "");
      setBankName(kyc.bank_name ?? "");


      // media preview
      setPanDocPreview(kyc.pan_doc?.url ? getImageUrl(kyc.pan_doc?.url) : kyc?.pan_doc_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/kyc/${kyc?.pan_doc_path}` :null);
      setAadharDocPreview(kyc.aadhar_doc?.url ? getImageUrl(kyc.aadhar_doc?.url) : kyc?.id_proof_doc_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/kyc/${kyc?.id_proof_doc_path}` :null);
      setAddressDocPreview(kyc.address_proof_doc?.url ? getImageUrl(kyc.address_proof_doc?.url) : kyc?.address_proof_doc_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/kyc/${kyc?.address_proof_doc_path}` :null);
      setPassbookDocPreview(kyc.passbook_doc?.url ? getImageUrl(kyc.passbook_doc?.url) : kyc?.passbook_doc_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/kyc/${kyc?.passbook_doc_path}` :null);
    } catch (err) {
      console.error("Failed to fetch KYC", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchKyc();
  }, [reloadPage]);
  const uploadFile = async (file: File, field: string, kycId?: number) => {
    const formData = new FormData();

    formData.append("files", file);
    formData.append("ref", "api::kyc-document.kyc-document");
    // formData.append("refId", String(kycId)); // REQUIRED
    formData.append("field", field);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData, // ✅ FormData goes here
    });

    if (!res.ok) throw new Error("Upload failed");

    return await res.json();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      let pan_doc_id: number | null = null;
      let aadhar_doc_id: number | null = null;
      let address_doc_id: number | null = null;
      let passbook_doc_id: number | null = null;

      if (panDoc) {
        const res = await uploadFile(panDoc, "pan_doc");
        pan_doc_id = res?.[0]?.id ?? null;
      }

      if (aadharDoc) {
        const res = await uploadFile(aadharDoc, "aadhar_doc");
        aadhar_doc_id = res?.[0]?.id ?? null;
      }

      if (addressDoc) {
        const res = await uploadFile(addressDoc, "address_proof_doc");
        address_doc_id = res?.[0]?.id ?? null;
      }

      if (passbookDoc) {
        const res = await uploadFile(passbookDoc, "passbook_doc");
        passbook_doc_id = res?.[0]?.id ?? null;
      }

      const res = await fetch("/api/dash/affiliate/kyc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: session?.user?.id,

          pan_card: panNumber,
          aadhar_card: aadharNumber,
          account_number: accountNumber,
          ifsc_code: ifscCode,
          bank_name: bankName,

          pan_doc: pan_doc_id,
          aadhar_doc: aadhar_doc_id,
          address_proof_doc: address_doc_id,
          passbook_doc: passbook_doc_id,
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      setReload(!reloadPage)
      showToast("success", "KYC Submitted");
      //  setLoading(false);
    } catch (err) {
      console.error(err);
      showToast("error", "KYC Submission Failed");
      // alert("❌ KYC Submission Failed");
    } finally {
      setIsSubmitting(false)

    }
  };
  const openPreview = (url?: string) => {
    if (!url) return;

    // const fullUrl = getImageUrl(url);
    const fullUrl = url;

    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };
  const KYC_STATUS_CONFIG: Record<
    string,
    {
      label: string;
      text: string;
      bg: string;
      border: string;
      lightBg: string;
      icon: JSX.Element;
    }
  > = {
    PENDING: {
      label: "Pending",
      text: "text-warning",
      bg: "bg-warning",
      lightBg: "bg-warning-light",
      border: "border-warning",
      icon: <IconClock />,
    },
    IN_PROGRESS: {
      label: "In Progress",
      text: "text-info",
      bg: "bg-info",
      lightBg: "bg-info-light",
      border: "border-info",
      icon: <IconChecks />,
    },
    APPROVED: {
      label: "Approved",
      text: "text-success",
      bg: "bg-success",
      lightBg: "bg-success-light",
      border: "border-success",
      icon: <IconCircleCheck />,
    },
    REJECTED: {
      label: "Rejected",
      text: "text-danger",
      bg: "bg-danger",
      lightBg: "bg-danger-light",
      border: "border-danger",
      icon: <IconX />,
    },
  };
  const statusKey = kycData?.kyc_status;
  const status = KYC_STATUS_CONFIG[statusKey];
  console.log({ kycData, status })
  return (<>
    {status &&

      loading ? <div className="panel mt-2 animate-pulse">
      {/* Title */}
      <div className="h-4 w-40 bg-gray-300 rounded mb-3"></div>

      {/* Status box */}
      <div className="relative mb-2 flex items-center p-3.5 rounded border border-gray-200">
        {/* Icon placeholder */}
        {/* <span className="absolute ltr:-left-11 rtl:-right-11 inset-y-0 m-auto">
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
        </span> */}

        {/* Message lines */}
        <div className="flex flex-col gap-2 w-full">
          <div className="h-3 w-32 bg-gray-300 rounded"></div>
          <div className="h-3 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
      : <div className="panel mt-2">
        <div className="font-bold text-dark text-base mb-2">
          KYC Status:{" "}
          <span className={`${status?.text}`}>
            {status?.label}
          </span>

        </div>
        <div
          className={`relative mb-2 flex items-center p-3.5 rounded 
          ${status?.text} ${status?.lightBg} ${status?.border}
          ltr:border-l-[64px] rtl:border-r-[64px]`}
        >
          <span className="absolute ltr:-left-11 rtl:-right-11 inset-y-0 text-white w-6 h-6 m-auto flex items-center justify-center">
            {status?.icon}
          </span>

          <span className="ltr:pr-2 rtl:pl-2">
            <strong className="ltr:mr-1 rtl:ml-1">Admin Remarks:</strong>
            <span className="text-dark">{kycData?.admin_remarks || "No remarks available"}</span>
          </span>


        </div>

      </div>
    }

    <div className="panel mt-4">
      <div className="overflow-x-auto mt-1">

        <table className="w-full border rounded-lg">

          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border">Document</th>
              <th className="px-4 py-3 border">Document No</th>
              <th className="px-4 py-3 border">Upload</th>
              <th className="px-4 py-3 border">View</th>
              <th className="px-4 py-3 border">Upload Status</th>
            </tr>
          </thead>

          {loading ? <KycTableSkeleton /> : <tbody className="text-sm">
            {/* PAN CARD */}
            <tr className="border">
              <td className="px-4 py-3 font-medium">PAN Card</td>
              <td className="px-4 py-3">
                <input
                  value={panNumber?.toUpperCase()}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="PAN Number"
                  className="w-full border px-3 py-2 rounded"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="file"
                  onChange={(e) => setPanDoc(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
              </td>
              <td className="text-center">
                {panDocPreview ? (
                  <button
                    onClick={() => openPreview(panDocPreview)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <IconEye />
                  </button>
                ) : (
                  "-"
                )}
              </td>
              <td className="text-center">
                <span className={`badge  ${panDocPreview ? "bg-success" : "bg-warning"}`}>{panDocPreview ? "Uploaded" : "Pending"}</span>

              </td>
            </tr>

            {/* AADHAR */}
            <tr className="border">
              <td className="px-4 py-3 font-medium">Aadhar/ID Card</td>
              <td className="px-4 py-3">
                <input
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value)}
                  placeholder="Aadhar Number"
                  className="w-full border px-3 py-2 rounded"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="file"
                  onChange={(e) => setAadharDoc(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
              </td>
              <td className="text-center">
                {aadharDocPreview ? (
                  <button
                    onClick={() => openPreview(aadharDocPreview)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <IconEye />
                  </button>
                ) : (
                  "-"
                )}
              </td>
              <td className="text-center">
                <span className={`badge  ${aadharDocPreview ? "bg-success" : "bg-warning"}`}>{aadharDocPreview ? "Uploaded" : "Pending"}</span>

              </td>
            </tr>

            {/* ADDRESS */}
            <tr className="border">
              <td className="px-4 py-3 font-medium">Address Proof</td>
              <td></td>
              <td className="px-4 py-3">
                <input
                  type="file"
                  onChange={(e) => setAddressDoc(e.target.files?.[0] || null)}
                />
              </td>
              <td className="text-center">
                {addressDocPreview ? (
                  <button
                    onClick={() => openPreview(addressDocPreview)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <IconEye />
                  </button>
                ) : (
                  "-"
                )}
              </td>
              <td className="text-center">
                <span className={`badge  ${addressDocPreview ? "bg-success" : "bg-warning"}`}>{addressDocPreview ? "Uploaded" : "Pending"}</span>
              </td>
            </tr>

            {/* PASSBOOK */}
            <tr className="border">
              <td className="px-4 py-3 font-medium">Passbook</td>
              <td className="px-4 py-3 flex gap-2">
                <input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Account No"
                  className="border px-2 py-1 rounded w-1/2"
                />
                <input
                  value={ifscCode?.toUpperCase()}
                  onChange={(e) => setIfscCode(e.target.value)}
                  placeholder="IFSC"
                  className="border px-2 py-1 rounded w-1/2"
                />
                <input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Bank Name"
                  className="border px-2 py-1 rounded w-1/2"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="file"
                  onChange={(e) => setPassbookDoc(e.target.files?.[0] || null)}
                />
              </td>
              <td className="text-center">
                {passbookDocpreview ? (
                  <button
                    onClick={() => openPreview(passbookDocpreview)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <IconEye />
                  </button>
                ) : (
                  "-"
                )}
              </td>

              <td className="text-center">
                <span className={`badge  ${passbookDocpreview ? "bg-success" : "bg-warning"}`}>{passbookDocpreview ? "Uploaded" : "Pending"}</span>

              </td>
            </tr>

            {/* PHOTO */}
            {/* <tr className="border">
              <td className="px-4 py-3 font-medium">Photo</td>
              <td></td>
              <td className="px-4 py-3">
                <input
                  type="file"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                />
              </td>
              <td className="text-center"><IconEye /></td>
              <td className="text-center">
                <span className="badge bg-success">upload</span>
              </td>
            </tr> */}
          </tbody>}
        </table>
      </div>

      {/* SUBMIT */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-dark text-white px-6 py-2 rounded"
          type="submit"
        >{isSubmitting ?
          <> <IconLoader className="inline-block shrink-0 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2" />Submitting...</> :
          "Submit"
          }
          {/* {loading ? "Submitting..." : "Submit"} */}
        </button>
      </div>
    </div>
  </>
  );
}
