import type { Track } from "@/types/track";

export type TrackReleaseDateSort = "default" | "newest" | "oldest";

export type TrackQuery = {
  search: string;
  author: string | null;
  genre: string | null;
  sort: TrackReleaseDateSort;
};

const normalizeValue = (value: string) =>
  value.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

const compareTracksByNewest = (firstTrack: Track, secondTrack: Track) => {
  const firstYear = firstTrack.releaseYear ?? Number.NEGATIVE_INFINITY;
  const secondYear = secondTrack.releaseYear ?? Number.NEGATIVE_INFINITY;

  if (firstYear === secondYear) {
    return 0;
  }

  return secondYear - firstYear;
};

const compareTracksByOldest = (firstTrack: Track, secondTrack: Track) => {
  const firstYear = firstTrack.releaseYear ?? Number.POSITIVE_INFINITY;
  const secondYear = secondTrack.releaseYear ?? Number.POSITIVE_INFINITY;

  if (firstYear === secondYear) {
    return 0;
  }

  return firstYear - secondYear;
};

const getUniqueValues = (values: string[]) =>
  Array.from(new Set(values)).sort((firstValue, secondValue) =>
    firstValue.localeCompare(secondValue, "ru", { sensitivity: "base" }),
  );

export const searchTracks = (tracks: Track[], search: string) => {
  const normalizedSearch = normalizeValue(search);

  if (!normalizedSearch) {
    return tracks;
  }

  return tracks.filter((track) =>
    normalizeValue(track.title).startsWith(normalizedSearch),
  );
};

export const filterTracksByAuthor = (tracks: Track[], author: string | null) => {
  if (!author) {
    return tracks;
  }

  return tracks.filter((track) => track.author === author);
};

export const filterTracksByGenre = (tracks: Track[], genre: string | null) => {
  if (!genre) {
    return tracks;
  }

  return tracks.filter((track) => track.genre === genre);
};

export const sortTracksByReleaseDate = (
  tracks: Track[],
  sort: TrackReleaseDateSort,
) => {
  if (sort === "default") {
    return tracks;
  }

  const sortedTracks = [...tracks];

  sortedTracks.sort(
    sort === "newest" ? compareTracksByNewest : compareTracksByOldest,
  );

  return sortedTracks;
};

export const applyTrackQuery = (tracks: Track[], query: TrackQuery) => {
  const searchedTracks = searchTracks(tracks, query.search);
  const authorFilteredTracks = filterTracksByAuthor(searchedTracks, query.author);
  const genreFilteredTracks = filterTracksByGenre(
    authorFilteredTracks,
    query.genre,
  );

  return sortTracksByReleaseDate(genreFilteredTracks, query.sort);
};

export const getUniqueAuthors = (tracks: Track[]) =>
  getUniqueValues(tracks.map((track) => track.author));

export const getUniqueGenres = (tracks: Track[]) =>
  getUniqueValues(tracks.map((track) => track.genre));
