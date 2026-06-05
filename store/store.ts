import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/store/authSlice";
import { collectionsReducer } from "@/store/collectionsSlice";
import { playerReducer } from "@/store/playerSlice";
import { tracksReducer } from "@/store/tracksSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      collections: collectionsReducer,
      player: playerReducer,
      tracks: tracksReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
