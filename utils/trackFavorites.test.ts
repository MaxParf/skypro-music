import type { Track } from "@/types/track";
import {
  isTrackFavoriteForUser,
  markTrackFavoriteState,
  markTracksFavoriteState,
  updateTrackFavoriteState,
  updateTracksFavoriteState,
} from "@/utils/trackFavorites";

const track: Track = {
  id: 1,
  apiId: 1,
  title: "Track",
  author: "Author",
  album: "Album",
  duration: "3:00",
  durationInSeconds: 180,
  genre: "Pop",
  releaseYear: 2024,
  audioSrc: "/audio/1.mp3",
  favoriteUserIds: [7],
  isFavorite: false,
};

describe("trackFavorites", () => {
  it("checks favorite state for a user", () => {
    expect(isTrackFavoriteForUser(track.favoriteUserIds, 7)).toBe(true);
    expect(isTrackFavoriteForUser(track.favoriteUserIds, null)).toBe(false);
  });

  it("marks a single track favorite state", () => {
    expect(markTrackFavoriteState(track, 7).isFavorite).toBe(true);
    expect(markTrackFavoriteState(track, null).isFavorite).toBe(false);
  });

  it("marks multiple tracks favorite state", () => {
    const result = markTracksFavoriteState(
      [track, { ...track, id: 2, apiId: 2, favoriteUserIds: [] }],
      7,
    );

    expect(result.map((item) => item.isFavorite)).toEqual([true, false]);
  });

  it("adds favorite user without duplication", () => {
    const result = updateTrackFavoriteState(track, 8, true);

    expect(result.favoriteUserIds).toEqual([7, 8]);
    expect(updateTrackFavoriteState(track, 7, true).favoriteUserIds).toEqual([7]);
  });

  it("removes favorite user and updates favorite flag", () => {
    const result = updateTrackFavoriteState(track, 7, false);

    expect(result.favoriteUserIds).toEqual([]);
    expect(result.isFavorite).toBe(false);
  });

  it("updates only the matching track in a list", () => {
    const otherTrack = { ...track, id: 2, apiId: 2, favoriteUserIds: [] };

    expect(
      updateTracksFavoriteState([track, otherTrack], 2, 5, true).map(
        (item) => item.favoriteUserIds,
      ),
    ).toEqual([[7], [5]]);
  });
});
