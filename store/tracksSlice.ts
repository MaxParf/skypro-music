import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchTracks as fetchTracksFromApi } from "@/api/tracks";
import type { Track } from "@/types/track";
import { getErrorMessage } from "@/utils/getErrorMessage";

type TracksState = {
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TracksState = {
  tracks: [],
  isLoading: false,
  error: null,
};

export const fetchTracks = createAsyncThunk<
  Track[],
  void,
  { rejectValue: string }
>("tracks/fetchTracks", async (_, { rejectWithValue }) => {
  try {
    return await fetchTracksFromApi();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const tracksSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tracks = action.payload;
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Не удалось загрузить треки.";
      });
  },
});

export const tracksReducer = tracksSlice.reducer;
