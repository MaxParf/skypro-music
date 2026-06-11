import { ApiError } from "@/types/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

describe("getErrorMessage", () => {
  it("returns ApiError message", () => {
    expect(getErrorMessage(new ApiError("API problem", 500))).toBe("API problem");
  });

  it("returns generic Error message", () => {
    expect(getErrorMessage(new Error("Plain problem"))).toBe("Plain problem");
  });

  it("returns fallback message for unknown errors", () => {
    expect(getErrorMessage("oops")).toBe(
      "Что-то пошло не так. Попробуйте еще раз.",
    );
  });
});
