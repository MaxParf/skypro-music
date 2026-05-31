import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Track } from "@/types/track";

export type PlayerState = {
  currentTrack: Track | null;
  isPlaying: boolean;
};

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrentTrack(state, action: PayloadAction<Track | null>) {
      state.currentTrack = action.payload;
    },
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
  },
});

export const { setCurrentTrack, setIsPlaying } = playerSlice.actions;
export const playerReducer = playerSlice.reducer;
