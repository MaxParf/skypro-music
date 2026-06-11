import { API_BASE_URL } from "@/api/constants";
import { ApiError } from "@/types/api";

type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  headers?: HeadersInit;
  token?: string | null;
};

const buildHeaders = (headers?: HeadersInit, token?: string | null) => {
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("content-type")) {
    requestHeaders.set("content-type", "application/json");
  }

  if (token) {
    requestHeaders.set("authorization", `Bearer ${token}`);
  }

  return requestHeaders;
};

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError("Сервер вернул некорректный ответ.", response.status);
  }
};

export async function requestJson<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, token, ...init } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: buildHeaders(headers, token),
  });

  const payload = await parseJsonResponse<unknown>(response);

  if (!response.ok) {
    throw ApiError.fromResponse(response.status, payload);
  }

  return payload as T;
}
