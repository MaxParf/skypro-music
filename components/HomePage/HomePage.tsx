"use client";

import { useEffect } from "react";
import { Centerblock } from "@/components/Centerblock/Centerblock";
import { MusicPageLayout } from "@/components/MusicPageLayout/MusicPageLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPlaylist } from "@/store/playerSlice";
import { fetchTracks } from "@/store/tracksSlice";

export function HomePage() {
  const dispatch = useAppDispatch();
  const { currentTrack, playlist } = useAppSelector((state) => state.player);
  const { error, isLoading, tracks } = useAppSelector((state) => state.tracks);

  useEffect(() => {
    if (!isLoading && tracks.length === 0 && !error) {
      void dispatch(fetchTracks());
    }
  }, [dispatch, error, isLoading, tracks.length]);

  useEffect(() => {
    if (tracks.length === 0 || currentTrack !== null || playlist.length > 0) {
      return;
    }

    dispatch(setPlaylist(tracks));
  }, [currentTrack, dispatch, playlist.length, tracks]);

  return (
    <MusicPageLayout>
      <Centerblock
        title="Треки"
        tracks={tracks}
        isLoading={isLoading}
        error={error}
        onRetry={() => {
          void dispatch(fetchTracks());
        }}
      />
    </MusicPageLayout>
  );
}
