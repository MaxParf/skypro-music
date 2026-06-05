import { refreshToken } from "@/api/auth";
import { setAccessToken, logout } from "@/store/authSlice";
import { ApiError } from "@/types/api";
import { clearStoredAuth, updateStoredAccessToken } from "@/utils/authStorage";

type AuthDispatch = (
  action: ReturnType<typeof setAccessToken> | ReturnType<typeof logout>
) => unknown;

type WithReauthOptions<T> = {
  accessToken: string;
  refreshToken: string;
  dispatch: AuthDispatch;
  apiFunction: (accessToken: string) => Promise<T>;
};

export async function withReauth<T>({
  accessToken,
  refreshToken: refreshTokenValue,
  dispatch,
  apiFunction,
}: WithReauthOptions<T>): Promise<T> {
  try {
    return await apiFunction(accessToken);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error;
    }

    try {
      const { access } = await refreshToken(refreshTokenValue);

      dispatch(setAccessToken(access));
      updateStoredAccessToken(access);

      return await apiFunction(access);
    } catch (refreshError) {
      clearStoredAuth();
      dispatch(logout());

      throw refreshError instanceof ApiError && refreshError.status !== 401
        ? refreshError
        : new Error("Сессия истекла. Войдите снова");
    }
  }
}
