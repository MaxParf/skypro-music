export type Track = {
  id: number;
  title: string;
  titleNote?: string;
  author: string;
  album: string;
  duration: string;
  genre: string;
  releaseYear: number | null;
  audioSrc: string;
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
};
