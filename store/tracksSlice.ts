import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addFavoriteTrack as addFavoriteTrackRequest,
  fetchFavoriteTracks as fetchFavoriteTracksRequest,
  fetchTracks as fetchTracksFromApi,
  removeFavoriteTrack as removeFavoriteTrackRequest,
} from "@/api/tracks";
import { hydrateAuthFromStorage, logout, signIn } from "@/store/authSlice";
import type { RootState } from "@/store/store";
import type { Track } from "@/types/track";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {
  markTracksFavoriteState,
  updateTrackFavoriteState,
  updateTracksFavoriteState,
} from "@/utils/trackFavorites";
import { withReauth } from "@/utils/withReauth";

type FavoriteStatus = "idle" | "loading" | "succeeded" | "failed";

type TracksState = {
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
  favoriteTracks: Track[];
  favoriteStatus: FavoriteStatus;
  favoriteError: string | null;
  pendingLikeIds: number[];
};

const initialState: TracksState = {
  tracks: [],
  isLoading: false,
  error: null,
  favoriteTracks: [],
  favoriteStatus: "idle",
  favoriteError: null,
  pendingLikeIds: [],
};

const getCurrentUserId = (state: RootState) => state.auth.user?.id ?? null;

const applyFavoriteStateForUser = (
  state: TracksState,
  userId: number | null,
) => {
  state.tracks = markTracksFavoriteState(state.tracks, userId);
  state.favoriteTracks =
    userId === null
      ? []
      : markTracksFavoriteState(state.favoriteTracks, userId).filter(
          (track) => track.isFavorite,
        );
};

export const fetchTracks = createAsyncThunk<
  Track[],
  void,
  { rejectValue: string; state: RootState }
>("tracks/fetchTracks", async (_, { getState, rejectWithValue }) => {
  try {
    return await fetchTracksFromApi(getCurrentUserId(getState()));
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchFavoriteTracks = createAsyncThunk<
  Track[],
  void,
  { rejectValue: string; state: RootState }
>("tracks/fetchFavoriteTracks", async (_, thunkApi) => {
  const state = thunkApi.getState();
  const user = state.auth.user;
  const tokens = state.auth.tokens;

  if (!user || !tokens) {
    return thunkApi.rejectWithValue("Войдите, чтобы посмотреть избранное");
  }

  try {
    return await withReauth({
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
      dispatch: thunkApi.dispatch,
      apiFunction: (accessToken) =>
        fetchFavoriteTracksRequest(accessToken, user.id),
    });
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

export const addTrackToFavorites = createAsyncThunk<
  { trackId: number; userId: number },
  number,
  { rejectValue: string; state: RootState }
>("tracks/addTrackToFavorites", async (trackId, thunkApi) => {
  const state = thunkApi.getState();
  const user = state.auth.user;
  const tokens = state.auth.tokens;

  if (!user || !tokens) {
    return thunkApi.rejectWithValue(
      "Войдите, чтобы добавить трек в избранное",
    );
  }

  try {
    await withReauth({
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
      dispatch: thunkApi.dispatch,
      apiFunction: (accessToken) => addFavoriteTrackRequest(accessToken, trackId),
    });

    return { trackId, userId: user.id };
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

export const removeTrackFromFavorites = createAsyncThunk<
  { trackId: number; userId: number },
  number,
  { rejectValue: string; state: RootState }
>("tracks/removeTrackFromFavorites", async (trackId, thunkApi) => {
  const state = thunkApi.getState();
  const user = state.auth.user;
  const tokens = state.auth.tokens;

  if (!user || !tokens) {
    return thunkApi.rejectWithValue("Войдите, чтобы удалить трек из избранного");
  }

  try {
    await withReauth({
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
      dispatch: thunkApi.dispatch,
      apiFunction: (accessToken) =>
        removeFavoriteTrackRequest(accessToken, trackId),
    });

    return { trackId, userId: user.id };
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
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
      })
      .addCase(fetchFavoriteTracks.pending, (state) => {
        state.favoriteStatus = "loading";
        state.favoriteError = null;
      })
      .addCase(fetchFavoriteTracks.fulfilled, (state, action) => {
        state.favoriteStatus = "succeeded";
        state.favoriteTracks = action.payload;
      })
      .addCase(fetchFavoriteTracks.rejected, (state, action) => {
        state.favoriteStatus = "failed";
        state.favoriteError =
          action.payload ?? "Не удалось загрузить избранные треки.";
      })
      .addCase(addTrackToFavorites.pending, (state, action) => {
        if (!state.pendingLikeIds.includes(action.meta.arg)) {
          state.pendingLikeIds.push(action.meta.arg);
        }
      })
      .addCase(addTrackToFavorites.fulfilled, (state, action) => {
        state.pendingLikeIds = state.pendingLikeIds.filter(
          (trackId) => trackId !== action.payload.trackId,
        );
        state.tracks = updateTracksFavoriteState(
          state.tracks,
          action.payload.trackId,
          action.payload.userId,
          true,
        );

        const existingFavoriteTrack = state.favoriteTracks.find(
          (track) => track.id === action.payload.trackId,
        );

        if (existingFavoriteTrack) {
          state.favoriteTracks = updateTracksFavoriteState(
            state.favoriteTracks,
            action.payload.trackId,
            action.payload.userId,
            true,
          );
        } else {
          const sourceTrack = state.tracks.find(
            (track) => track.id === action.payload.trackId,
          );

          if (sourceTrack) {
            state.favoriteTracks.push(
              updateTrackFavoriteState(sourceTrack, action.payload.userId, true),
            );
          }
        }
      })
      .addCase(addTrackToFavorites.rejected, (state, action) => {
        state.pendingLikeIds = state.pendingLikeIds.filter(
          (trackId) => trackId !== action.meta.arg,
        );
        state.favoriteError =
          action.payload ?? "Не удалось добавить трек в избранное.";
      })
      .addCase(removeTrackFromFavorites.pending, (state, action) => {
        if (!state.pendingLikeIds.includes(action.meta.arg)) {
          state.pendingLikeIds.push(action.meta.arg);
        }
      })
      .addCase(removeTrackFromFavorites.fulfilled, (state, action) => {
        state.pendingLikeIds = state.pendingLikeIds.filter(
          (trackId) => trackId !== action.payload.trackId,
        );
        state.tracks = updateTracksFavoriteState(
          state.tracks,
          action.payload.trackId,
          action.payload.userId,
          false,
        );
        state.favoriteTracks = state.favoriteTracks
          .filter((track) => track.id !== action.payload.trackId)
          .map((track) =>
            updateTrackFavoriteState(track, action.payload.userId, false),
          );
      })
      .addCase(removeTrackFromFavorites.rejected, (state, action) => {
        state.pendingLikeIds = state.pendingLikeIds.filter(
          (trackId) => trackId !== action.meta.arg,
        );
        state.favoriteError =
          action.payload ?? "Не удалось удалить трек из избранного.";
      })
      .addCase(hydrateAuthFromStorage.fulfilled, (state, action) => {
        applyFavoriteStateForUser(state, action.payload?.user.id ?? null);
      })
      .addCase(signIn.fulfilled, (state, action) => {
        applyFavoriteStateForUser(state, action.payload.user.id);
      })
      .addCase(logout, (state) => {
        applyFavoriteStateForUser(state, null);
        state.favoriteStatus = "idle";
        state.favoriteError = null;
        state.pendingLikeIds = [];
      });
  },
});

export const tracksReducer = tracksSlice.reducer;
