import { formatTime } from "@/utils/formatTime";

describe("formatTime", () => {
  it("returns 0:00 for non-finite and non-positive values", () => {
    expect(formatTime(Number.NaN)).toBe("0:00");
    expect(formatTime(Infinity)).toBe("0:00");
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(-10)).toBe("0:00");
  });

  it("formats minutes and seconds", () => {
    expect(formatTime(65)).toBe("1:05");
    expect(formatTime(125.9)).toBe("2:05");
  });
});
