// File: HookFormInputField.tsx
import React from "react";
import { Controller, Control, FieldValues } from "react-hook-form";

interface HookFormInputFieldProps {
  name: string;
  control: any;
  placeholder?: string;
  type?: string;
  error?: string;
  className?: string;
  label?: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  callback?: (value: any) => void;
  [key: string]: any; // allow passing extra props like "maxLength", etc.
}

const HookFormInputField = ({
  name,
  control,
  placeholder,
  type = "text",
  error,
  className = "",
  label,
  icon,
  required,
  disabled = false,
  ...rest
}: HookFormInputFieldProps) => {
  return (
    <div className="flex flex-col  w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500" style={{ color: "red" }}>*</span>}
        </label>
      )}
      <div className="relative ">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              value={field.value ?? ""}
              checked={type === "checkbox" ? field.value : undefined}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              style={error ? { borderColor: "red" } : {}}
              className={`
              form-input rounded-md border p-2 text-sm font-light placeholder:font-thin placeholder:text-gray-500
          
            ${icon ? "ps-10" : ""}
           ${!error
                  ? "focus:outline-none focus:ring-1 focus:ring-blue-500 border-gray-300"
                  : "border-red-500"
                }
           ${disabled ? "cursor-not-allowed opacity-60 bg-gray-100" : "bg-white"}
            ${className}

             `}
              {...rest}
            />


          )}
        />
        {icon && (
          <span className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1" style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default HookFormInputField;
