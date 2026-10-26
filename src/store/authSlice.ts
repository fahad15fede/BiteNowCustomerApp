import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "../types";
import * as authService from "../services/authService";

// ─────────────────────────────────────────────
// 1. STATE
// ─────────────────────────────────────────────
type AuthStatus = "idle" | "loading" | "failed";

type AuthState = {
  user: User | null;     // null = nobody logged in
  token: string | null;
  status: AuthStatus;    // what's happening right now
  error: string | null;  // message to show on the form
};

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

// Turns any thrown thing into a readable message
const messageFrom = (err: unknown) =>
  err instanceof Error ? err.message : "Something went wrong. Please try again.";

// ─────────────────────────────────────────────
// 2. THUNKS: actions that take time (talk to the "server")
//    <what it returns, what you give it, { rejectValue: error type }>
// ─────────────────────────────────────────────
export const loginUser = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (err) {
      return rejectWithValue(messageFrom(err));
    }
  }
);

export const registerUser = createAsyncThunk<AuthResponse, RegisterRequest, { rejectValue: string }>(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      return await authService.register(data);
    } catch (err) {
      return rejectWithValue(messageFrom(err));
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

// ─────────────────────────────────────────────
// 3. THE SLICE
// ─────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState,

  // Normal, instant actions
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },

  // Reactions to the thunks' 3 stages: pending → fulfilled / rejected
  extraReducers: (builder) => {
    builder
      // ── Login ──
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Login failed.";
      })

      // ── Register ──
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Registration failed.";
      })

      // ── Logout: back to the start ──
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;

// ─────────────────────────────────────────────
// 4. SELECTORS
// ─────────────────────────────────────────────
type WithAuth = { auth: AuthState };

export const selectUser = (state: WithAuth) => state.auth.user;
export const selectIsLoggedIn = (state: WithAuth) => state.auth.user !== null;
export const selectAuthLoading = (state: WithAuth) => state.auth.status === "loading";
export const selectAuthError = (state: WithAuth) => state.auth.error;