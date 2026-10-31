// ─────────────────────────────────────────────
// The ONLY file in the app that knows how to talk HTTP.
// Every service (auth, restaurants, orders…) uses this.
// ─────────────────────────────────────────────

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not set. Add it to .env and restart Expo.");
}

const TIMEOUT_MS = 15000;

// ── The token for every request (kept in memory, set by authSlice) ──
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

// ── One error type for the whole app ──
export class ApiError extends Error {
  status: number; // HTTP status (0 = couldn't reach the server)
  code: string;   // our backend's error.code, e.g. "email_taken"

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body } = options;

  // 1. Headers: JSON + the token if we're logged in
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  // 2. Give up if the server takes too long
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch {
    // No internet, wrong IP, server off, or timeout
    throw new ApiError(0, "network_error", "Can't reach the server. Check your connection.");
  } finally {
    clearTimeout(timer);
  }

  // 3. Read the JSON (some responses may have no body)
  const data = await response.json().catch(() => null);

  // 4. Error? Turn our backend's { error: { code, message } } into an ApiError
  if (!response.ok) {
    const code = data?.error?.code ?? "unknown_error";
    const message = data?.error?.message ?? "Something went wrong. Please try again.";
    throw new ApiError(response.status, code, message);
  }

  return data as T;
}