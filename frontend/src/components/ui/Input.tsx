"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, LabelHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

const inputStyles = {
  base: `
    w-full rounded-xl border bg-white
    text-neutral-900 placeholder:text-neutral-400
    transition-all duration-200 ease-out
    disabled:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
    focus:border-primary-500
  `,
  sizes: {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-base",
    lg: "h-13 px-5 text-lg",
  } as const,
  withLeftIcon: "pl-11",
  withRightIcon: "pr-11",
  error: "border-error-500 focus:border-error-500 focus:ring-error-500",
  fullWidth: "w-full",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className,
      id,
      size = "md",
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={clsx(fullWidth && inputStyles.fullWidth)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-body-sm font-medium text-neutral-700 mb-2"
          >
            {label}
            {required && <span className="text-error-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none flex items-center justify-center"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              inputStyles.base,
              inputStyles.sizes[size],
              leftIcon && inputStyles.withLeftIcon,
              rightIcon && inputStyles.withRightIcon,
              error && inputStyles.error,
              className
            )}
            disabled={disabled}
            required={required}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={describedBy}
            aria-required={required}
            {...props}
          />
          {rightIcon && !error && (
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none flex items-center justify-center"
              aria-hidden="true"
            >
              {rightIcon}
            </div>
          )}
          {error && (
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-error-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-body-sm text-error-600 flex items-center gap-1" role="alert">
            <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-body-sm text-neutral-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      fullWidth = true,
      className,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${textareaId}-error` : undefined;
    const hintId = hint ? `${textareaId}-hint` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={clsx(fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-body-sm font-medium text-neutral-700 mb-2"
          >
            {label}
            {required && <span className="text-error-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(
            "w-full rounded-xl border bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400",
            "transition-all duration-200 ease-out",
            "disabled:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
            "focus:border-primary-500 resize-y min-h-[100px]",
            error && "border-error-500 focus:border-error-500 focus:ring-error-500",
            className
          )}
          disabled={disabled}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={describedBy}
          aria-required={required}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-body-sm text-error-600 flex items-center gap-1" role="alert">
            <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-body-sm text-neutral-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, required, className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={clsx("block text-body-sm font-medium text-neutral-700 mb-1.5", className)}
        {...props}
      >
        {children}
        {required && <span className="text-error-500 ml-1" aria-hidden="true">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";