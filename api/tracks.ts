import { requestJson } from "@/api/client";
import type { ApiResponse } from "@/types/api";
import type { ApiTrack, Track } from "@/types/track";
import { formatDurationLabel } from "@/utils/formatDurationLabel";

const getReleaseYear = (value: string) => {
  if (!value) {
    return null;
  }

  const parsedYear = new Date(value).getFullYear();

  return Number.isNaN(parsedYear) ? null : parsedYear;
};

export const apiTrackToTrack = (track: ApiTrack): Track => ({
  id: track._id,
  title: track.name,
  author: track.author,
  album: track.album,
  duration: formatDurationLabel(track.duration_in_seconds),
  genre: track.genre[0] ?? "Без жанра",
  releaseYear: getReleaseYear(track.release_date),
  audioSrc: track.track_file,
});

export async function fetchTracks() {
  const response = await requestJson<ApiResponse<ApiTrack[]>>(
    "/catalog/track/all/",
    {
      method: "GET",
    },
  );

  return response.data.map(apiTrackToTrack);
}
