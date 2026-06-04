import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Track } from "@/types/track";

export type PlayerState = {
  currentTrack: Track | null;
  currentTrackIndex: number | null;
  playlist: Track[];
  isPlaying: boolean;
  isShuffle: boolean;
  isLoop: boolean;
  volume: number;
  currentTime: number;
  duration: number;
};

const initialState: PlayerState = {
  currentTrack: null,
  currentTrackIndex: null,
  playlist: [],
  isPlaying: false,
  isShuffle: false,
  isLoop: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
};

const getRandomTrackIndex = (
  playlistLength: number,
  currentTrackIndex: number | null,
) => {
  if (playlistLength <= 1) {
    return 0;
  }

  let randomIndex = Math.floor(Math.random() * playlistLength);

  while (randomIndex === currentTrackIndex) {
    randomIndex = Math.floor(Math.random() * playlistLength);
  }

  return randomIndex;
};

const syncTrackAtIndex = (state: PlayerState, trackIndex: number | null) => {
  state.currentTrackIndex = trackIndex;
  state.currentTrack =
    trackIndex === null ? null : state.playlist[trackIndex] ?? null;
  state.currentTime = 0;
  state.duration = 0;
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlaylist(state, action: PayloadAction<Track[]>) {
      state.playlist = action.payload;

      if (state.currentTrack === null) {
        state.currentTrackIndex = null;
        return;
      }

      const nextIndex = action.payload.findIndex(
        (track) => track.id === state.currentTrack?.id,
      );

      state.currentTrackIndex = nextIndex >= 0 ? nextIndex : null;
      state.currentTrack = nextIndex >= 0 ? action.payload[nextIndex] : null;
    },
    setCurrentTrack(state, action: PayloadAction<Track | null>) {
      const track = action.payload;

      if (track === null) {
        syncTrackAtIndex(state, null);
        state.isPlaying = false;
        return;
      }

      state.currentTrack = track;
      const nextIndex = state.playlist.findIndex(
        (playlistTrack) => playlistTrack.id === track.id,
      );
      state.currentTrackIndex = nextIndex >= 0 ? nextIndex : null;
      state.currentTime = 0;
      state.duration = 0;
    },
    setCurrentTrackByIndex(state, action: PayloadAction<number>) {
      const trackIndex = action.payload;

      if (trackIndex < 0 || trackIndex >= state.playlist.length) {
        return;
      }

      syncTrackAtIndex(state, trackIndex);
    },
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    toggleShuffle(state) {
      state.isShuffle = !state.isShuffle;
    },
    toggleLoop(state) {
      state.isLoop = !state.isLoop;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = Math.min(1, Math.max(0, action.payload));
    },
    setCurrentTime(state, action: PayloadAction<number>) {
      state.currentTime = Math.max(0, action.payload);
    },
    setDuration(state, action: PayloadAction<number>) {
      state.duration = Math.max(0, action.payload);
    },
    playNextTrack(state) {
      if (state.playlist.length === 0 || state.currentTrackIndex === null) {
        return;
      }

      if (state.isShuffle) {
        syncTrackAtIndex(
          state,
          getRandomTrackIndex(state.playlist.length, state.currentTrackIndex),
        );
        return;
      }

      if (state.currentTrackIndex >= state.playlist.length - 1) {
        return;
      }

      syncTrackAtIndex(state, state.currentTrackIndex + 1);
    },
    playPreviousTrack(state) {
      if (state.currentTrackIndex === null || state.currentTrackIndex <= 0) {
        return;
      }

      syncTrackAtIndex(state, state.currentTrackIndex - 1);
    },
  },
});

export const {
  setPlaylist,
  setCurrentTrack,
  setCurrentTrackByIndex,
  setIsPlaying,
  toggleShuffle,
  toggleLoop,
  setVolume,
  setCurrentTime,
  setDuration,
  playNextTrack,
  playPreviousTrack,
} = playerSlice.actions;
export const playerReducer = playerSlice.reducer;
