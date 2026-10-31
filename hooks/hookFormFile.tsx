"use client";

import React, { useState } from "react";
import { Controller } from "react-hook-form";

interface HookFormFileFieldProps {
  name: string;
  control: any;
  placeholder?: string;
  error?: string;
  className?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  preview?: boolean; // 👈 extra prop for preview
  accept?: string;   // e.g. "image/*,.pdf"
}

const HookFormFileField = ({
  name,
  control,
  placeholder,
  error,
  className = "",
  label,
  required,
  disabled = false,
  preview = false,
  accept,
}: HookFormFileFieldProps) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ...field } }) => (
          <>
            <input
              id={name}
              type="file"
              placeholder={placeholder}
              disabled={disabled}
              accept={accept}
              className={`border rounded px-3 py-2
                ${!error
                  ? "focus:outline-none focus:ring-1 focus:ring-blue-500"
                  : "border-red-500"
                }  
                bg-gray-100
                text-black text-sm placeholder-gray-400 shadow
                rounded-[7px]
                ${error ? "border-red-500" : "border-gray-300"} ${className}
                ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
              onChange={(e) => {
                const file = e.target.files?.[0];
                onChange(file); // store file in react-hook-form
                if (preview && file) {
                  const url = URL.createObjectURL(file);
                  setFilePreview(url);
                }
              }}
              {...field}
            />

            {/* Preview Section */}
            {preview && filePreview && (
              <div className="mt-3">
                {value?.type?.startsWith("image/") ? (
                  <img
                    src={filePreview}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-md border"
                  />
                ) : (
                  <p className="text-sm text-gray-600">
                    Selected file: {value?.name}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default HookFormFileField;
