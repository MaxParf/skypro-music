import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getTokenPair, loginUser, registerUser } from "@/api/auth";
import type {
  AuthTokens,
  AuthUser,
  LoginCredentials,
  PersistedAuthState,
  SignUpCredentials,
} from "@/types/auth";
import { readStoredAuth, writeStoredAuth } from "@/utils/authStorage";
import { getErrorMessage } from "@/utils/getErrorMessage";

type AuthState = {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
};

const initialState: AuthState = {
  user: null,
  tokens: null,
  isLoading: false,
  error: null,
  isHydrated: false,
};

const mapUser = (user: { _id: number; email: string; username: string }): AuthUser => ({
  id: user._id,
  email: user.email,
  username: user.username,
});

export const hydrateAuthFromStorage = createAsyncThunk<PersistedAuthState | null>(
  "auth/hydrate",
  async () => readStoredAuth(),
);

export const signUp = createAsyncThunk<
  { message: string },
  SignUpCredentials,
  { rejectValue: string }
>("auth/signUp", async (credentials, { rejectWithValue }) => {
  try {
    const response = await registerUser(credentials);

    return { message: response.message };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const signIn = createAsyncThunk<
  PersistedAuthState,
  LoginCredentials,
  { rejectValue: string }
>("auth/signIn", async (credentials, { rejectWithValue }) => {
  try {
    const [userResponse, tokens] = await Promise.all([
      loginUser(credentials),
      getTokenPair(credentials),
    ]);

    const payload = {
      user: mapUser(userResponse),
      tokens,
    };

    writeStoredAuth(payload);

    return payload;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      if (!state.tokens) {
        return;
      }

      state.tokens.access = action.payload;
    },
    logout(state) {
      state.user = null;
      state.tokens = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuthFromStorage.fulfilled, (state, action) => {
        state.user = action.payload?.user ?? null;
        state.tokens = action.payload?.tokens ?? null;
        state.isHydrated = true;
      })
      .addCase(hydrateAuthFromStorage.rejected, (state) => {
        state.isHydrated = true;
      })
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Не удалось зарегистрироваться.";
      })
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Не удалось войти.";
      });
  },
});

export const { clearAuthError, logout, setAccessToken } = authSlice.actions;
export const authReducer = authSlice.reducer;
