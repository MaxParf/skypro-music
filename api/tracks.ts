import { requestJson } from "@/api/client";
import type { ApiResponse } from "@/types/api";
import type { ApiTrack, Track } from "@/types/track";
import { formatDurationLabel } from "@/utils/formatDurationLabel";
import { markTracksFavoriteState } from "@/utils/trackFavorites";

const getReleaseYear = (value: string) => {
  if (!value) {
    return null;
  }

  const parsedYear = new Date(value).getFullYear();

  return Number.isNaN(parsedYear) ? null : parsedYear;
};

export const apiTrackToTrack = (track: ApiTrack): Track => ({
  id: track._id,
  apiId: track._id,
  title: track.name,
  author: track.author,
  album: track.album,
  duration: formatDurationLabel(track.duration_in_seconds),
  durationInSeconds: track.duration_in_seconds,
  genre: track.genre[0] ?? "Без жанра",
  releaseYear: getReleaseYear(track.release_date),
  audioSrc: track.track_file,
  favoriteUserIds: track.staredUser,
  isFavorite: false,
});

const mapApiTracks = (tracks: ApiTrack[], userId: number | null) =>
  markTracksFavoriteState(tracks.map(apiTrackToTrack), userId);

export async function fetchTracks(userId: number | null = null) {
  const response = await requestJson<ApiResponse<ApiTrack[]>>(
    "/catalog/track/all/",
    {
      method: "GET",
    },
  );

  return mapApiTracks(response.data, userId);
}

export async function fetchFavoriteTracks(
  accessToken: string,
  userId: number,
) {
  const response = await requestJson<ApiResponse<ApiTrack[]>>(
    "/catalog/track/favorite/all/",
    {
      method: "GET",
      token: accessToken,
    },
  );

  return mapApiTracks(response.data, userId);
}

export async function addFavoriteTrack(accessToken: string, trackId: number) {
  await requestJson<ApiResponse<string>>(`/catalog/track/${trackId}/favorite/`, {
    method: "POST",
    token: accessToken,
  });
}

export async function removeFavoriteTrack(accessToken: string, trackId: number) {
  await requestJson<ApiResponse<string>>(`/catalog/track/${trackId}/favorite/`, {
    method: "DELETE",
    token: accessToken,
  });
}
