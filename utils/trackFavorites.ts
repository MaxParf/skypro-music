import type { Track } from "@/types/track";

export const isTrackFavoriteForUser = (
  favoriteUserIds: number[],
  userId: number | null,
) => userId !== null && favoriteUserIds.includes(userId);

export const markTrackFavoriteState = (
  track: Track,
  userId: number | null,
): Track => ({
  ...track,
  isFavorite: isTrackFavoriteForUser(track.favoriteUserIds, userId),
});

export const markTracksFavoriteState = (
  tracks: Track[],
  userId: number | null,
): Track[] => tracks.map((track) => markTrackFavoriteState(track, userId));

export const updateTrackFavoriteState = (
  track: Track,
  userId: number,
  isFavorite: boolean,
): Track => {
  const favoriteUserIds = isFavorite
    ? track.favoriteUserIds.includes(userId)
      ? track.favoriteUserIds
      : [...track.favoriteUserIds, userId]
    : track.favoriteUserIds.filter((favoriteUserId) => favoriteUserId !== userId);

  return {
    ...track,
    favoriteUserIds,
    isFavorite,
  };
};

export const updateTracksFavoriteState = (
  tracks: Track[],
  trackId: number,
  userId: number,
  isFavorite: boolean,
): Track[] =>
  tracks.map((track) =>
    track.id === trackId
      ? updateTrackFavoriteState(track, userId, isFavorite)
      : track,
  );
