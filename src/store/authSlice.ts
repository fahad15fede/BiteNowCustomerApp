import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "../types";
import * as authService from "../services/authService";
import { ApiError, setAuthToken } from "../services/apiClient";
import { deleteToken, loadToken, saveToken } from "../services/tokenStorage";

// ─────────────────────────────────────────────
// 1. STATE
// ─────────────────────────────────────────────
type AuthStatus = "idle" | "loading" | "failed";

type AuthState = {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  error: string | null;
  isRestoring: boolean; // 🆕 true while checking for a saved login at app start
};

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
  isRestoring: true,
};

const messageFrom = (err: unknown) =>
  err instanceof Error ? err.message : "Something went wrong. Please try again.";

// 🆕 After login/register: remember the token in BOTH places
async function startSession(res: AuthResponse): Promise<AuthResponse> {
  setAuthToken(res.token);                     // memory → sent with every request
  await saveToken(res.token).catch(() => {});  // secure storage → survives restarts
  return res;
}

// 🆕 Forget the token everywhere
async function endSession(): Promise<void> {
  setAuthToken(null);
  await deleteToken().catch(() => {});
}

// ─────────────────────────────────────────────
// 2. THUNKS
// ─────────────────────────────────────────────
export const loginUser = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await startSession(await authService.login(credentials));
    } catch (err) {
      return rejectWithValue(messageFrom(err));
    }
  }
);

export const registerUser = createAsyncThunk<AuthResponse, RegisterRequest, { rejectValue: string }>(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      return await startSession(await authService.register(data));
    } catch (err) {
      return rejectWithValue(messageFrom(err));
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
  await endSession();
});

// 🆕 Runs once when the app starts: "was I logged in before?"
export const restoreSession = createAsyncThunk<AuthResponse | null>(
  "auth/restore",
  async () => {
    const token = await loadToken();
    if (!token) return null; // never logged in → Login screen

    setAuthToken(token);
    try {
      const user = await authService.getMe(); // ask the server: is this token still good?
      return { user, token };
    } catch (err) {
      // Token expired or user removed → forget it
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        await endSession();
      } else {
        // Server unreachable → don't delete the token; try again next start
        setAuthToken(null);
      }
      return null;
    }
  }
);

// ─────────────────────────────────────────────
// 3. THE SLICE
// ─────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
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

      // ── 🆕 Restore at app start ──
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isRestoring = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isRestoring = false; // never get stuck on the loading screen
      })

      // ── Logout ──
      .addCase(logoutUser.fulfilled, () => ({ ...initialState, isRestoring: false }));
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
export const selectIsRestoring = (state: WithAuth) => state.auth.isRestoring; // 🆕