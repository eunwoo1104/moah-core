"use client";

import type {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";

export function RHFInput<T extends FieldValues>({
  label,
  name,
  type,
  register,
  errors,
  required,
  placeholder,
  autoComplete,
  icon = null,
}: RHFInputProps<T>) {
  return (
    <label>
      <div className="flex flex-row items-center space-x-0.5">
        {icon}
        <p>
          {label} {required && <span className="text-red-400">*</span>}
        </p>
        <div className="flex-1" />
        {errors[name] && (
          <p className="font-light text-sm text-red-500 dark:text-red-400">
            {errors[name].message as string}
          </p>
        )}
      </div>
      <input
        className={errors[name] && "border-red-500 dark:border-red-400"}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...register(name, { required: required })}
      />
    </label>
  );
}

interface RHFInputProps<TFieldValues extends FieldValues> {
  label: string;
  name: Path<TFieldValues>;
  type: React.HTMLInputTypeAttribute;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  required: boolean;
  placeholder?: string;
  autoComplete?: string;
  icon?: React.ReactElement | null;
}
