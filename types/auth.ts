export type AuthUser = {
  id: number;
  email: string;
  username: string;
};

export type SignUpCredentials = {
  email: string;
  password: string;
  username: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type LoginResponse = {
  _id: number;
  email: string;
  username: string;
};

export type SignUpResponse = {
  message: string;
  result: LoginResponse;
  success: boolean;
};

export type RefreshTokenRequest = {
  refresh: string;
};

export type RefreshTokenResponse = {
  access: string;
};

export type PersistedAuthState = {
  tokens: AuthTokens;
  user: AuthUser;
};
