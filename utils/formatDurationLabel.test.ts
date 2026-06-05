import { formatDurationLabel } from "@/utils/formatDurationLabel";

describe("formatDurationLabel", () => {
  it("clamps negative durations to zero", () => {
    expect(formatDurationLabel(-12)).toBe("0:00");
  });

  it("formats whole minutes and seconds", () => {
    expect(formatDurationLabel(65)).toBe("1:05");
    expect(formatDurationLabel(600)).toBe("10:00");
  });
});
