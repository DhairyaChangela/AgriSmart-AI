"use client";

/**
 * Shared types for the crop image capture / upload experience.
 * UI-only. No ML, no backend, no automated image assessment.
 */

export type ImageQualityKind =
  | "good"
  | "blurry"
  | "too-dark"
  | "too-bright"
  | "leaf-not-clear"
  | "unsupported"
  | "unknown";

export type UploadErrorKind =
  | "invalid-file"
  | "unsupported-type"
  | "too-large"
  | "upload-failed";

export type CaptureStep = "choose" | "camera" | "upload" | "review";

export interface SelectedImage {
  file: File;
  previewUrl: string;
  name: string;
  sizeBytes: number;
  type: string;
}

export interface FileValidationResult {
  ok: boolean;
  errorKind?: UploadErrorKind;
  /** Farmer-friendly message. Safe to render directly. */
  message?: string;
}

export interface CaptureResult {
  image: SelectedImage;
}
