"use client";

import { showToast } from "@/utils/toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
const API_URL = process.env.NEXT_PUBLIC_URL;

const UploadedStudentDocumentsPage = ({ userId, isAction }) => {
  const { data: session, } = useSession();
  console.log(">>>>>", userId)
  const [documents, setDocuments] = useState([]);
  const handleDelete = async (id: string) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        icon: "swal-icon-large",
        confirmButton: "btn btn-primary mx-2",
        cancelButton: "btn btn-danger mx-2",
        popup: "custom-swal",
        title: "custom-swal-title",
        htmlContainer: "custom-swal-text",
      },
      width: "520px",
      padding: "0.8rem",
      position: "top",

      allowOutsideClick: () => !Swal.isLoading(), // stop closing while loading
      allowEscapeKey: () => !Swal.isLoading(),

      // 🔥 runs when user clicks DELETE
      preConfirm: async () => {
        Swal.showLoading();

        try {
          const response = await fetch(`/api/student-libraries?id=${id}`, {
            method: "DELETE",
          });
          const result = await response.json();
          // ❌ If backend returned any error
          if (!response.ok) {
            throw new Error(result?.error || "Unable to delete file.");
          }

          await fetchDocuments(); // refresh list

          return true; // ✔ allow swal to close

        } catch (error: any) {
          // ❌ show error INSIDE modal
          Swal.showValidationMessage(
            `Delete failed: ${error?.message ?? "Something Went Wrong"}`
          );
          return false; // ❌ keep modal open
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your file has been deleted.",
          position: "top",
          width: "520px",
          buttonsStyling: false,
          customClass: {
            confirmButton: "btn btn-success",
            icon: "swal-icon-large",
            popup: "custom-swal",
            title: "custom-swal-title",
            htmlContainer: "custom-swal-text",
          },
        });
      }
    });
  };




  // --------------------------
  // Fetch Student Documents
  // --------------------------
  const fetchDocuments = async () => {
    try {
      const res = await fetch(`/api/student-libraries?id=${userId ?? null}`);
      const json = await res.json();



      setDocuments(json?.data || []);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState<any>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingFile(file);
    setUploadProgress(1);
    try {
      // Upload file
      const formData = new FormData();
      formData.append("files", file);

      const uploadRes = await axios.post(
        `/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: async (p: any) => {
            if (!p.total) return;

            const percent = Math.round((p.loaded / p.total) * 100);
            console.log("Progress:", percent);
            // Update UI
            setUploadProgress(percent);
          },
        }
      );
      const uploadedFile = uploadRes.data?.[0];

      //  console.log("Final File IDs Sent to Strapi:", formattedFileIds);
      if (!uploadedFile) {
        showToast("error", "Upload failed")
        throw new Error("Upload failed");
      }
      setDocuments((prev) => [
        {
          id: uploadedFile?.documentId,
          name: uploadedFile?.name,
          url: uploadedFile?.url,
          type: uploadedFile.ext.substring(1).toUpperCase(),
          thumbnail: uploadedFile?.url,
          uploaded: new Date(uploadedFile?.createdAt).toLocaleString(),
        },
        ...prev,
      ]);

      // Clear temporary uploading row
      setUploadingFile(null);
      setUploadProgress(0);
      // Create entry in student_library
      const targetUserId = userId || session?.user?.id;

      await fetch(`/api/student-libraries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            user: targetUserId, // ✅ student if mentor, else self
            documents_file: uploadedFile.id,
            uploadedBy: session?.user?.id, // optional but recommended
          },
        }),
      });

      fetchDocuments(); // reload UI
      showToast("success", "Uploaded Successful")
    } catch (err) {
      console.log("Upload error:", err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-5">
        <h5 className="text-lg font-semibold text-black">Library</h5>

        {isAction && <button
          onClick={() => document.getElementById("uploadDoc").click()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Upload Docs
        </button>}

        <input
          type="file"
          id="uploadDoc"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th>Preview</th>
              <th>Document</th>
              <th>Type</th>
              <th>Uploaded</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {documents.length === 0 && (
              <tr>
                <td className="py-6 text-center" colSpan={5}>
                  No documents uploaded yet.
                </td>
              </tr>
            )}
            {uploadingFile && (
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
                <td className="py-3">
                  <img
                    src={uploadingFile?.thumbnail}
                    className="w-12 h-12 object-cover rounded-md border shadow-sm"
                  />
                </td>

                <td className="font-medium text-gray-700">
                  {uploadingFile?.name}
                  <div className="w-32 mt-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </td>

                <td>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-300">
                    {uploadingFile.type}
                  </span>
                </td>

                <td className="text-center text-gray-600">
                  {uploadProgress}% uploading...
                </td>

                <td className="text-center">
                  <span className="animate-spin inline-block w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full"></span>
                </td>
              </tr>
            )}

            {documents?.map((data: any) => {
              const doc = {
                id: data.id,
                name: data.documents_file?.name,
                uploaded: new Date(data.createdAt).toLocaleDateString(),
                type: data.documents_file?.mime?.includes("pdf")
                  ? "pdf"
                  : "Image",
                url: API_URL + data.documents_file?.url,
                thumbnail:
                  data.documents_file?.formats?.thumbnail?.url
                    ? API_URL + data.documents_file?.formats?.thumbnail?.url
                    : API_URL + data.documents_file?.url,
              };
              return (

                <tr
                  key={doc?.id}
                  className="border-b border-gray-100 dark:border-gray-700"
                >
                  {/* Thumbnail */}
                  <td className="py-3">
                    <img
                      src={doc.type == "pdf" ? "/pdf-icon.png" : doc.thumbnail}
                      className="w-12 h-12 object-cover rounded-md shadow-sm border"
                      alt="document preview"
                    />
                  </td>

                  {/* Document Name */}
                  <td>{doc.name}</td>

                  {/* File Type */}
                  <td>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                      {doc.type}
                    </span>
                  </td>

                  {/* Uploaded Time */}
                  <td className="text-center">{doc.uploaded}</td>

                  {/* Action Buttons */}
                  <td className="text-center flex items-center justify-center gap-3">
                    {/* View Icon */}
                    <a
                      href={doc.url}
                      target="_blank"
                      className="inline-flex items-center justify-center w-9 h-9 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.6}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                        />
                      </svg>
                    </a>

                    {/* Delete Icon */}
                    {isAction && <button
                      // onClick={() => handleDelete(doc.id)}
                      onClick={() => handleDelete(data?.documentId)}
                      className="inline-flex items-center justify-center w-9 h-9 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 7h12M10 11v6M14 11v6M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z"
                        />
                      </svg>
                    </button>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <style>
        {`
        .custom-swal {
  border-radius: 8px !important;
  font-size: 16px !important;     /* small text */
}

.custom-swal-title {
  font-size: 22px !important;     /* small title */
  font-weight: 600 !important;
}

.custom-swal-text {
  font-size: 14px !important;     /* small body text */
}

.custom-swal-confirm,
.custom-swal-cancel {
  font-size: 16px !important;     /* small buttons */
  padding: 4px 10px !important;
  border-radius: 6px !important;
}
.swal-icon-large .swal2-icon-content {
  font-size: 4rem !important; /* Increase emoji/icon size */
}

.swal-icon-large {
  // width: 6em !important;
  // height: 6em !important;
  // font-size: 2.5rem !important;
}
  .loader {
  width: 10px;
  height: 10px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


        `}
      </style>
    </div>
  );
};

export default UploadedStudentDocumentsPage;
