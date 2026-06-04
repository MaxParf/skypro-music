import { ApiError } from "@/types/api";

export const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Что-то пошло не так. Попробуйте еще раз.";
};
