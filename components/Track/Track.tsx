"use client";

import { useCallback, useState } from "react";
import classNames from "classnames";
import { usePlayer } from "@/components/PlayerProvider/PlayerProvider";
import {
  addTrackToFavorites,
  removeTrackFromFavorites,
} from "@/store/tracksSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { Track as TrackItem } from "@/types/track";
import styles from "./Track.module.css";

type TrackProps = {
  track: TrackItem;
  playlist?: TrackItem[];
};

export function Track({ track, playlist }: TrackProps) {
  const dispatch = useAppDispatch();
  const { currentTrackId, isPlaying, selectTrack } = usePlayer();
  const { user } = useAppSelector((state) => state.auth);
  const pendingLikeIds = useAppSelector((state) => state.tracks.pendingLikeIds);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const isCurrentTrack = currentTrackId === track.id;
  const isLikePending = pendingLikeIds.includes(track.id);

  const handleFavoriteClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setFavoriteError(null);

      if (!user) {
        setFavoriteError("Войдите, чтобы добавить трек в избранное");
        return;
      }

      const action = track.isFavorite
        ? removeTrackFromFavorites(track.id)
        : addTrackToFavorites(track.id);

      const result = await dispatch(action);

      if (addTrackToFavorites.rejected.match(result)) {
        setFavoriteError(
          result.payload ?? "Не удалось добавить трек в избранное.",
        );
      }

      if (removeTrackFromFavorites.rejected.match(result)) {
        setFavoriteError(
          result.payload ?? "Не удалось удалить трек из избранного.",
        );
      }
    },
    [dispatch, track.id, track.isFavorite, user],
  );

  return (
    <div className={styles.item}>
      <div
        className={classNames(styles.track, {
          [styles.trackActive]: isCurrentTrack,
        })}
      >
        <button
          type="button"
          className={styles.trackButton}
          onClick={() => selectTrack(track, playlist)}
          aria-pressed={isCurrentTrack}
        >
          <div className={styles.title}>
            <div className={styles.titleImage}>
              {currentTrackId === track.id && isPlaying ? (
                <span className={styles.playingDot} aria-hidden="true" />
              ) : (
                <svg className={styles.titleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-note" />
                </svg>
              )}
            </div>
            <div className={styles.titleText}>
              <span className={styles.titleLink}>
                {track.title}
                {track.titleNote ? (
                  <>
                    {" "}
                    <span className={styles.titleSpan}>{track.titleNote}</span>
                  </>
                ) : null}
              </span>
            </div>
          </div>

          <div className={styles.author}>
            <span className={styles.authorLink}>{track.author}</span>
          </div>

          <div className={styles.album}>
            <span className={styles.albumLink}>{track.album}</span>
          </div>
        </button>

        <div className={styles.time}>
          <button
            type="button"
            className={classNames(styles.favoriteButton, {
              [styles.favoriteButtonActive]: track.isFavorite,
              [styles.favoriteButtonLoading]: isLikePending,
            })}
            onClick={(event) => void handleFavoriteClick(event)}
            disabled={isLikePending}
            aria-label={
              track.isFavorite
                ? "Удалить трек из избранного"
                : "Добавить трек в избранное"
            }
            aria-pressed={track.isFavorite}
          >
            <svg className={styles.timeSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-like" />
            </svg>
          </button>
          <span className={styles.timeText}>{track.duration}</span>
        </div>
      </div>

      {favoriteError ? <p className={styles.error}>{favoriteError}</p> : null}
    </div>
  );
}
