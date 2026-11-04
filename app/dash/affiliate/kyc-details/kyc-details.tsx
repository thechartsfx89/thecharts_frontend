"use client";

import { useEffect, useState } from "react";
import IconEye from "@/components/icon/icon-eye";
import { useSession } from "next-auth/react";
import IconLoader from "@/components/icon/icon-loader";
import { getImageUrl } from "@/utils/common/common";
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
  const [upiId, setUpiId] = useState("");

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
      setKycData(kyc);
      setPanNumber(kyc.pan_card ?? "");
      setAadharNumber(kyc.aadhar_card ?? "");
      setUpiId(kyc.upi_id ?? "");
      setAccountNumber(kyc.account_number ?? "");
      setIfscCode(kyc.ifsc_code ?? "");
      setBankName(kyc.bank_name ?? "");

      // media preview
      setPanDocPreview(kyc.pan_doc?.url ? getImageUrl(kyc.pan_doc?.url) : kyc?.pan_doc_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/kyc/${kyc?.pan_doc_path}` : null);
      setAadharDocPreview(kyc.aadhar_doc?.url ? getImageUrl(kyc.aadhar_doc?.url) : kyc?.id_proof_doc_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/kyc/${kyc?.id_proof_doc_path}` : null);
      setAddressDocPreview(kyc.address_proof_doc?.url ? getImageUrl(kyc.address_proof_doc?.url) : kyc?.address_proof_doc_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/kyc/${kyc?.address_proof_doc_path}` : null);
      setPassbookDocPreview(kyc.passbook_doc?.url ? getImageUrl(kyc.passbook_doc?.url) : kyc?.passbook_doc_path ? `${process.env.NEXT_PUBLIC_PROFILE_IMG_URL}/uploads/kyc/${kyc?.passbook_doc_path}` : null);
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
    formData.append("field", field);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    return await res.json();
  };

  const handleSubmit = async () => {
    // 🔹 Validation: Check required text fields
    if (!panNumber || !aadharNumber || !accountNumber || !ifscCode || !bankName) {
      showToast("error", "Please fill all required fields (PAN, Aadhaar, Bank Details)");
      return;
    }

    try {
      setIsSubmitting(true);
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
          upi_id: upiId,
          pan_doc: pan_doc_id,
          aadhar_doc: aadhar_doc_id,
          address_proof_doc: address_doc_id,
          passbook_doc: passbook_doc_id,
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      setReload(!reloadPage);
      showToast("success", "KYC Submitted");
    } catch (err) {
      console.error(err);
      showToast("error", "KYC Submission Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPreview = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const KYC_STATUS_CONFIG: Record<string, any> = {
    PENDING: { label: "Pending", text: "text-warning", bg: "bg-warning", lightBg: "bg-warning-light", border: "border-warning", icon: <IconClock /> },
    IN_PROGRESS: { label: "In Progress", text: "text-info", bg: "bg-info", lightBg: "bg-info-light", border: "border-info", icon: <IconChecks /> },
    APPROVED: { label: "Approved", text: "text-success", bg: "bg-success", lightBg: "bg-success-light", border: "border-success", icon: <IconCircleCheck /> },
    REJECTED: { label: "Rejected", text: "text-danger", bg: "bg-danger", lightBg: "bg-danger-light", border: "border-danger", icon: <IconX /> },
  };

  const statusKey = kycData?.kyc_status;
  const status = KYC_STATUS_CONFIG[statusKey];

  return (
    <div className="space-y-6">
      {status &&
        (loading ? (
          <div className="h-24 animate-pulse rounded-2xl bg-slate-200/60" />
        ) : (
          <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${status?.lightBg} ${status?.text}`}>{status?.icon}</span>
            <div className="min-w-0">
              <div className="font-bold text-[#0b1b33]">
                KYC Status: <span className={`${status?.text}`}>{status?.label}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                <strong className="font-semibold text-[#0b1b33]">Admin Remarks: </strong>
                {kycData?.admin_remarks || "No remarks available"}
              </p>
            </div>
          </div>
        ))}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className={`hidden border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:grid ${rowGrid}`}>
          <span>Document</span>
          <span>Document No</span>
          <span>Upload</span>
          <span className="text-center">View</span>
          <span className="text-center">Upload Status</span>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            <DocRow title="PAN Card" required onFile={setPanDoc} preview={panDocPreview} onView={openPreview}>
              <input value={panNumber?.toUpperCase()} onChange={(e) => setPanNumber(e.target.value.toUpperCase())} placeholder="PAN Number" aria-label="PAN Number" className={inputClass} />
            </DocRow>
            <DocRow title="Aadhaar/ID Card" required onFile={setAadharDoc} preview={aadharDocPreview} onView={openPreview}>
              <input value={aadharNumber} onChange={(e) => setAadharNumber(e.target.value)} placeholder="Aadhar Number" aria-label="Aadhar Number" className={inputClass} />
            </DocRow>
            <DocRow title="Address Proof" onFile={setAddressDoc} preview={addressDocPreview} onView={openPreview} />
            <DocRow title="Passbook" required onFile={setPassbookDoc} preview={passbookDocpreview} onView={openPreview}>
              <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Account No" aria-label="Account No" className={inputClass} />
                <input value={ifscCode?.toUpperCase()} onChange={(e) => setIfscCode(e.target.value)} placeholder="IFSC" aria-label="IFSC" className={inputClass} />
                <input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Bank Name" aria-label="Bank Name" className={inputClass} />
              </div>
            </DocRow>
            <DocRow title="UPI ID (Optional)" upload={false}>
              <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="Enter UPI Id" aria-label="UPI ID" className={inputClass} />
            </DocRow>
          </div>
        )}

        <div className="flex justify-end border-t border-slate-100 p-5">
          <button onClick={handleSubmit} disabled={loading || isSubmitting} className="rounded-xl bg-[#0b1b33] px-8 py-3 font-semibold text-white transition hover:bg-[#13284a] disabled:opacity-60" type="submit">
            {isSubmitting ? (
              <>
                <IconLoader className="inline-block shrink-0 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const rowGrid = "lg:grid-cols-[170px_minmax(0,1fr)_230px_60px_110px] lg:gap-4";
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#0b1b33] outline-none transition placeholder:text-slate-400 focus:border-[#16c75f]";

function DocRow({ title, required = false, upload = true, onFile, preview, onView, children }: { title: string; required?: boolean; upload?: boolean; onFile?: (file: File | null) => void; preview?: string | null; onView?: (url?: string) => void; children?: React.ReactNode }) {
  return (
    <div className={`grid items-center gap-3 px-5 py-4 ${rowGrid}`}>
      <div className="text-sm font-semibold text-[#0b1b33]">
        {title} {required && <span className="text-red-500">*</span>}
      </div>
      <div>{children}</div>
      {upload && (
        <>
          <input
            type="file"
            aria-label={`Upload ${title}`}
            onChange={(e) => onFile?.(e.target.files?.[0] || null)}
            className="w-full cursor-pointer text-xs text-slate-500 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#0b1b33] hover:file:bg-slate-200"
          />
          <div className="flex items-center gap-3 lg:contents">
            <div className="lg:text-center">
              {preview ? (
                <button type="button" aria-label={`View ${title}`} onClick={() => onView?.(preview)} className="text-[#0e9f4a] transition hover:text-[#0b1b33]">
                  <IconEye />
                </button>
              ) : (
                <span className="text-slate-400">-</span>
              )}
            </div>
            <div className="lg:text-center">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${preview ? "bg-[#e9f8ef] text-[#0e9f4a]" : "bg-amber-50 text-amber-700"}`}>{preview ? "Uploaded" : "Pending"}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
