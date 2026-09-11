"use client";

import type { FileValidationResult } from "./types";

/** File types a farmer can reasonably be expected to provide from a phone. */
export const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

/** Used for the native <input accept="..."> attribute. */
export const ACCEPT_ATTRIBUTE = "image/jpeg,image/png,image/webp";

/** 10 MB — generous enough for modern phone photos, small enough to stay usable. */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateImageFile(file: File | null | undefined): FileValidationResult {
  if (!file) {
    return {
      ok: false,
      errorKind: "invalid-file",
      message: "We couldn't read that file. Please try choosing a photo again.",
    };
  }

  // Some browsers report an empty MIME type for valid images — fall back to extension.
  const hasKnownMime = (ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type);
  const lowerName = file.name.toLowerCase();
  const hasKnownExtension = ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));

  if (!hasKnownMime && !hasKnownExtension) {
    // Distinguish "not an image at all" from "image type we don't support" via message only.
    const isImage = file.type.startsWith("image/");
    return {
      ok: false,
      errorKind: isImage ? "unsupported-type" : "invalid-file",
      message: isImage
        ? "We can't use this photo type. Please choose a JPG, PNG, or WEBP photo."
        : "This doesn't look like a photo. Please choose a JPG, PNG, or WEBP image.",
    };
  }

  if (file.size === 0) {
    return {
      ok: false,
      errorKind: "invalid-file",
      message: "This photo file looks empty. Please try a different photo.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      errorKind: "too-large",
      message: `This photo is too large (${formatFileSize(file.size)}). Please choose a photo under ${formatFileSize(MAX_FILE_SIZE_BYTES)}.`,
    };
  }

  return { ok: true };
}

export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function revokePreviewUrl(url: string | null | undefined): void {
  if (url && url.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Revocation is best-effort; a stale blob URL is harmless for a prototype.
    }
  }
}
