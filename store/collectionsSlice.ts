import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCollectionById } from "@/api/collections";
import { fetchTracks as fetchTracksFromApi } from "@/api/tracks";
import { hydrateAuthFromStorage, logout, signIn } from "@/store/authSlice";
import { addTrackToFavorites, removeTrackFromFavorites } from "@/store/tracksSlice";
import type { RootState } from "@/store/store";
import type { Collection } from "@/types/collection";
import type { Track } from "@/types/track";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {
  markTracksFavoriteState,
  updateTracksFavoriteState,
} from "@/utils/trackFavorites";

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

const applyFavoriteStateForUser = (
  state: CollectionsState,
  userId: number | null,
) => {
  state.tracks = markTracksFavoriteState(state.tracks, userId);
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
        : fetchTracksFromApi(thunkApi.getState().auth.user?.id ?? null),
    ]);

    if (!collection) {
      return thunkApi.rejectWithValue("Подборка не найдена");
    }

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
        state.activeCollection = null;
        state.tracks = [];
        state.error = action.payload ?? "Не удалось загрузить подборку.";
      })
      .addCase(addTrackToFavorites.fulfilled, (state, action) => {
        state.tracks = updateTracksFavoriteState(
          state.tracks,
          action.payload.trackId,
          action.payload.userId,
          true,
        );
      })
      .addCase(removeTrackFromFavorites.fulfilled, (state, action) => {
        state.tracks = updateTracksFavoriteState(
          state.tracks,
          action.payload.trackId,
          action.payload.userId,
          false,
        );
      })
      .addCase(hydrateAuthFromStorage.fulfilled, (state, action) => {
        applyFavoriteStateForUser(state, action.payload?.user.id ?? null);
      })
      .addCase(signIn.fulfilled, (state, action) => {
        applyFavoriteStateForUser(state, action.payload.user.id);
      })
      .addCase(logout, (state) => {
        applyFavoriteStateForUser(state, null);
      });
  },
});

export const collectionsReducer = collectionsSlice.reducer;
