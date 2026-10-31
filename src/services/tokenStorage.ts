import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// ─────────────────────────────────────────────
// Saves the login token so you stay logged in after closing the app.
// Phone: encrypted secure storage (iOS Keychain / Android Keystore).
// Web:   browser localStorage (less safe, only for testing in the browser).
// ─────────────────────────────────────────────

const TOKEN_KEY = "bitenow_auth_token";

// Browser storage, safely: some browsers block it (private mode etc.)
const webStorage = {
  get(): string | null {
    try {
      return globalThis.localStorage?.getItem(TOKEN_KEY) ?? null;
    } catch {
      return null;
    }
  },
  set(value: string) {
    try {
      globalThis.localStorage?.setItem(TOKEN_KEY, value);
    } catch {
      // ignore: the user just won't stay logged in on this browser
    }
  },
  remove() {
    try {
      globalThis.localStorage?.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  },
};

export async function saveToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    webStorage.set(token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function loadToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return webStorage.get();
  }
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    // Storage can fail (e.g. after a phone restore). Treat as "not logged in".
    return null;
  }
}

export async function deleteToken(): Promise<void> {
  if (Platform.OS === "web") {
    webStorage.remove();
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}