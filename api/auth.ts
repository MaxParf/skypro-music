import { requestJson } from "@/api/client";
import type {
  AuthTokens,
  LoginCredentials,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SignUpCredentials,
  SignUpResponse,
} from "@/types/auth";

export const registerUser = (credentials: SignUpCredentials) =>
  requestJson<SignUpResponse>("/user/signup/", {
    method: "POST",
    body: credentials,
  });

export const loginUser = (credentials: LoginCredentials) =>
  requestJson<LoginResponse>("/user/login/", {
    method: "POST",
    body: credentials,
  });

export const getTokenPair = (credentials: LoginCredentials) =>
  requestJson<AuthTokens>("/user/token/", {
    method: "POST",
    body: credentials,
  });

export const refreshAccessToken = (payload: RefreshTokenRequest) =>
  requestJson<RefreshTokenResponse>("/user/token/refresh/", {
    method: "POST",
    body: payload,
  });
