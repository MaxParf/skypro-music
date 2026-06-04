"use client";

import { useEffect } from "react";
import { Centerblock } from "@/components/Centerblock/Centerblock";
import { MusicPageLayout } from "@/components/MusicPageLayout/MusicPageLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCollectionTracks } from "@/store/collectionsSlice";

type CollectionPageProps = {
  collectionId: number;
};

export function CollectionPage({ collectionId }: CollectionPageProps) {
  const dispatch = useAppDispatch();
  const { activeCollection, error, isLoading, tracks } = useAppSelector(
    (state) => state.collections,
  );

  useEffect(() => {
    if (Number.isNaN(collectionId)) {
      return;
    }

    void dispatch(fetchCollectionTracks(collectionId));
  }, [collectionId, dispatch]);

  return (
    <MusicPageLayout>
      <Centerblock
        title={activeCollection?.title ?? "Подборка"}
        tracks={tracks}
        isLoading={isLoading}
        error={error}
        onRetry={() => {
          void dispatch(fetchCollectionTracks(collectionId));
        }}
      />
    </MusicPageLayout>
  );
}
