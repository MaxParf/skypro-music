export const formatDurationLabel = (durationInSeconds: number) => {
  const safeDuration = Math.max(0, durationInSeconds);
  const minutes = Math.floor(safeDuration / 60);
  const seconds = safeDuration % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};
