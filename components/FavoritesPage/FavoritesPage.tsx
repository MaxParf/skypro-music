"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Centerblock } from "@/components/Centerblock/Centerblock";
import { MusicPageLayout } from "@/components/MusicPageLayout/MusicPageLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFavoriteTracks } from "@/store/tracksSlice";

export function FavoritesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const hasResolvedAccess = useRef(false);
  const { isHydrated, user } = useAppSelector((state) => state.auth);
  const { favoriteError, favoriteStatus, favoriteTracks } = useAppSelector(
    (state) => state.tracks,
  );

  const handleRetry = useCallback(() => {
    void dispatch(fetchFavoriteTracks());
  }, [dispatch]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!user) {
      if (!hasResolvedAccess.current) {
        hasResolvedAccess.current = true;
        router.replace("/signin");
      }

      return;
    }

    hasResolvedAccess.current = true;
    void dispatch(fetchFavoriteTracks());
  }, [dispatch, isHydrated, router, user]);

  if (!isHydrated) {
    return (
      <MusicPageLayout>
        <Centerblock title="Мой плейлист" tracks={[]} isLoading />
      </MusicPageLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MusicPageLayout>
      <Centerblock
        title="Мой плейлист"
        tracks={favoriteTracks}
        isLoading={favoriteStatus === "loading"}
        error={favoriteError}
        onRetry={handleRetry}
      />
    </MusicPageLayout>
  );
}
