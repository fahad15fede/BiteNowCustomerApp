import { AuthResponse, LoginRequest, RegisterRequest, User } from "../types";
import { apiRequest } from "./apiClient";

// ─────────────────────────────────────────────
// REAL server now. Same function names and types as the fake version,
// so authSlice and the screens don't change.
// ─────────────────────────────────────────────

// POST /auth/login
export function login(data: LoginRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: { ...data, email: data.email.trim() },
  });
}

// POST /auth/register
export function register(data: RegisterRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: { ...data, email: data.email.trim() },
  });
}

// GET /auth/me: "who does this token belong to?" (used when the app starts)
export function getMe(): Promise<User> {
  return apiRequest<User>("/auth/me");
}

// Logout: JWTs aren't stored on the server, so there's nothing to tell it (yet).
// The app forgets the token, and that's the logout.
export async function logout(): Promise<void> {}