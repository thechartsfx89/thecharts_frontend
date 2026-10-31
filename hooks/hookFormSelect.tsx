// File: HookFormSelectField.tsx
import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

interface Option {
  label: string;
  value: string | number;
}

interface HookFormSelectFieldProps {
  name: string;
  control: any;
  error?: string;
  className?: string;
  label?: string;
  options?: Option[];
  placeholder?: string;
  required?: boolean;
  callback?: (value: string | number) => void;
  searchable?: boolean;
  [key: string]: any;
}

const HookFormSelectField = ({
  name,
  control,
  error,
  className = "",
  label,
  options = [],
  placeholder,
  required,
  callback,
  searchable = false,
  ...rest
}: HookFormSelectFieldProps) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500" style={{color:"red"}}>*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={"" as any}
        render={({ field }) => {
          if (searchable) {
            // ✅ Use react-select when searchable
            return (
              <Select
                {...field}
                id={name}
                options={options}
                placeholder={placeholder}
                isClearable
                classNamePrefix="react-select"
                className={`react-select-container placeholder:p-4 ${className}`}
                onChange={(val: any) => {
                  field.onChange(val?.value ?? "");
                  if (callback) callback(val?.value ?? "");
                }}
                value={
                  options.find((opt) => opt.value === field.value) || null
                }
                {...rest}
              />
            );
          }

          // ✅ Default native <select>
          const isEmpty =
            field.value === undefined ||
            field.value === null ||
            field.value === "";

          return (
            <div className="relative w-full">
              <select
                {...field}
                id={name}
                aria-invalid={!!error}
                style={error ? { borderColor: "red" } : {}}
                className={`
                 form-select text-dark text-sm font-medium
                  ${isEmpty ? "text-gray-400" : "text-black"}
                  ${
                    !error
                      ? "focus:outline-none focus:ring-1 focus:ring-blue-500 border-gray-300"
                      : "border-red-500"
                  }
                 ${className}
                `}
                onChange={(e) => {
                  field.onChange(e);
                  if (callback) callback(e.target.value);
                }}
                {...rest}
              >
                {placeholder && (
                  <option value="" disabled>
                    {placeholder}
                  </option>
                )}
                {options.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Chevron */}
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          );
        }}
      />

      {error && <p className="text-red-500 text-xs mt-1" style={{color:"red"}}>{error}</p>}
    </div>
  );
};

export default HookFormSelectField;
