/**
 * Minimal HTTP layer for the diagnosis provider.
 *
 * Owns the only fetch() call in the journey. Kept deliberately small:
 * it resolves the API base URL, POSTs a multipart form, enforces a
 * timeout, and never lets raw transport errors reach the UI.
 */

/**
 * Development default, matching `.env.example`. Production deployments
 * set NEXT_PUBLIC_API_BASE_URL and this fallback is unused.
 */
const DEV_API_BASE_URL = "http://localhost:8000";

/** HTTP-level failure — a response was received but it was not 2xx. */
export class ApiHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly detail?: string
  ) {
    super(message);
    this.name = "ApiHttpError";
  }
}

export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (fromEnv && fromEnv.trim()) {
    return fromEnv.replace(/\/+$/, "");
  }
  return DEV_API_BASE_URL;
}

const REQUEST_TIMEOUT_MS = 30_000;

/**
 * POST `formData` to `${baseUrl}${path}` and return the parsed JSON body.
 *
 * Throws:
 * - `ApiHttpError` for any non-2xx HTTP status (with the backend `detail`
 *   message when the response is a FastAPI error object).
 * - `Error` for unreachable/timeout conditions (no response at all).
 */
export async function postFormData(
  path: string,
  formData: FormData
): Promise<unknown> {
  const url = `${getApiBaseUrl()}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("The analysis request timed out.");
    }
    throw new Error("The analysis service could not be reached.");
  } finally {
    clearTimeout(timer);
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const detail =
      body &&
      typeof body === "object" &&
      "detail" in body &&
      typeof body.detail === "string"
        ? body.detail
        : undefined;
    throw new ApiHttpError(
      `Request failed with status ${response.status}`,
      response.status,
      detail
    );
  }

  return body;
}