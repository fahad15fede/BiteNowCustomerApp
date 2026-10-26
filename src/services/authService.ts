import { AuthResponse, LoginRequest, RegisterRequest, User } from "../types";

// ─────────────────────────────────────────────
// FAKE SERVER. Everything in this file will later be replaced by
// real calls to FastAPI. Screens and Redux will NOT need to change.
// ─────────────────────────────────────────────

// Pretend the network takes a moment (like a real server)
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Pretend database of users (lives in memory, resets when the app restarts)
// ⚠️ Fake only: a real server NEVER stores plain passwords
const fakeUsers: (User & { password: string })[] = [
  {
    id: "1",
    name: "Muhammad Fahad",
    email: "fahad@gmail.com",
    phone: "03001234567",
    role: "customer",
    password: "123456",
  },
];

// Remove the password before sending a user back to the app
const withoutPassword = ({ password, ...user }: User & { password: string }): User => user;

// Fake token, e.g. "fake-token-1-1714000000000"
const makeToken = (userId: string) => `fake-token-${userId}-${Date.now()}`;

// ─────────────────────────────────────────────
// LOGIN   (later: POST /auth/login)
// ─────────────────────────────────────────────
export async function login({ email, password }: LoginRequest): Promise<AuthResponse> {
  await wait(800);

  const found = fakeUsers.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  // Same message for "no such email" and "wrong password" (on purpose)
  if (!found || found.password !== password) {
    throw new Error("Incorrect email or password.");
  }

  return { user: withoutPassword(found), token: makeToken(found.id) };
}

// ─────────────────────────────────────────────
// REGISTER   (later: POST /auth/register)
// ─────────────────────────────────────────────
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  await wait(800);

  const email = data.email.trim().toLowerCase();

  if (fakeUsers.some((u) => u.email.toLowerCase() === email)) {
    throw new Error("An account with this email already exists.");
  }
  if (data.password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const newUser = {
    id: String(Date.now()),
    name: data.name.trim(),
    email,
    phone: data.phone.trim(),
    role: "customer" as const, // this app only creates customers
    password: data.password,
  };
  fakeUsers.push(newUser);

  return { user: withoutPassword(newUser), token: makeToken(newUser.id) };
}

// ─────────────────────────────────────────────
// LOGOUT   (later: maybe tell the server to cancel the token)
// ─────────────────────────────────────────────
export async function logout(): Promise<void> {
  await wait(300);
}