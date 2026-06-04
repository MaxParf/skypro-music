export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type ApiErrorResponse = {
  message?: string;
  detail?: string;
  code?: string;
  errors?: Record<string, string[]>;
};

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return true;
};

const getFieldErrorsMessage = (value: Record<string, string[]>) =>
  Object.values(value)
    .flat()
    .join(" ");

export class ApiError extends Error {
  status: number;

  payload?: ApiErrorResponse;

  constructor(message: string, status: number, payload?: ApiErrorResponse) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }

  static fromResponse(status: number, payload: unknown) {
    if (!isApiErrorResponse(payload)) {
      return new ApiError("Не удалось выполнить запрос.", status);
    }

    const message =
      payload.message ||
      payload.detail ||
      (payload.errors ? getFieldErrorsMessage(payload.errors) : "") ||
      "Не удалось выполнить запрос.";

    return new ApiError(message, status, payload);
  }
}
