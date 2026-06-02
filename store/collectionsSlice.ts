import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCollectionById } from "@/api/collections";
import { fetchTracks as fetchTracksFromApi } from "@/api/tracks";
import type { RootState } from "@/store/store";
import type { Collection } from "@/types/collection";
import type { Track } from "@/types/track";
import { getErrorMessage } from "@/utils/getErrorMessage";

type CollectionPayload = {
  collection: Collection;
  tracks: Track[];
};

type CollectionsState = {
  activeCollection: Collection | null;
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
};

const initialState: CollectionsState = {
  activeCollection: null,
  tracks: [],
  isLoading: false,
  error: null,
};

export const fetchCollectionTracks = createAsyncThunk<
  CollectionPayload,
  number,
  { rejectValue: string; state: RootState }
>("collections/fetchCollectionTracks", async (collectionId, thunkApi) => {
  try {
    const [collection, tracks] = await Promise.all([
      fetchCollectionById(collectionId),
      thunkApi.getState().tracks.tracks.length > 0
        ? Promise.resolve(thunkApi.getState().tracks.tracks)
        : fetchTracksFromApi(),
    ]);

    const collectionTracks = collection.trackIds
      .map((trackId) => tracks.find((track) => track.id === trackId) ?? null)
      .filter((track): track is Track => track !== null);

    return {
      collection,
      tracks: collectionTracks,
    };
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

const collectionsSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollectionTracks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCollectionTracks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeCollection = action.payload.collection;
        state.tracks = action.payload.tracks;
      })
      .addCase(fetchCollectionTracks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Не удалось загрузить подборку.";
      });
  },
});

export const collectionsReducer = collectionsSlice.reducer;
