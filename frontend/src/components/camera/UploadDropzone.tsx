"use client";

import { useId, useRef, useState } from "react";
import { clsx } from "clsx";
import { ACCEPT_ATTRIBUTE } from "./validation";

export interface UploadDropzoneProps {
  onFileChosen: (file: File) => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;
}

const MAX_TOUCH_TARGET = "min-h-[56px]";

/**
 * Drag-and-drop + file-picker upload surface.
 * Local-only: validates in the parent, never uploads anywhere.
 */
export function UploadDropzone({ onFileChosen, disabled = false, loading = false, error }: UploadDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCount = useRef(0);
  const [dragging, setDragging] = useState(false);
  const isBusy = disabled || loading;

  const openPicker = () => {
    if (isBusy) return;
    inputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCount.current = 0;
    setDragging(false);
    if (isBusy) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onFileChosen(file);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={isBusy ? -1 : 0}
        aria-label="Upload a leaf photo. Press Enter to choose a file, or drag and drop an image here."
        aria-disabled={isBusy}
        aria-describedby={error ? `${inputId}-error` : `${inputId}-hint`}
        onClick={openPicker}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !isBusy) {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          if (isBusy) return;
          dragCount.current += 1;
          setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          dragCount.current = Math.max(0, dragCount.current - 1);
          if (dragCount.current === 0) setDragging(false);
        }}
        onDrop={handleDrop}
        className={clsx(
          "flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2",
          dragging
            ? "border-primary-500 bg-primary-50"
            : error
              ? "border-error-500 bg-error-50/40"
              : "border-neutral-300 bg-white hover:border-primary-400 hover:bg-primary-50/40",
          isBusy && "cursor-not-allowed opacity-60"
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            dragging ? "bg-primary-600 text-white" : "bg-primary-50 text-primary-700"
          )}
        >
          {loading ? (
            <svg className="h-7 w-7 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </span>

        <span>
          <span className="block text-base font-semibold text-neutral-900">
            {loading ? "Reading your photo…" : dragging ? "Drop your photo here" : "Drag your photo here"}
          </span>
          <span id={`${inputId}-hint`} className="mt-1 block text-sm text-neutral-600">
            {loading ? "This only takes a moment." : "or tap below to choose from your phone"}
          </span>
        </span>

        <span
          className={clsx(
            "inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 font-medium text-white transition-colors hover:bg-primary-700",
            MAX_TOUCH_TARGET,
            "pointer-events-none min-w-[220px] text-base"
          )}
        >
          {loading ? "Please wait…" : "Choose photo"}
        </span>

        <span className="text-xs text-neutral-500">JPG, PNG, or WEBP · up to 10 MB · stays on your phone</span>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          disabled={isBusy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file && !isBusy) onFileChosen(file);
          }}
        />
      </div>

      {error && (
        <p id={`${inputId}-error`} role="alert" className="mt-3 flex items-start gap-2 rounded-xl border border-error-100 bg-error-50 px-4 py-3 text-sm text-error-700">
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
