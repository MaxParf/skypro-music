export type Track = {
  id: number;
  apiId: number;
  title: string;
  titleNote?: string;
  author: string;
  album: string;
  duration: string;
  durationInSeconds: number;
  genre: string;
  releaseYear: number | null;
  audioSrc: string;
  favoriteUserIds: number[];
  isFavorite: boolean;
};

export type ApiTrack = {
  _id: number;
  name: string;
  author: string;
  release_date: string;
  genre: string[];
  duration_in_seconds: number;
  album: string;
  track_file: string;
  staredUser: number[];
};
