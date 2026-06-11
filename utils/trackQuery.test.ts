import type { Track } from "@/types/track";
import {
  applyTrackQuery,
  filterTracksByAuthor,
  filterTracksByGenre,
  getUniqueAuthors,
  getUniqueGenres,
  searchTracks,
  sortTracksByReleaseDate,
} from "@/utils/trackQuery";

const makeTrack = (
  id: number,
  title: string,
  author: string,
  genre: string,
  releaseYear: number | null,
): Track => ({
  id,
  apiId: id,
  title,
  author,
  album: `Album ${id}`,
  duration: "3:00",
  durationInSeconds: 180,
  genre,
  releaseYear,
  audioSrc: `/audio/${id}.mp3`,
  favoriteUserIds: [],
  isFavorite: false,
});

const tracks: Track[] = [
  makeTrack(30, "Run Run", "Beta", "Rock", 2020),
  makeTrack(10, "I'm Fire", "Alpha", "Pop", 2024),
  makeTrack(20, "River", "Alpha", "Rock", 2019),
  makeTrack(40, "Riddle", "Gamma", "Jazz", null),
  makeTrack(50, "Run Away", "Alpha", "Pop", 2024),
];

describe("trackQuery", () => {
  it("searchTracks returns original tracks for empty search", () => {
    expect(searchTracks(tracks, "   ")).toBe(tracks);
  });

  it("searchTracks finds case-insensitive title prefixes", () => {
    expect(searchTracks(tracks, "ru").map((track) => track.title)).toEqual([
      "Run Run",
      "Run Away",
    ]);
    expect(searchTracks(tracks, "IM").map((track) => track.title)).toEqual([
      "I'm Fire",
    ]);
  });

  it("filterTracksByAuthor returns original tracks when author is not selected", () => {
    expect(filterTracksByAuthor(tracks, null)).toBe(tracks);
  });

  it("filterTracksByAuthor filters by exact author", () => {
    expect(filterTracksByAuthor(tracks, "Alpha").map((track) => track.title)).toEqual(
      ["I'm Fire", "River", "Run Away"],
    );
  });

  it("filterTracksByGenre returns original tracks when genre is not selected", () => {
    expect(filterTracksByGenre(tracks, null)).toBe(tracks);
  });

  it("filterTracksByGenre filters by exact genre", () => {
    expect(filterTracksByGenre(tracks, "Rock").map((track) => track.title)).toEqual(
      ["Run Run", "River"],
    );
  });

  it("sortTracksByReleaseDate preserves incoming order by default", () => {
    expect(sortTracksByReleaseDate(tracks, "default")).toBe(tracks);
  });

  it("sortTracksByReleaseDate sorts newest first and keeps ties stable", () => {
    expect(
      sortTracksByReleaseDate(tracks, "newest").map((track) => track.title),
    ).toEqual(["I'm Fire", "Run Away", "Run Run", "River", "Riddle"]);
  });

  it("sortTracksByReleaseDate sorts oldest first and puts unknown years last", () => {
    expect(
      sortTracksByReleaseDate(tracks, "oldest").map((track) => track.title),
    ).toEqual(["River", "Run Run", "I'm Fire", "Run Away", "Riddle"]);
  });

  it("sortTracksByReleaseDate handles unknown years in either comparator position", () => {
    const nullFirstTracks = [
      makeTrack(60, "No Year", "Delta", "Indie", null),
      makeTrack(70, "Known Year", "Delta", "Indie", 2022),
    ];
    const nullSecondTracks = [
      makeTrack(80, "Known Year", "Delta", "Indie", 2022),
      makeTrack(90, "No Year", "Delta", "Indie", null),
    ];

    expect(
      sortTracksByReleaseDate(nullFirstTracks, "newest").map((track) => track.title),
    ).toEqual(["Known Year", "No Year"]);
    expect(
      sortTracksByReleaseDate(nullSecondTracks, "oldest").map((track) => track.title),
    ).toEqual(["Known Year", "No Year"]);
  });

  it("applyTrackQuery combines search, filters, and sorting", () => {
    expect(
      applyTrackQuery(tracks, {
        search: "ru",
        author: "Alpha",
        genre: "Pop",
        sort: "newest",
      }).map((track) => track.title),
    ).toEqual(["Run Away"]);
  });

  it("getUniqueAuthors returns unique sorted authors", () => {
    expect(getUniqueAuthors(tracks)).toEqual(["Alpha", "Beta", "Gamma"]);
  });

  it("getUniqueGenres returns unique sorted genres", () => {
    expect(getUniqueGenres(tracks)).toEqual(["Jazz", "Pop", "Rock"]);
  });
});
