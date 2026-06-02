import type { PersistedAuthState } from "@/types/auth";

const AUTH_STORAGE_KEY = "skypro-music-auth";

const isBrowser = () => typeof window !== "undefined";

export const readStoredAuth = (): PersistedAuthState | null => {
  if (!isBrowser()) {
    return null;
  }

  const value = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<PersistedAuthState>;

    if (
      parsed.tokens?.access &&
      parsed.tokens.refresh &&
      parsed.user?.email &&
      parsed.user.username &&
      typeof parsed.user.id === "number"
    ) {
      return {
        tokens: parsed.tokens,
        user: parsed.user,
      };
    }
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return null;
};

export const writeStoredAuth = (value: PersistedAuthState) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
};

export const clearStoredAuth = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};
